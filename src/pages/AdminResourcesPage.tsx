import AdminTablePage from "@/components/admin/AdminTablePage";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"resources">;

const FIELDS = [
  { key: "title", label: "Title", type: "text" as const, required: true },
  { key: "description", label: "Description", type: "textarea" as const, rows: 4 },
  { key: "link", label: "Link", type: "text" as const, placeholder: "https://..." },
  { key: "display_order", label: "Display Order", type: "number" as const },
];

const COLUMNS = [
  { header: "Title", cell: (r: Item) => <span className="font-medium">{r.title}</span> },
  {
    header: "Link",
    cell: (r: Item) => r.link
      ? <a href={r.link} target="_blank" rel="noreferrer" className="text-accent hover:underline">View ↗</a>
      : <span className="text-muted-foreground">—</span>,
  },
  { header: "Order", align: "center" as const, cell: (r: Item) => r.display_order ?? 0 },
];

const AdminResourcesPage = () => (
  <AdminTablePage<Item>
    section="resources"
    table="resources"
    title="Resources"
    itemLabel="Resource"
    formFields={FIELDS}
    columns={COLUMNS}
    emptyMessage="No resources yet."
  />
);

export default AdminResourcesPage;
