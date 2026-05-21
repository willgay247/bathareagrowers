import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import EventFormModal from "@/components/admin/EventFormModal";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const MemberEventsPage = () => {
  const { canAddInSection, canEditRecord, userId, loading: roleLoading } = useCurrentUserRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", userId)
      .order("event_date", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (roleLoading || !userId) return;
    fetchEvents();
    supabase
      .from("member_profiles")
      .select("group_name")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setGroupName(data?.group_name ?? null));
  }, [roleLoading, userId]);

  if (roleLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!canAddInSection("events")) {
    return (
      <div className="rounded-lg border border-border bg-white p-8">
        <h1 className="text-2xl font-bold text-foreground">My events</h1>
        <p className="mt-2 text-sm text-foreground">
          You don't yet have permission to post events. An admin will enable this when your account is approved.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">My events</h1>
        <Button
          onClick={() => { setEditingEvent(null); setModalOpen(true); }}
          className="bg-accent text-foreground-alt hover:bg-accent/90"
        >
          + Add new event
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Visibility</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const canEdit = canEditRecord("events", (e as { created_by?: string | null }).created_by);
              return (
                <tr key={e.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{e.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.date_display || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {e.hidden ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">Hidden</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Live</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canEdit && (
                      <button
                        onClick={() => { setEditingEvent(e); setModalOpen(true); }}
                        className="text-accent hover:underline text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  You haven't posted any events yet. Click "Add new event" above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <EventFormModal
          event={editingEvent}
          onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          onSaved={() => { setModalOpen(false); setEditingEvent(null); fetchEvents(); }}
          createdBy={userId}
          defaultOrganiser={groupName ?? undefined}
        />
      )}
    </div>
  );
};

export default MemberEventsPage;
