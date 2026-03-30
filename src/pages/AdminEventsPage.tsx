import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EventFormModal from "@/components/admin/EventFormModal";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { canAddInSection, canEditRecord, canDeleteInSection, canToggleHidden, userId, isAdminOrAbove } = useCurrentUserRole();

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const toggleHidden = async (id: string, hidden: boolean) => {
    await supabase.from("events").update({ hidden }).eq("id", id);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, hidden } : e)));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("events").delete().eq("id", deleteId);
    setEvents((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[32px] font-bold" style={{ fontFamily: "'Readex Pro', sans-serif", color: "#1E1E1E" }}>
          Events
        </h1>
        {canAddInSection("events") && (
          <Button
            onClick={() => { setEditingEvent(null); setModalOpen(true); }}
            className="bg-accent text-white hover:bg-accent/90"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            + Add New Event
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Tags</th>
              {canToggleHidden("events") && <th className="px-4 py-3 text-center font-semibold">Hidden</th>}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const canEdit = canEditRecord("events", (e as any).created_by);
              return (
                <tr key={e.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{e.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.date_display || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(e.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  {canToggleHidden("events") && (
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={e.hidden ?? false}
                        onCheckedChange={(val) => toggleHidden(e.id, val)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-right space-x-2">
                    {canEdit && (
                      <button onClick={() => { setEditingEvent(e); setModalOpen(true); }} className="text-accent hover:underline text-sm">Edit</button>
                    )}
                    {canDeleteInSection("events") && (
                      <button onClick={() => setDeleteId(e.id)} className="text-destructive hover:underline text-sm">Delete</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={canToggleHidden("events") ? 6 : 5} className="px-4 py-8 text-center text-muted-foreground">No events yet.</td>
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
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEventsPage;
