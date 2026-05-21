import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Shield, ShieldCheck, User, Settings2 } from "lucide-react";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import UserPermissionsModal from "@/components/admin/UserPermissionsModal";

interface ManagedUser {
  id: string;
  email: string;
  created_at: string;
  role: string | null;
  permissions: { section: string; can_add: boolean; can_edit_own: boolean }[];
  group_name?: string | null;
  group_type?: string | null;
  bio?: string | null;
}

const ROLE_BADGE: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  super_admin: { label: "Super Admin", color: "#702757", icon: ShieldCheck },
  admin: { label: "Admin", color: "#1c5422", icon: Shield },
  user: { label: "User", color: "#555", icon: User },
};

const AdminSettingsPage = () => {
  const { isSuperAdmin, isAdmin, userId } = useCurrentUserRole();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [permUserId, setPermUserId] = useState<string | null>(null);
  const [changeRoleUser, setChangeRoleUser] = useState<ManagedUser | null>(null);
  const [newRoleValue, setNewRoleValue] = useState<"admin" | "user">("user");

  const fetchUsers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await supabase.functions.invoke("manage-users", {
      method: "GET",
    });

    if (res.error) {
      console.error("Failed to fetch users", res.error);
      setLoading(false);
      return;
    }

    setUsers(res.data as ManagedUser[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      setCreateError("Email and password are required.");
      return;
    }
    if (newPassword.length < 6) {
      setCreateError("Password must be at least 6 characters.");
      return;
    }
    setCreating(true);
    setCreateError("");

    const res = await supabase.functions.invoke("manage-users", {
      body: { action: "create_user", email: newEmail, password: newPassword, role: newRole },
    });

    if (res.error || res.data?.error) {
      setCreateError(res.data?.error || res.error?.message || "Failed to create user");
      setCreating(false);
      return;
    }

    setCreating(false);
    setShowAddForm(false);
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await supabase.functions.invoke("manage-users", {
      body: { action: "delete_user", user_id: deleteId },
    });

    setDeleteId(null);
    fetchUsers();
  };

  const handleChangeRole = async () => {
    if (!changeRoleUser) return;

    await supabase.functions.invoke("manage-users", {
      body: { action: "update_role", user_id: changeRoleUser.id, role: newRoleValue },
    });

    setChangeRoleUser(null);
    fetchUsers();
  };

  const permUser = users.find((u) => u.id === permUserId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Readex Pro', sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[32px] font-bold" style={{ color: "#1E1E1E" }}>
          Settings — User Management
        </h1>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-accent text-white hover:bg-accent/90"
        >
          + Add New {isAdmin && !isSuperAdmin ? "User" : "User / Admin"}
        </Button>
      </div>

      {/* Add user form */}
      {showAddForm && (
        <div className="mb-8 rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#1E1E1E" }}>Create New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="user">User</option>
                {isSuperAdmin && <option value="admin">Admin</option>}
              </select>
            </div>
          </div>
          {createError && <p className="text-sm text-destructive mt-3">{createError}</p>}
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleCreateUser}
              disabled={creating}
              className="bg-accent text-white hover:bg-accent/90"
            >
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <Button variant="outline" onClick={() => { setShowAddForm(false); setCreateError(""); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Sections</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const badge = ROLE_BADGE[u.role ?? "user"] ?? ROLE_BADGE.user;
              const BadgeIcon = badge.icon;
              const isSelf = u.id === userId;
              const canManage = !isSelf && (isSuperAdmin || (isAdmin && u.role === "user"));
              const canChangeRole = isSuperAdmin && !isSelf && u.role !== "super_admin";

              const isPending = u.role === "user" && u.permissions.length === 0;

              return (
                <tr key={u.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    <div>{u.email}{isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}</div>
                    {u.group_name && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {u.group_name}
                        {u.group_type && (
                          <span className="text-muted-foreground/70"> · {u.group_type.replace(/_/g, " ")}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: badge.color }}
                    >
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </span>
                    {isPending && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.role === "user" ? (
                      u.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {u.permissions.map((p) => (
                            <span key={p.section} className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
                              {p.section.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs">No sections assigned</span>
                      )
                    ) : (
                      <span className="text-xs">All sections</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {(canManage || u.role === "user") && !isSelf && (
                      <button
                        onClick={() => setPermUserId(u.id)}
                        className="text-accent hover:underline text-sm inline-flex items-center gap-1"
                      >
                        <Settings2 className="h-3.5 w-3.5" /> Permissions
                      </button>
                    )}
                    {canChangeRole && (
                      <button
                        onClick={() => {
                          setChangeRoleUser(u);
                          setNewRoleValue(u.role === "admin" ? "user" : "admin");
                        }}
                        className="text-accent hover:underline text-sm"
                      >
                        Change Role
                      </button>
                    )}
                    {canManage && (
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="text-destructive hover:underline text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Permissions modal */}
      {permUser && (
        <UserPermissionsModal
          userId={permUser.id}
          userEmail={permUser.email}
          userRole={permUser.role ?? "user"}
          initialPermissions={permUser.permissions}
          onClose={() => setPermUserId(null)}
          onSaved={() => { setPermUserId(null); fetchUsers(); }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account and all their permissions. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change role confirmation */}
      <AlertDialog open={!!changeRoleUser} onOpenChange={() => setChangeRoleUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Role</AlertDialogTitle>
            <AlertDialogDescription>
              Change {changeRoleUser?.email}'s role to{" "}
              <strong>{newRoleValue === "admin" ? "Admin" : "User"}</strong>?
              {newRoleValue === "admin" && " This will give them full access to all sections and the ability to manage users."}
              {newRoleValue === "user" && " They will lose admin privileges and only have access to assigned sections."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeRole} className="bg-accent text-white">
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettingsPage;
