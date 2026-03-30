import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem =
  | { label: string; path: string }
  | { label: string; children: { label: string; path: string }[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "Locations",
    children: [
      { label: "Community Gardens", path: "/community-gardens" },
      { label: "Farms", path: "/farms" },
    ],
  },
  {
    label: "Doing Good",
    children: [
      { label: "Supported Gardening", path: "/supported-gardening" },
      { label: "Wildlife Gardening", path: "/wildlife-gardening" },
      { label: "Surplus Projects", path: "/surplus-projects" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Courses", path: "/courses" },
      { label: "Events", path: "/events" },
      { label: "Helpful Links", path: "/resources" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

function isDropdown(item: NavItem): item is { label: string; children: { label: string; path: string }[] } {
  return "children" in item;
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const location = useLocation();

  const isChildActive = (children: { path: string }[]) =>
    children.some((c) => location.pathname === c.path);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-alt backdrop-blur-[8px]">
      <div className="mx-auto max-w-container px-4">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-center gap-x-6 py-2">
          {NAV_ITEMS.map((item) =>
            isDropdown(item) ? (
              <div key={item.label} className="relative group">
                <button
                  className={`inline-flex items-center gap-1 text-[15px] leading-tight text-foreground no-underline transition-colors hover:text-accent ${
                    isChildActive(item.children) ? "text-accent font-semibold" : ""
                  }`}
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 hidden group-hover:flex flex-col min-w-[200px] bg-background-alt shadow-lg rounded-md border border-border py-1 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`px-4 py-2 text-[14px] text-foreground no-underline transition-colors hover:bg-muted hover:text-accent ${
                        location.pathname === child.path ? "text-accent font-semibold" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[15px] leading-tight text-foreground no-underline transition-colors hover:text-accent ${
                  location.pathname === item.path ? "text-accent font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            )
          )}
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
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              isDropdown(item) ? (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                    className={`w-full flex items-center justify-between py-2 text-[15px] text-foreground no-underline transition-colors hover:text-accent ${
                      isChildActive(item.children) ? "text-accent font-semibold" : ""
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openGroup === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openGroup === item.label && (
                    <div className="flex flex-col pl-4 gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={`py-1.5 text-[14px] text-foreground no-underline transition-colors hover:text-accent ${
                            location.pathname === child.path ? "text-accent font-semibold" : ""
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2 text-[15px] text-foreground no-underline transition-colors hover:text-accent ${
                    location.pathname === item.path ? "text-accent font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
