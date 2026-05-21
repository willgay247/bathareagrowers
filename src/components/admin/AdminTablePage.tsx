import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SimpleFormModal from "@/components/admin/SimpleFormModal";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "file";
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

interface BaseRow {
  id: string;
  hidden?: boolean | null;
  display_order?: number | null;
  created_by?: string | null;
}

interface Column<T extends BaseRow> {
  header: string;
  align?: "left" | "center" | "right";
  cell: (row: T) => ReactNode;
}

interface Props<T extends BaseRow> {
  section: string;
  table: string;
  title: string;
  itemLabel: string;
  storagePath?: string;
  imageField?: string;
  formFields: FieldDef[];
  columns: Column<T>[];
  orderBy?: string;
  emptyMessage?: string;
}

function AdminTablePage<T extends BaseRow>({
  section,
  table,
  title,
  itemLabel,
  storagePath,
  imageField,
  formFields,
  columns,
  orderBy = "display_order",
  emptyMessage = "No entries yet.",
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { canAddInSection, canEditRecord, canDeleteInSection, canToggleHidden, userId } = useCurrentUserRole();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from(table as never)
      .select("*")
      .order(orderBy);
    if (error) {
      toast.error(`Failed to load ${title.toLowerCase()}`);
      setLoading(false);
      return;
    }
    setItems((data as T[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [table]);

  const toggleHidden = async (id: string, hidden: boolean) => {
    const { error } = await supabase.from(table as never).update({ hidden } as never).eq("id", id);
    if (error) {
      toast.error("Failed to update visibility");
      return;
    }
    setItems((p) => p.map((i) => (i.id === id ? { ...i, hidden } : i)));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from(table as never).delete().eq("id", deleteId);
    if (error) {
      toast.error(`Failed to delete ${itemLabel.toLowerCase()}`);
      return;
    }
    setItems((p) => p.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  const showHiddenCol = canToggleHidden(section);
  const totalCols = columns.length + (showHiddenCol ? 1 : 0) + 1; // +1 for actions

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {canAddInSection(section) && (
          <Button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-accent text-foreground-alt hover:bg-accent/90"
          >
            + Add new {itemLabel.toLowerCase()}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((c) => (
                <th
                  key={c.header}
                  className={`px-4 py-3 font-semibold ${
                    c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {c.header}
                </th>
              ))}
              {showHiddenCol && <th className="px-4 py-3 text-center font-semibold">Hidden</th>}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const canEdit = canEditRecord(section, row.created_by);
              return (
                <tr key={row.id} className="border-b hover:bg-muted/30">
                  {columns.map((c) => (
                    <td
                      key={c.header}
                      className={`px-4 py-3 ${
                        c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                  {showHiddenCol && (
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={row.hidden ?? false}
                        onCheckedChange={(v) => toggleHidden(row.id, v)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-right space-x-2">
                    {canEdit && (
                      <button
                        onClick={() => { setEditing(row); setModalOpen(true); }}
                        className="text-accent hover:underline text-sm"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteInSection(section) && (
                      <button
                        onClick={() => setDeleteId(row.id)}
                        className="text-destructive hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={totalCols} className="px-4 py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <SimpleFormModal
          title={itemLabel}
          table={table}
          storagePath={storagePath}
          imageField={imageField}
          fields={formFields}
          record={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchItems(); }}
          createdBy={userId}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemLabel}</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminTablePage;
