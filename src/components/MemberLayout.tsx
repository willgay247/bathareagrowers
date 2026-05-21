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
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-container items-center gap-1 px-4 py-3 overflow-x-auto">
          {subnavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
            className="ml-auto whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign out
          </button>
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
