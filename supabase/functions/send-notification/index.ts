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

const escape = (s: string | null | undefined) =>
  (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface NewSignupPayload {
  kind: "new_signup";
  user_id: string;
}

interface MemberApprovedPayload {
  kind: "member_approved";
  user_id: string;
}

type Payload = NewSignupPayload | MemberApprovedPayload;

async function sendMail(opts: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  if (!apiKey) throw new Error("BREVO_API_KEY not configured");

  const body = {
    sender: {
      name: Deno.env.get("NOTIFY_FROM_NAME") ?? "Bath Area Growers",
      email: Deno.env.get("NOTIFY_FROM_EMAIL") ?? "info@bathareagrowers.org",
    },
    to: [{ email: opts.to, ...(opts.toName ? { name: opts.toName } : {}) }],
    subject: opts.subject,
    htmlContent: opts.html,
    textContent: opts.text,
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo API ${res.status}: ${errBody}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!payload?.user_id || !payload.kind) {
    return json({ error: "Missing user_id or kind" }, 400);
  }

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: { user }, error: userErr } = await adminClient.auth.admin.getUserById(payload.user_id);
  if (userErr || !user) return json({ error: "User not found" }, 404);

  const { data: profile } = await adminClient
    .from("member_profiles")
    .select("group_name, group_type, bio, applicant_message")
    .eq("user_id", payload.user_id)
    .maybeSingle();

  const siteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://bathareagrowers.org";
  const groupName = profile?.group_name ?? "(no group name)";
  const groupType = profile?.group_type ?? "Not set";
  const bio = profile?.bio ?? "";
  const applicantMessage = profile?.applicant_message ?? "";

  try {
    if (payload.kind === "new_signup") {
      const adminEmail = Deno.env.get("ADMIN_NOTIFY_EMAIL");
      if (!adminEmail) return json({ error: "ADMIN_NOTIFY_EMAIL not set" }, 500);

      const subject = `New member signup: ${groupName}`;
      const adminUrl = `${siteUrl}/admin/settings`;
      const html = `
        <h2>New member signup pending approval</h2>
        <p>A new account has been created on bathareagrowers.org and is awaiting your review.</p>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${escape(user.email ?? "")}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Group name</td><td style="padding:6px 12px">${escape(groupName)}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold">Group type</td><td style="padding:6px 12px">${escape(groupType)}</td></tr>
          ${bio ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Bio</td><td style="padding:6px 12px">${escape(bio).replace(/\n/g, "<br>")}</td></tr>` : ""}
          ${applicantMessage ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Reason for applying</td><td style="padding:6px 12px">${escape(applicantMessage).replace(/\n/g, "<br>")}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px">
          <a href="${adminUrl}" style="background:#702757;color:white;padding:10px 18px;text-decoration:none;border-radius:6px">Review in admin</a>
        </p>
      `;
      const text = [
        "New member signup pending approval.",
        "",
        `Email: ${user.email ?? ""}`,
        `Group name: ${groupName}`,
        `Group type: ${groupType}`,
        bio ? `Bio: ${bio}` : "",
        applicantMessage ? `Reason for applying: ${applicantMessage}` : "",
        "",
        `Review in admin: ${adminUrl}`,
      ].filter(Boolean).join("\n");

      await sendMail({ to: adminEmail, subject, html, text });
      return json({ success: true });
    }

    if (payload.kind === "member_approved") {
      if (!user.email) return json({ error: "User has no email" }, 400);

      const subject = "Your Bath Area Growers account is approved";
      const dashboardUrl = `${siteUrl}/dashboard`;
      const html = `
        <h2>You're approved</h2>
        <p>Hi${groupName !== "(no group name)" ? ` ${escape(groupName)}` : ""},</p>
        <p>An admin has just approved your Bath Area Growers account. You can now sign in and start posting events${profile?.group_type ? " and managing your listing" : ""}.</p>
        <p style="margin-top:24px">
          <a href="${dashboardUrl}" style="background:#702757;color:white;padding:10px 18px;text-decoration:none;border-radius:6px">Go to your dashboard</a>
        </p>
        <p style="color:#666;font-size:13px;margin-top:24px">If you have any questions, reply to this email.</p>
      `;
      const text = [
        "You're approved.",
        "",
        `An admin has approved your Bath Area Growers account. You can now sign in and start posting events.`,
        "",
        `Dashboard: ${dashboardUrl}`,
      ].join("\n");

      await sendMail({ to: user.email, subject, html, text });
      return json({ success: true });
    }

    return json({ error: "Unknown kind" }, 400);
  } catch (err) {
    console.error("send-notification error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
