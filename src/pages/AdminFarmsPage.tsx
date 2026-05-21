import AdminTablePage from "@/components/admin/AdminTablePage";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"farms">;

const FIELDS = [
  { key: "name", label: "Name", type: "text" as const, required: true },
  { key: "image", label: "Image", type: "file" as const },
  { key: "description", label: "Description", type: "textarea" as const, rows: 4 },
  { key: "volunteering_link", label: "Volunteering Link", type: "text" as const, placeholder: "https://..." },
  { key: "display_order", label: "Display Order", type: "number" as const },
];

const COLUMNS = [
  { header: "Name", cell: (r: Item) => <span className="font-medium">{r.name}</span> },
  {
    header: "Image",
    cell: (r: Item) => r.image_url
      ? <img src={r.image_url} alt="" className="h-10 w-10 rounded object-cover" />
      : <span className="text-muted-foreground">—</span>,
  },
  { header: "Order", align: "center" as const, cell: (r: Item) => r.display_order ?? 0 },
];

const AdminFarmsPage = () => (
  <AdminTablePage<Item>
    section="farms"
    table="farms"
    title="Farms"
    itemLabel="Farm"
    storagePath="farms"
    imageField="image_url"
    formFields={FIELDS}
    columns={COLUMNS}
  />
);

export default AdminFarmsPage;
