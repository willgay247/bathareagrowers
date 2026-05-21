import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const subnavItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/events", label: "My Events" },
  { to: "/dashboard/listing", label: "My Listing" },
  { to: "/dashboard/profile", label: "Profile" },
];

const MemberLayout = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Navbar />
      <nav className="border-b border-border bg-background" aria-label="Member dashboard">
        <div className="relative mx-auto max-w-container px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-thin">
            {subnavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                    isActive
                      ? "bg-accent text-foreground-alt"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-auto whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Sign out
            </button>
          </div>
          {/* Subtle right-edge fade hints scrollability on narrow screens */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent md:hidden" aria-hidden="true" />
        </div>
      </nav>
      <main className="mx-auto max-w-container px-4 py-8 min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MemberLayout;
