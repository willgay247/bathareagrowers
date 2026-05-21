import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : null;
    const message = typeof body.message === "string" ? body.message.trim() : null;

    // Validate required fields
    if (!name || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name is required and must be under 100 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || !isValidEmail(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "A valid email address is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (subject && subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject must be under 200 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message && message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message must be under 2000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name,
      email,
      subject: subject || null,
      message: message || null,
    });

    if (error) {
      console.error("Insert error:", error.message);
      return new Response(
        JSON.stringify({ error: "Failed to submit. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Notify admin via Brevo (best-effort; don't fail the submission if email fails)
    try {
      const brevoKey = Deno.env.get("BREVO_API_KEY");
      const adminEmail = Deno.env.get("ADMIN_NOTIFY_EMAIL");
      const fromEmail = Deno.env.get("NOTIFY_FROM_EMAIL") ?? "info@bathareagrowers.org";
      const fromName = Deno.env.get("NOTIFY_FROM_NAME") ?? "Bath Area Growers";
      const siteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://bathareagrowers.org";

      if (brevoKey && adminEmail) {
        const escape = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

        const subjectLine = subject ? `Contact form: ${subject}` : `New contact form submission from ${name}`;
        const html = `
          <h2>New contact form submission</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
            <tr><td style="padding:6px 12px;font-weight:bold">From</td><td style="padding:6px 12px">${escape(name)}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px"><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
            ${subject ? `<tr><td style="padding:6px 12px;font-weight:bold">Subject</td><td style="padding:6px 12px">${escape(subject)}</td></tr>` : ""}
            ${message ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:6px 12px">${escape(message).replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
          <p style="margin-top:24px">
            <a href="${siteUrl}/admin/contacts" style="background:#702757;color:white;padding:10px 18px;text-decoration:none;border-radius:6px">View in admin</a>
          </p>
        `;
        const text = [
          "New contact form submission",
          "",
          `From: ${name}`,
          `Email: ${email}`,
          subject ? `Subject: ${subject}` : "",
          message ? `Message: ${message}` : "",
          "",
          `View in admin: ${siteUrl}/admin/contacts`,
        ].filter(Boolean).join("\n");

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": brevoKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: fromName, email: fromEmail },
            to: [{ email: adminEmail }],
            replyTo: { email, name },
            subject: subjectLine,
            htmlContent: html,
            textContent: text,
          }),
        });
      }
    } catch (notifyErr) {
      console.error("Contact-form admin notification failed:", notifyErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Invalid request." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
