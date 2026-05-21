import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUserRole, SECTION_NAV_MAP } from "@/hooks/useCurrentUserRole";

const allNavItems = [
  { emoji: "🏠", label: "Dashboard", to: "/admin", section: null },
  { emoji: "📅", label: "Events", to: "/admin/events", section: "events" },
  { emoji: "🌿", label: "Community Gardens", to: "/admin/community-gardens", section: "community_gardens" },
  { emoji: "🌱", label: "Supported Gardening", to: "/admin/supported-gardening", section: "supported_gardening" },
  { emoji: "🦋", label: "Wildlife Gardening", to: "/admin/wildlife-gardening", section: "wildlife_gardening" },
  { emoji: "🚜", label: "Farms", to: "/admin/farms", section: "farms" },
  { emoji: "♻️", label: "Surplus Projects", to: "/admin/surplus-projects", section: "surplus_projects" },
  { emoji: "📚", label: "Courses", to: "/admin/courses", section: "courses" },
  { emoji: "📄", label: "Resources", to: "/admin/resources", section: "resources" },
  "divider" as const,
  { emoji: "📬", label: "Contacts (CRM)", to: "/admin/contacts", section: "contacts" },
];

type NavItem = { emoji: string; label: string; to: string; section: string | null };

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminOrAbove, canAccessSection, loading } = useCurrentUserRole();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  // Filter nav items based on permissions
  const visibleNavItems = allNavItems.filter((item) => {
    if (item === "divider") return true;
    const nav = item as NavItem;
    if (nav.section === null) return true; // Dashboard always visible
    return canAccessSection(nav.section);
  });

  // Remove trailing divider if contacts section is hidden
  const cleanedNavItems = visibleNavItems.filter((item, i, arr) => {
    if (item === "divider" && (i === arr.length - 1 || arr[i + 1] === "divider")) return false;
    return true;
  });

  return (
    <div className="admin-layout flex min-h-screen">
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

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
          {cleanedNavItems.map((item, i) => {
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
          {/* Settings — only for admin/super_admin */}
          {isAdminOrAbove && (
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
              style={{
                fontFamily: "'Readex Pro', sans-serif",
                backgroundColor: isActive("/admin/settings") ? "#702757" : undefined,
              }}
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          )}
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
