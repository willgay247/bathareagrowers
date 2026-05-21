import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCurrentUserRole, SECTIONS } from "@/hooks/useCurrentUserRole";
import SimpleFormModal from "@/components/admin/SimpleFormModal";
import GardenFormModal from "@/components/admin/GardenFormModal";

type SectionKey =
  | "community_gardens"
  | "supported_gardening"
  | "wildlife_gardening"
  | "farms"
  | "surplus_projects"
  | "courses"
  | "resources";

interface SectionConfig {
  table: string;
  storagePath?: string;
  imageField?: string;
  title: string;
  modal: "garden" | "simple";
  fields?: Array<{
    key: string;
    label: string;
    type: "text" | "textarea" | "number" | "file";
    required?: boolean;
    placeholder?: string;
    rows?: number;
  }>;
  preview: (row: Record<string, unknown>) => { title: string; subtitle?: string; image?: string | null };
}

const SECTION_CONFIG: Record<SectionKey, SectionConfig> = {
  community_gardens: {
    table: "community_gardens",
    storagePath: "gardens",
    imageField: "image_url",
    title: "Community Garden",
    modal: "garden",
    preview: (row) => ({
      title: String(row.name ?? ""),
      subtitle: row.region ? `Region: ${row.region}` : undefined,
      image: (row.image_url as string | null) ?? null,
    }),
  },
  supported_gardening: {
    table: "supported_gardening",
    storagePath: "supported",
    imageField: "image_url",
    title: "Supported Gardening",
    modal: "simple",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "image", label: "Image", type: "file" },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "external_link", label: "External Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.name ?? ""),
      image: (row.image_url as string | null) ?? null,
    }),
  },
  wildlife_gardening: {
    table: "wildlife_gardening_entries",
    storagePath: "wildlife",
    imageField: "image_url",
    title: "Wildlife Gardening",
    modal: "simple",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "image", label: "Image", type: "file" },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "external_link", label: "External Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.title ?? ""),
      image: (row.image_url as string | null) ?? null,
    }),
  },
  farms: {
    table: "farms",
    storagePath: "farms",
    imageField: "image_url",
    title: "Farm",
    modal: "simple",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "image", label: "Image", type: "file" },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "volunteering_link", label: "Volunteering Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.name ?? ""),
      image: (row.image_url as string | null) ?? null,
    }),
  },
  surplus_projects: {
    table: "surplus_projects",
    storagePath: "surplus",
    imageField: "image_url",
    title: "Surplus Project",
    modal: "simple",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "image", label: "Image", type: "file" },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "external_link", label: "External Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.name ?? ""),
      image: (row.image_url as string | null) ?? null,
    }),
  },
  courses: {
    table: "courses",
    storagePath: "courses",
    imageField: "logo_url",
    title: "Course",
    modal: "simple",
    fields: [
      { key: "course_name", label: "Course Name", type: "text", required: true },
      { key: "org_name", label: "Organisation", type: "text" },
      { key: "image", label: "Logo", type: "file" },
      { key: "location", label: "Location", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "link", label: "Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.course_name ?? ""),
      subtitle: row.org_name ? String(row.org_name) : undefined,
      image: (row.logo_url as string | null) ?? null,
    }),
  },
  resources: {
    table: "resources",
    title: "Resource",
    modal: "simple",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "link", label: "Link", type: "text", placeholder: "https://..." },
      { key: "display_order", label: "Display Order", type: "number" },
    ],
    preview: (row) => ({
      title: String(row.title ?? ""),
    }),
  },
};

const isSectionKey = (key: string | null): key is SectionKey =>
  key !== null && Object.prototype.hasOwnProperty.call(SECTION_CONFIG, key);

const MemberListingPage = () => {
  const { userId, canAddInSection, canEditRecord, loading: roleLoading } = useCurrentUserRole();
  const [groupType, setGroupType] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const config = useMemo(
    () => (isSectionKey(groupType) ? SECTION_CONFIG[groupType] : null),
    [groupType]
  );

  const fetchRows = useCallback(async () => {
    if (!userId || !config) {
      setRows([]);
      setLoadingRows(false);
      return;
    }
    const { data } = await supabase
      .from(config.table as never)
      .select("*")
      .eq("created_by", userId);
    setRows((data as Record<string, unknown>[]) ?? []);
    setLoadingRows(false);
  }, [userId, config]);

  useEffect(() => {
    if (roleLoading || !userId) return;
    supabase
      .from("member_profiles")
      .select("group_type")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setGroupType(data?.group_type ?? null);
        setProfileLoaded(true);
      });
  }, [roleLoading, userId]);

  useEffect(() => {
    if (!profileLoaded) return;
    setLoadingRows(true);
    fetchRows();
  }, [profileLoaded, fetchRows]);

  if (roleLoading || !profileLoaded || loadingRows) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-lg border border-border bg-white p-8">
        <h1 className="text-2xl font-bold text-foreground">My listing</h1>
        <p className="mt-2 text-sm text-foreground">
          Your group type isn't set yet, so there's no directory listing to manage.
          Ask the site admin to set your group type via Settings → Permissions.
        </p>
      </div>
    );
  }

  const sectionLabel = SECTIONS.find((s) => s.key === groupType)?.label ?? config.title;
  const canAdd = canAddInSection(groupType ?? "");

  if (!canAdd && rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8">
        <h1 className="text-2xl font-bold text-foreground">My {sectionLabel} listing</h1>
        <p className="mt-2 text-sm text-foreground">
          Your account isn't approved to manage a listing yet. An admin will enable this shortly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">My {sectionLabel} listing</h1>
        {canAdd && rows.length === 0 && (
          <Button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-accent text-foreground-alt hover:bg-accent/90"
          >
            + Create listing
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You haven't created your {sectionLabel.toLowerCase()} listing yet. Click "Create listing" to add it to the directory.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const preview = config.preview(row);
            const canEdit = canEditRecord(groupType!, row.created_by as string | null | undefined);
            return (
              <div key={String(row.id)} className="flex items-center gap-4 rounded-lg border border-border bg-white p-4">
                {preview.image && (
                  <img
                    src={preview.image}
                    alt=""
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{preview.title}</div>
                  {preview.subtitle && (
                    <div className="text-sm text-muted-foreground">{preview.subtitle}</div>
                  )}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {row.hidden ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-yellow-800">Hidden</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">Live</span>
                    )}
                  </div>
                </div>
                {canEdit && (
                  <button
                    onClick={() => { setEditing(row); setModalOpen(true); }}
                    className="text-accent hover:underline text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && config.modal === "garden" && (
        <GardenFormModal
          garden={editing as Parameters<typeof GardenFormModal>[0]["garden"]}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchRows(); }}
          createdBy={userId}
        />
      )}

      {modalOpen && config.modal === "simple" && config.fields && (
        <SimpleFormModal
          title={config.title}
          table={config.table}
          storagePath={config.storagePath}
          imageField={config.imageField}
          fields={config.fields}
          record={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchRows(); }}
          createdBy={userId}
        />
      )}
    </div>
  );
};

export default MemberListingPage;
