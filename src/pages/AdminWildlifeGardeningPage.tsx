import AdminTablePage from "@/components/admin/AdminTablePage";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"wildlife_gardening_entries">;

const FIELDS = [
  { key: "title", label: "Title", type: "text" as const, required: true },
  { key: "image", label: "Image", type: "file" as const },
  { key: "description", label: "Description", type: "textarea" as const, rows: 4 },
  { key: "link", label: "Link", type: "text" as const, placeholder: "https://..." },
  { key: "display_order", label: "Display Order", type: "number" as const },
];

const COLUMNS = [
  { header: "Title", cell: (r: Item) => <span className="font-medium">{r.title}</span> },
  {
    header: "Image",
    cell: (r: Item) => r.image_url
      ? <img src={r.image_url} alt="" className="h-10 w-10 rounded object-cover" />
      : <span className="text-muted-foreground">—</span>,
  },
  { header: "Order", align: "center" as const, cell: (r: Item) => r.display_order ?? 0 },
];

const AdminWildlifeGardeningPage = () => (
  <AdminTablePage<Item>
    section="wildlife_gardening"
    table="wildlife_gardening_entries"
    title="Wildlife Gardening"
    itemLabel="Entry"
    storagePath="wildlife"
    imageField="image_url"
    formFields={FIELDS}
    columns={COLUMNS}
  />
);

export default AdminWildlifeGardeningPage;
