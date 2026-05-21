import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Verify caller
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const token = authHeader.replace("Bearer ", "");
  const { data: { user: caller }, error: authError } = await adminClient.auth.getUser(token);
  if (authError || !caller) return json({ error: "Unauthorized" }, 401);

  // Check caller's role
  const { data: callerRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", caller.id)
    .single();

  if (!callerRole || !["admin", "super_admin"].includes(callerRole.role)) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    if (req.method === "GET") {
      // List all users that have roles
      const { data: roles } = await adminClient.from("user_roles").select("*");
      const { data: perms } = await adminClient.from("user_section_permissions").select("*");
      const { data: profiles } = await adminClient
        .from("member_profiles")
        .select("user_id, group_name, group_type, bio, applicant_message");

      if (!roles) return json([]);

      const userIds = roles.map((r) => r.user_id);
      const enriched = [];

      for (const uid of userIds) {
        const { data: { user } } = await adminClient.auth.admin.getUserById(uid);
        if (!user) continue;
        const profile = profiles?.find((p) => p.user_id === user.id);
        enriched.push({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          role: roles.find((r) => r.user_id === user.id)?.role || null,
          permissions: perms?.filter((p) => p.user_id === user.id) || [],
          group_name: profile?.group_name ?? null,
          group_type: profile?.group_type ?? null,
          bio: profile?.bio ?? null,
          applicant_message: profile?.applicant_message ?? null,
        });
      }

      return json(enriched);
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action } = body;

      if (action === "create_user") {
        const { email, password, role } = body;

        // Admin can only create users
        if (callerRole.role === "admin" && role !== "user") {
          return json({ error: "Admins can only create users" }, 403);
        }
        // Nobody can create super_admins
        if (role === "super_admin") {
          return json({ error: "Cannot create super admins" }, 403);
        }

        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (createError) throw createError;

        const { error: roleError } = await adminClient
          .from("user_roles")
          .insert({ user_id: newUser.user.id, role });
        if (roleError) throw roleError;

        return json({ id: newUser.user.id, email, role });
      }

      if (action === "delete_user") {
        const { user_id } = body;

        if (user_id === caller.id) {
          return json({ error: "Cannot delete yourself" }, 400);
        }

        const { data: targetRole } = await adminClient
          .from("user_roles")
          .select("role")
          .eq("user_id", user_id)
          .single();

        if (callerRole.role === "admin" && targetRole?.role !== "user") {
          return json({ error: "Admins can only remove users" }, 403);
        }
        if (targetRole?.role === "super_admin") {
          return json({ error: "Cannot delete super admins" }, 403);
        }

        await adminClient.from("user_section_permissions").delete().eq("user_id", user_id);
        await adminClient.from("user_roles").delete().eq("user_id", user_id);
        const { error: delError } = await adminClient.auth.admin.deleteUser(user_id);
        if (delError) throw delError;

        return json({ success: true });
      }

      if (action === "update_role") {
        const { user_id, role } = body;

        if (callerRole.role !== "super_admin") {
          return json({ error: "Only super admins can change roles" }, 403);
        }
        if (user_id === caller.id) {
          return json({ error: "Cannot change your own role" }, 400);
        }
        if (role === "super_admin") {
          return json({ error: "Cannot promote to super admin" }, 403);
        }

        const { error: updateError } = await adminClient
          .from("user_roles")
          .update({ role })
          .eq("user_id", user_id);
        if (updateError) throw updateError;

        // If promoting to admin, clear section permissions (admins get full access)
        if (role === "admin") {
          await adminClient.from("user_section_permissions").delete().eq("user_id", user_id);
        }

        return json({ success: true });
      }
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    console.error("manage-users error:", err);
    return json({ error: "Request failed" }, 500);
  }
});
