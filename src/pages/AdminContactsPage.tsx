import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, Mail, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Contact = Tables<"contact_submissions">;

const relativeDate = (d: string | null) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
};

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"inbox" | "archived">("inbox");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const filtered = useMemo(() => {
    const isArchived = tab === "archived";
    return contacts.filter((c) => {
      if ((c.is_archived ?? false) !== isArchived) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (c.name ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.subject ?? "").toLowerCase().includes(q)
      );
    });
  }, [contacts, tab, search]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const selectMessage = async (c: Contact) => {
    setSelectedId(c.id);
    setNotes(c.admin_notes ?? "");
    if (!c.is_read) {
      await supabase.from("contact_submissions").update({ is_read: true }).eq("id", c.id);
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_read: true } : x)));
    }
  };

  const toggleArchive = async (id: string, archive: boolean) => {
    await supabase.from("contact_submissions").update({ is_archived: archive }).eq("id", id);
    setContacts((prev) => prev.map((x) => (x.id === id ? { ...x, is_archived: archive } : x)));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("contact_submissions").delete().eq("id", deleteId);
    setContacts((prev) => prev.filter((x) => x.id !== deleteId));
    if (selectedId === deleteId) setSelectedId(null);
    setDeleteId(null);
  };

  const saveNotes = async () => {
    if (!selectedId) return;
    setSavingNotes(true);
    await supabase.from("contact_submissions").update({ admin_notes: notes }).eq("id", selectedId);
    setContacts((prev) => prev.map((x) => (x.id === selectedId ? { ...x, admin_notes: notes } : x)));
    setSavingNotes(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Readex Pro', sans-serif" }}>
      <h1 className="text-[32px] font-bold mb-6" style={{ color: "#1E1E1E" }}>
        Contact Submissions
      </h1>

      <div className="flex rounded-lg border border-border overflow-hidden" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
        {/* Left panel — Inbox list */}
        <div className="flex flex-col border-r border-border" style={{ width: "380px", minWidth: "300px" }}>
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => { setTab("inbox"); setSelectedId(null); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "inbox" ? "bg-accent text-white" : "bg-white text-foreground hover:bg-muted/50"}`}
            >
              Inbox ({contacts.filter((c) => !c.is_archived).length})
            </button>
            <button
              onClick={() => { setTab("archived"); setSelectedId(null); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === "archived" ? "bg-accent text-white" : "bg-white text-foreground hover:bg-muted/50"}`}
            >
              Archived ({contacts.filter((c) => c.is_archived).length})
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <Input
              placeholder="Search name, email, subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No messages.</p>
            ) : (
              filtered.map((c) => {
                const isUnread = !c.is_read;
                const isActive = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectMessage(c)}
                    className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                      isActive ? "bg-accent/10" : isUnread ? "bg-[#f9f9f9] hover:bg-accent/5" : "bg-white hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread dot */}
                      <div className="mt-1.5 flex-shrink-0">
                        {isUnread && (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#702757" }} />
                        )}
                        {!isUnread && <div className="h-2 w-2" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm truncate ${isUnread ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                            {c.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                            {relativeDate(c.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {(c.subject ?? "No subject").slice(0, 40)}{(c.subject ?? "").length > 40 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right panel — Detail view */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Select a message to read it</p>
            </div>
          ) : (
            <div className="p-8 flex flex-col gap-6">
              {/* Header */}
              <div>
                <h2 className="text-[20px] font-bold text-foreground">{selected.name || "Unknown"}</h2>
                <a href={`mailto:${selected.email}`} className="text-sm text-accent hover:underline">{selected.email}</a>
                <p className="text-xs text-muted-foreground mt-1">
                  {selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}
                </p>
              </div>

              {/* Subject */}
              <h3 className="text-[18px] font-bold text-foreground">{selected.subject || "No subject"}</h3>

              {/* Message body */}
              <div className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap rounded-lg bg-[#f9f9f9] p-6">
                {selected.message || "No message body."}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {!selected.is_archived ? (
                  <Button
                    variant="outline"
                    onClick={() => toggleArchive(selected.id, true)}
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" /> Archive
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => toggleArchive(selected.id, false)}
                    className="gap-2"
                  >
                    <ArchiveRestore className="h-4 w-4" /> Unarchive
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => setDeleteId(selected.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>

                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: " + (selected.subject ?? ""))}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline ml-auto"
                >
                  <Mail className="h-4 w-4" /> Reply via email
                </a>
              </div>

              {/* Admin Notes */}
              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">Admin Notes</h4>
                <Textarea
                  rows={4}
                  placeholder="Add private notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-sm"
                />
                <Button
                  onClick={saveNotes}
                  disabled={savingNotes}
                  className="mt-3 bg-accent text-white hover:bg-accent/90"
                  size="sm"
                >
                  {savingNotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContactsPage;
