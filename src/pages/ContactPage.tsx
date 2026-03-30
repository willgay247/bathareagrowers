import { useState } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) errors.email = "A valid email is required.";
    if (form.message.trim().length > 0 && form.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setErrorMsg("");

    if (honeypot) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setStatus("sending");

    try {
      const response = await supabase.functions.invoke("submit-contact", {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || null,
          message: form.message.trim() || null,
        },
      });

      if (response.error || response.data?.error) {
        setErrorMsg(response.data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main>
      <SEO
        title="Contact Bath Area Growers"
        description="Get in touch with Bath Area Growers. Share news about your growing project, ask questions, or find out how to get involved in community growing across Bath."
      />
      <section
        className="relative flex h-[50vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3559-e1713291506509-200x200.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Contact</h1>
      </section>

      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row gap-10">
          <form onSubmit={handleSubmit} className="md:w-[60%] flex flex-col gap-3">
            {status === "success" && (
              <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800 mb-2">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {status === "error" && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800 mb-2">
                {errorMsg}
              </div>
            )}

            {/* Honeypot */}
            <input
              type="text"
              name="_hp_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <label className="text-[14px] font-semibold text-foreground">Your Name *
              <input required type="text" name="full_name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
              {validationErrors.name && <span className="text-red-600 text-xs">{validationErrors.name}</span>}
            </label>
            <label className="text-[14px] font-semibold text-foreground">Your Email *
              <input required type="email" name="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
              {validationErrors.email && <span className="text-red-600 text-xs">{validationErrors.email}</span>}
            </label>
            <label className="text-[14px] font-semibold text-foreground">Subject
              <input type="text" name="subject" maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-[14px] font-semibold text-foreground">Your Message
              <textarea name="message" rows={6} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none resize-y focus:border-accent" />
              {validationErrors.message && <span className="text-red-600 text-xs">{validationErrors.message}</span>}
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 h-12 w-full bg-accent text-[14px] font-bold uppercase tracking-wider text-foreground-alt transition-colors hover:bg-accent-secondary disabled:opacity-60"
            >
              {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
            </button>
          </form>

          <div className="md:w-[40%]">
            <div className="bg-accent p-8 text-foreground-alt">
              <h3 className="text-[20px] font-bold">Bath Area Growers</h3>
              <p className="mt-4 text-[14px]">
                Email:{" "}
                <a href="mailto:info@bathareagrowers.org" className="text-foreground-alt underline">info@bathareagrowers.org</a>
              </p>
              <p className="mt-2 text-[14px]">Tel: 07913617822</p>
              <div className="mt-6 flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61559512830019" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-foreground-alt hover:text-accent-foreground"><Facebook size={20} /></a>
                <a href="https://www.instagram.com/bath_area_growers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground-alt hover:text-accent-foreground"><Instagram size={20} /></a>
                <a href="mailto:info@bathareagrowers.org" aria-label="Email" className="text-foreground-alt hover:text-accent-foreground"><Mail size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
