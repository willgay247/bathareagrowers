import AdminTablePage from "@/components/admin/AdminTablePage";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"courses">;

const FIELDS = [
  { key: "org_name", label: "Organisation Name", type: "text" as const, required: true },
  { key: "logo", label: "Logo", type: "file" as const },
  { key: "course_name", label: "Course Name", type: "text" as const },
  { key: "description", label: "Description", type: "text" as const },
  { key: "location", label: "Location", type: "text" as const },
  { key: "link", label: "Link", type: "text" as const, placeholder: "https://..." },
  { key: "display_order", label: "Display Order", type: "number" as const },
];

const COLUMNS = [
  { header: "Organisation", cell: (r: Item) => <span className="font-medium">{r.org_name}</span> },
  { header: "Course", cell: (r: Item) => <span className="text-muted-foreground">{r.course_name || "—"}</span> },
  { header: "Location", cell: (r: Item) => <span className="text-muted-foreground">{r.location || "—"}</span> },
  { header: "Order", align: "center" as const, cell: (r: Item) => r.display_order ?? 0 },
];

const AdminCoursesPage = () => (
  <AdminTablePage<Item>
    section="courses"
    table="courses"
    title="Courses"
    itemLabel="Course"
    storagePath="courses"
    imageField="logo_url"
    formFields={FIELDS}
    columns={COLUMNS}
    emptyMessage="No courses yet."
  />
);

export default AdminCoursesPage;
