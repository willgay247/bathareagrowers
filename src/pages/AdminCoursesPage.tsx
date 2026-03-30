import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import SimpleFormModal from "@/components/admin/SimpleFormModal";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"courses">;

const FIELDS = [
  { key: "org_name", label: "Organisation Name", type: "text" as const, required: true },
  { key: "logo", label: "Logo", type: "file" as const },
  { key: "course_name", label: "Course Name", type: "text" as const },
  { key: "location", label: "Location", type: "text" as const },
  { key: "link", label: "Link", type: "text" as const, placeholder: "https://..." },
  { key: "display_order", label: "Display Order", type: "number" as const },
];

const AdminCoursesPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetch_ = async () => {
    const { data } = await supabase.from("courses").select("*").order("display_order");
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const toggleHidden = async (id: string, hidden: boolean) => {
    await supabase.from("courses").update({ hidden }).eq("id", id);
    setItems((p) => p.map((i) => (i.id === id ? { ...i, hidden } : i)));
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("courses").delete().eq("id", deleteId);
    setItems((p) => p.filter((i) => i.id !== deleteId)); setDeleteId(null);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[32px] font-bold" style={{ fontFamily: "'Readex Pro', sans-serif", color: "#1E1E1E" }}>Courses</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="bg-accent text-white hover:bg-accent/90" style={{ fontFamily: "'Readex Pro', sans-serif" }}>+ Add New</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
          <thead><tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-semibold">Organisation</th>
            <th className="px-4 py-3 text-left font-semibold">Course</th>
            <th className="px-4 py-3 text-left font-semibold">Location</th>
            <th className="px-4 py-3 text-center font-semibold">Order</th>
            <th className="px-4 py-3 text-center font-semibold">Hidden</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{i.org_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.course_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.location || "—"}</td>
                <td className="px-4 py-3 text-center">{i.display_order}</td>
                <td className="px-4 py-3 text-center"><Switch checked={i.hidden ?? false} onCheckedChange={(v) => toggleHidden(i.id, v)} /></td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => { setEditing(i); setModalOpen(true); }} className="text-accent hover:underline text-sm">Edit</button>
                  <button onClick={() => setDeleteId(i.id)} className="text-destructive hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No courses yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {modalOpen && <SimpleFormModal title="Course" table="courses" storagePath="courses" imageField="logo_url" fields={FIELDS} record={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSaved={() => { setModalOpen(false); setEditing(null); fetch_(); }} />}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Course</AlertDialogTitle><AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCoursesPage;
