import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Community Gardens", path: "/community-gardens" },
  { label: "Supported Gardening", path: "/supported-gardening" },
  { label: "Farms", path: "/farms" },
  { label: "Wildlife Gardening", path: "/wildlife-gardening" },
  { label: "Surplus Projects", path: "/surplus-projects" },
  { label: "Courses", path: "/courses" },
  { label: "Resources", path: "/resources" },
  { label: "Events", path: "/events" },
  { label: "Contact", path: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61559512830019", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/bath_area_growers/", label: "Instagram" },
  { icon: Mail, href: "mailto:Info@bathareagrowers.org", label: "Email" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background-alt backdrop-blur-[8px]">
      {/* Row 1: Social icons */}
      <div className="mx-auto max-w-container px-4">
        <div className="flex items-center gap-3 py-2">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="text-foreground transition-colors hover:text-accent"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Row 2: Nav links (desktop) + hamburger (mobile) */}
      <div className="mx-auto max-w-container px-4">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-center flex-wrap gap-x-5 gap-y-1 py-2">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-[15px] leading-tight text-foreground no-underline transition-colors hover:text-accent ${
                location.pathname === path ? "text-accent font-semibold" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center justify-end py-2">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-foreground transition-colors hover:text-accent"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden bg-background-alt backdrop-blur-[8px] px-4 pb-4">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`text-[15px] text-foreground no-underline transition-colors hover:text-accent ${
                  location.pathname === path ? "text-accent font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
