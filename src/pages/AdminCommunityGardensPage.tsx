import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GardenFormModal from "@/components/admin/GardenFormModal";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import type { Tables } from "@/integrations/supabase/types";

type Garden = Tables<"community_gardens">;
const REGIONS = ["west", "central", "east"] as const;
const REGION_LABELS: Record<string, string> = { west: "West", central: "Central", east: "East" };

const AdminCommunityGardensPage = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string>("west");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Garden | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { canAddInSection, canEditRecord, canDeleteInSection, canToggleHidden, userId } = useCurrentUserRole();

  const fetchGardens = async () => {
    const { data } = await supabase
      .from("community_gardens")
      .select("*")
      .order("display_order", { ascending: true });
    setGardens(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchGardens(); }, []);

  const filtered = gardens.filter((g) => g.region === activeRegion);

  const toggleHidden = async (id: string, hidden: boolean) => {
    const { error } = await supabase.from("community_gardens").update({ hidden }).eq("id", id);
    if (error) {
      toast.error("Failed to update visibility");
      return;
    }
    setGardens((prev) => prev.map((g) => (g.id === id ? { ...g, hidden } : g)));
  };

  const updateOrder = async (id: string, order: number) => {
    const { error } = await supabase.from("community_gardens").update({ display_order: order }).eq("id", id);
    if (error) {
      toast.error("Failed to update order");
      return;
    }
    setGardens((prev) => prev.map((g) => (g.id === id ? { ...g, display_order: order } : g)));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("community_gardens").delete().eq("id", deleteId);
    if (error) {
      toast.error("Failed to delete garden");
      return;
    }
    setGardens((prev) => prev.filter((g) => g.id !== deleteId));
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
          Community Gardens
        </h1>
        {canAddInSection("community_gardens") && (
          <Button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-accent text-white hover:bg-accent/90"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            + Add New Garden
          </Button>
        )}
      </div>

      <div className="flex gap-1 mb-6 border-b border-border">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeRegion === r
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            {REGION_LABELS[r]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Image</th>
              {canToggleHidden("community_gardens") && <th className="px-4 py-3 text-center font-semibold">Hidden</th>}
              {canToggleHidden("community_gardens") && <th className="px-4 py-3 text-center font-semibold">Order</th>}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const canEdit = canEditRecord("community_gardens", (g as any).created_by);
              return (
                <tr key={g.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{g.name}</td>
                  <td className="px-4 py-3">
                    {g.image_url ? (
                      <img src={g.image_url} alt={g.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  {canToggleHidden("community_gardens") && (
                    <td className="px-4 py-3 text-center">
                      <Switch checked={g.hidden ?? false} onCheckedChange={(val) => toggleHidden(g.id, val)} />
                    </td>
                  )}
                  {canToggleHidden("community_gardens") && (
                    <td className="px-4 py-3 text-center">
                      <Input
                        type="number"
                        value={g.display_order ?? 0}
                        onChange={(e) => updateOrder(g.id, Number(e.target.value))}
                        className="w-16 mx-auto text-center"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-right space-x-2">
                    {canEdit && (
                      <button onClick={() => { setEditing(g); setModalOpen(true); }} className="text-accent hover:underline text-sm">Edit</button>
                    )}
                    {canDeleteInSection("community_gardens") && (
                      <button onClick={() => setDeleteId(g.id)} className="text-destructive hover:underline text-sm">Delete</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No gardens in this region.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <GardenFormModal
          garden={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchGardens(); }}
          createdBy={userId}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Garden</AlertDialogTitle>
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

export default AdminCommunityGardensPage;
