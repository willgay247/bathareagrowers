import { useState } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:info@bathareagrowers.org?subject=${encodeURIComponent(form.subject || "Website enquiry")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <main>
      <section
        className="relative flex h-[50vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3559-e1713291506509-200x200.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Contact</h1>
      </section>

      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:w-[60%] flex flex-col gap-3">
            <label className="text-[14px] font-semibold text-foreground">Your Name *
              <input required type="text" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-[14px] font-semibold text-foreground">Your Email *
              <input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-[14px] font-semibold text-foreground">Subject
              <input type="text" maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-[14px] font-semibold text-foreground">Your Message
              <textarea rows={6} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 block w-full border border-background-inverse bg-white p-3 text-[15px] text-foreground outline-none resize-y focus:border-accent" />
            </label>
            <button type="submit" className="mt-2 h-12 w-full bg-background-inverse text-[14px] font-bold uppercase tracking-wider text-foreground-alt transition-colors hover:bg-accent">
              SEND MESSAGE
            </button>
          </form>

          {/* Info card */}
          <div className="md:w-[40%]">
            <div className="bg-background-inverse p-8 text-foreground-alt">
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
