import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SECTIONS } from "@/hooks/useCurrentUserRole";

interface Permission {
  section: string;
  can_add: boolean;
  can_edit_own: boolean;
}

interface Props {
  userId: string;
  userEmail: string;
  userRole: string;
  initialPermissions: Permission[];
  groupName?: string | null;
  groupType?: string | null;
  bio?: string | null;
  applicantMessage?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const UserPermissionsModal = ({ userId, userEmail, userRole, initialPermissions, groupName, groupType, bio, applicantMessage, onClose, onSaved }: Props) => {
  const [permissions, setPermissions] = useState<Record<string, { can_add: boolean; can_edit_own: boolean }>>(() => {
    const map: Record<string, { can_add: boolean; can_edit_own: boolean }> = {};
    SECTIONS.forEach((s) => {
      const existing = initialPermissions.find((p) => p.section === s.key);
      map[s.key] = {
        can_add: existing?.can_add ?? false,
        can_edit_own: existing?.can_edit_own ?? false,
      };
    });
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSection = (section: string) => {
    const current = permissions[section];
    const isEnabled = current.can_add || current.can_edit_own;
    if (isEnabled) {
      // Disable all
      setPermissions((p) => ({ ...p, [section]: { can_add: false, can_edit_own: false } }));
    } else {
      // Enable with defaults
      setPermissions((p) => ({ ...p, [section]: { can_add: true, can_edit_own: true } }));
    }
  };

  const togglePerm = (section: string, perm: "can_add" | "can_edit_own") => {
    setPermissions((p) => ({
      ...p,
      [section]: { ...p[section], [perm]: !p[section][perm] },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      // Delete all existing permissions for this user
      await supabase
        .from("user_section_permissions")
        .delete()
        .eq("user_id", userId);

      // Insert new permissions (only sections that have at least one permission enabled)
      const toInsert = Object.entries(permissions)
        .filter(([, v]) => v.can_add || v.can_edit_own)
        .map(([section, v]) => ({
          user_id: userId,
          section,
          can_add: v.can_add,
          can_edit_own: v.can_edit_own,
        }));

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("user_section_permissions")
          .insert(toInsert);
        if (insertError) throw insertError;
      }

      // If we just transitioned from pending (0 perms) to approved (>0 perms),
      // notify the member. Best-effort; failure here shouldn't block the save.
      const wasPending = initialPermissions.length === 0;
      const isNowApproved = toInsert.length > 0;
      if (wasPending && isNowApproved) {
        try {
          await supabase.functions.invoke("send-notification", {
            body: { kind: "member_approved", user_id: userId },
          });
        } catch (notifyErr) {
          console.warn("approval notification failed:", notifyErr);
        }
      }

      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isAdminRole = userRole === "admin" || userRole === "super_admin";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div
        className="my-8 w-full max-w-xl rounded-xl bg-white p-8 shadow-xl"
        style={{ fontFamily: "'Readex Pro', sans-serif" }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1E1E1E" }}>
          Edit Permissions
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{userEmail}</p>

        {!isAdminRole && (groupName || groupType || bio || applicantMessage) && (
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm">
            {groupName && (
              <div className="mb-1">
                <span className="font-semibold">Group:</span> {groupName}
                {groupType && (
                  <span className="text-muted-foreground"> · {groupType.replace(/_/g, " ")}</span>
                )}
              </div>
            )}
            {bio && (
              <div className="mt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</div>
                <div className="whitespace-pre-wrap text-foreground">{bio}</div>
              </div>
            )}
            {applicantMessage && (
              <div className="mt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason for applying</div>
                <div className="whitespace-pre-wrap text-foreground">{applicantMessage}</div>
              </div>
            )}
          </div>
        )}

        {isAdminRole ? (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {userRole === "super_admin" ? "Super Admins" : "Admins"} have full access to all sections. Section permissions only apply to users.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Toggle which sections this user can access, and what they can do in each.
            </p>
            {SECTIONS.map((s) => {
              const perm = permissions[s.key];
              const isEnabled = perm.can_add || perm.can_edit_own;
              const isContacts = s.key === "contacts";

              return (
                <div
                  key={s.key}
                  className={`rounded-lg border p-4 transition-colors ${isEnabled ? "border-accent bg-accent/5" : "border-border"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold cursor-pointer" onClick={() => toggleSection(s.key)}>
                      {s.label}
                    </Label>
                    <Checkbox
                      checked={isEnabled}
                      onCheckedChange={() => toggleSection(s.key)}
                    />
                  </div>
                  {isEnabled && !isContacts && (
                    <div className="flex gap-6 ml-1 mt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={perm.can_add}
                          onCheckedChange={() => togglePerm(s.key, "can_add")}
                        />
                        Can add new records
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={perm.can_edit_own}
                          onCheckedChange={() => togglePerm(s.key, "can_edit_own")}
                        />
                        Can edit own records
                      </label>
                    </div>
                  )}
                  {isEnabled && isContacts && (
                    <p className="text-xs text-muted-foreground ml-1 mt-1">View-only access to contact submissions.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="text-sm text-destructive mt-4">{error}</p>}

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {!isAdminRole && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent text-white hover:bg-accent/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Permissions
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsModal;
