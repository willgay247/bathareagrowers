import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "user";

export interface SectionPermission {
  section: string;
  can_add: boolean;
  can_edit_own: boolean;
}

export const SECTIONS = [
  { key: "events", label: "Events" },
  { key: "community_gardens", label: "Community Gardens" },
  { key: "supported_gardening", label: "Supported Gardening" },
  { key: "wildlife_gardening", label: "Wildlife Gardening" },
  { key: "farms", label: "Farms" },
  { key: "surplus_projects", label: "Surplus Projects" },
  { key: "courses", label: "Courses" },
  { key: "resources", label: "Resources" },
  { key: "contacts", label: "Contacts (CRM)" },
] as const;

export const SECTION_NAV_MAP: Record<string, string> = {
  events: "/admin/events",
  community_gardens: "/admin/community-gardens",
  supported_gardening: "/admin/supported-gardening",
  wildlife_gardening: "/admin/wildlife-gardening",
  farms: "/admin/farms",
  surplus_projects: "/admin/surplus-projects",
  courses: "/admin/courses",
  resources: "/admin/resources",
  contacts: "/admin/contacts",
};

export interface UserRoleData {
  role: AppRole | null;
  permissions: SectionPermission[];
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isAdminOrAbove: boolean;
  canAccessSection: (section: string) => boolean;
  canAddInSection: (section: string) => boolean;
  canEditRecord: (section: string, createdBy: string | null | undefined) => boolean;
  canDeleteInSection: (section: string) => boolean;
  canToggleHidden: (section: string) => boolean;
  userId: string | null;
}

export function useCurrentUserRole(): UserRoleData {
  const [role, setRole] = useState<AppRole | null>(null);
  const [permissions, setPermissions] = useState<SectionPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoading(false); return; }

      setUserId(session.user.id);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData) {
        setRole(roleData.role as AppRole);
      }

      const { data: permsData } = await supabase
        .from("user_section_permissions")
        .select("section, can_add, can_edit_own")
        .eq("user_id", session.user.id);

      setPermissions(
        permsData?.map((p) => ({
          section: p.section,
          can_add: p.can_add ?? false,
          can_edit_own: p.can_edit_own ?? false,
        })) ?? []
      );

      setLoading(false);
    };
    load();
  }, []);

  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isAdminOrAbove = isSuperAdmin || isAdmin;

  const canAccessSection = (section: string) => {
    if (isAdminOrAbove) return true;
    return permissions.some((p) => p.section === section);
  };

  const canAddInSection = (section: string) => {
    if (isAdminOrAbove) return true;
    return permissions.some((p) => p.section === section && p.can_add);
  };

  const canEditRecord = (section: string, createdBy: string | null | undefined) => {
    if (isAdminOrAbove) return true;
    if (!isUser) return false;
    const perm = permissions.find((p) => p.section === section);
    if (!perm?.can_edit_own) return false;
    return createdBy === userId;
  };

  // Only admin/super_admin can delete or toggle hidden
  const canDeleteInSection = (section: string) => isAdminOrAbove;
  const canToggleHidden = (section: string) => isAdminOrAbove;

  return {
    role, permissions, loading,
    isSuperAdmin, isAdmin, isUser, isAdminOrAbove,
    canAccessSection, canAddInSection, canEditRecord,
    canDeleteInSection, canToggleHidden,
    userId,
  };
}
