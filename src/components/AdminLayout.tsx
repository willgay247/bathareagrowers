import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { emoji: "🏠", label: "Dashboard", to: "/admin" },
  { emoji: "📅", label: "Events", to: "/admin/events" },
  { emoji: "🌿", label: "Community Gardens", to: "/admin/community-gardens" },
  { emoji: "🌱", label: "Supported Gardening", to: "/admin/supported-gardening" },
  { emoji: "🦋", label: "Wildlife Gardening", to: "/admin/wildlife-gardening" },
  { emoji: "🚜", label: "Farms", to: "/admin/farms" },
  { emoji: "♻️", label: "Surplus Projects", to: "/admin/surplus-projects" },
  { emoji: "📚", label: "Courses", to: "/admin/courses" },
  { emoji: "📄", label: "Resources", to: "/admin/resources" },
  "divider",
  { emoji: "📬", label: "Contacts (CRM)", to: "/admin/contacts" },
] as const;

type NavItem = { emoji: string; label: string; to: string };

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-[240px] flex flex-col"
        style={{ backgroundColor: "#1E1E1E" }}
      >
        <div className="px-4 py-5">
          <span
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            BAG Admin
          </span>
        </div>

        <nav className="flex-1 flex flex-col overflow-y-auto">
          {navItems.map((item, i) => {
            if (item === "divider") {
              return (
                <div
                  key={`div-${i}`}
                  className="my-1 mx-4 border-t border-white/20"
                />
              );
            }
            const nav = item as NavItem;
            const active = isActive(nav.to);
            return (
              <Link
                key={nav.to}
                to={nav.to}
                className="flex items-center gap-2 px-4 py-3 text-sm text-white transition-colors"
                style={{
                  fontFamily: "'Readex Pro', sans-serif",
                  backgroundColor: active ? "#702757" : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#702757";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                }}
              >
                <span>{nav.emoji}</span>
                <span>{nav.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/20">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            <span>↗</span>
            <span>View Site</span>
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="ml-[240px] flex-1 min-h-screen bg-white p-8"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
