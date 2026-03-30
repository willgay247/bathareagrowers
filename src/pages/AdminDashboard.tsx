import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StatCard {
  label: string;
  count: number;
  to: string;
}

interface ContactRow {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  is_read: boolean | null;
  created_at: string | null;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [messages, setMessages] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tables: { table: string; label: string; to: string; filter?: Record<string, unknown> }[] = [
        { table: "events", label: "Events", to: "/admin/events" },
        { table: "community_gardens", label: "Community Gardens", to: "/admin/community-gardens" },
        { table: "supported_gardening", label: "Supported Gardening", to: "/admin/supported-gardening" },
        { table: "wildlife_gardening_entries", label: "Wildlife Gardening", to: "/admin/wildlife-gardening" },
        { table: "farms", label: "Farms", to: "/admin/farms" },
        { table: "surplus_projects", label: "Surplus Projects", to: "/admin/surplus-projects" },
        { table: "courses", label: "Courses", to: "/admin/courses" },
        { table: "resources", label: "Resources", to: "/admin/resources" },
      ];

      const counts = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase
            .from(t.table as any)
            .select("*", { count: "exact", head: true });
          return { label: t.label, count: count ?? 0, to: t.to };
        })
      );

      // Unread messages count
      const { count: unreadCount } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false)
        .eq("is_archived", false);

      counts.push({
        label: "Unread Messages",
        count: unreadCount ?? 0,
        to: "/admin/contacts",
      });

      setStats(counts);

      // Recent messages
      const { data: recentMessages } = await supabase
        .from("contact_submissions")
        .select("id, name, email, subject, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      setMessages((recentMessages as ContactRow[]) ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-[32px] font-bold mb-8"
        style={{ fontFamily: "'Readex Pro', sans-serif", color: "#1E1E1E" }}
      >
        Dashboard
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="block rounded-2xl border border-primary p-6 bg-white hover:shadow-md transition-shadow"
          >
            <div
              className="text-5xl font-bold"
              style={{ color: "#702757", fontFamily: "'Readex Pro', sans-serif" }}
            >
              {stat.count}
            </div>
            <div
              className="mt-2 text-sm"
              style={{ color: "#666", fontFamily: "'Readex Pro', sans-serif" }}
            >
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: "'Readex Pro', sans-serif", color: "#1E1E1E" }}
      >
        Recent Contact Submissions
      </h2>

      {messages.length === 0 ? (
        <p className="text-sm" style={{ color: "#666" }}>
          No contact submissions yet.
        </p>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to="/admin/contacts"
              className="flex items-center gap-4 rounded-lg border border-primary p-4 hover:shadow-sm transition-shadow"
            >
              {/* Unread dot */}
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: msg.is_read ? "transparent" : "#702757",
                }}
              />
              <span
                className="font-medium text-sm w-32 truncate"
                style={{ fontFamily: "'Readex Pro', sans-serif" }}
              >
                {msg.name || "—"}
              </span>
              <span className="text-sm text-muted-foreground w-40 truncate">
                {msg.email || "—"}
              </span>
              <span className="text-sm text-muted-foreground flex-1 truncate">
                {msg.subject || "—"}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {msg.created_at
                  ? new Date(msg.created_at).toLocaleDateString()
                  : "—"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
