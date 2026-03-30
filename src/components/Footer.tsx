import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61559512830019", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/bath_area_growers/", label: "Instagram" },
  { icon: Mail, href: "mailto:Info@bathareagrowers.org", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-accent py-10 px-4">
      <div className="mx-auto max-w-container text-center text-foreground-alt">
        {/* Newsletter signup */}
        <h3 className="font-bold text-[20px] mb-4">
          Sign up to the Bath Area Growers newsletter
        </h3>
        <form
          action="http://eepurl.com/iSlf1U"
          method="POST"
          target="_blank"
          className="mx-auto mb-8 flex max-w-[420px]"
        >
          <input
            type="email"
            name="EMAIL"
            required
            placeholder="Your email address"
            className="flex-1 min-w-0 rounded-l-[4px] rounded-r-none border border-foreground-alt/30 bg-white/10 px-3 py-3 text-[15px] text-foreground-alt placeholder:text-foreground-alt/60 outline-none focus:border-foreground-alt"
          />
          <button
            type="submit"
            className="rounded-l-none rounded-r-[4px] bg-foreground-alt px-6 py-3 text-[15px] font-semibold text-accent transition-colors hover:bg-foreground-alt/90"
          >
            Subscribe
          </button>
          <input type="text" name="b_" tabIndex={-1} value="" readOnly className="absolute left-[-5000px]" aria-hidden="true" />
        </form>

        {/* Org info */}
        <p className="text-[18px] font-bold">Bath Area Growers</p>
        <p className="mt-2 text-[14px]">
          Email:{" "}
          <a href="mailto:info@bathareagrowers.org" className="text-foreground-alt underline hover:text-foreground-alt">
            info@bathareagrowers.org
          </a>
        </p>
        <p className="mt-1 text-[14px]">Tel 07913617822</p>

        {/* Social + Contact link */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-foreground-alt transition-colors hover:text-foreground-alt/70"
            >
              <Icon size={20} />
            </a>
          ))}
          <span className="text-foreground-alt/40">·</span>
          <Link to="/contact" className="text-[14px] text-foreground-alt underline hover:text-foreground-alt/70">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
