

# Role-Based Access Control (RBAC) Settings

## Overview

Replace the current binary `admin_users` table with a full 3-tier role system (super_admin, admin, user) plus granular per-section permissions. Add a Settings page for managing users and their permissions.

## Roles

| Role | Can manage users? | Can manage admins? | Section access |
|------|-------------------|--------------------|----------------|
| **Super Admin** | Yes | Yes (add/remove admins) | All sections, full CRUD |
| **Admin** | Yes (add/remove users only) | No | All sections, full CRUD |
| **User** | No | No | Only assigned sections; can add new records + edit own records only |

No one can change their own permissions. Users cannot delete records or toggle visibility.

## Database Changes (3 migrations)

### Migration 1: Role enum + user_roles table
```sql
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### Migration 2: Section permissions table
```sql
CREATE TABLE public.user_section_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL, -- 'events','community_gardens','supported_gardening', etc.
  can_add boolean DEFAULT false,
  can_edit_own boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, section)
);

ALTER TABLE public.user_section_permissions ENABLE ROW LEVEL SECURITY;
```

### Migration 3: Helper functions + RLS policies
- `has_role(uuid, app_role)` — security definer function (replaces current `is_admin`)
- `has_any_admin_role(uuid)` — returns true for admin or super_admin
- RLS on `user_roles`: super_admin can SELECT/INSERT/DELETE; admin can SELECT + INSERT/DELETE only `user` roles; users can SELECT own
- RLS on `user_section_permissions`: super_admin full access; admin can manage for users only; users can SELECT own
- Add `created_by uuid` column to `events` table (and other content tables over time) so users can only edit their own records
- Migrate existing `admin_users` rows into `user_roles` as `super_admin`
- Update all existing content table RLS policies to use `has_any_admin_role()` instead of `is_admin()`

### Migration 4: Add `created_by` to events
```sql
ALTER TABLE public.events ADD COLUMN created_by uuid REFERENCES auth.users(id);
```
This enables "edit own only" for users. Other content tables can be extended later.

## Frontend Changes

### 1. New hook: `src/hooks/useCurrentUserRole.ts`
Fetches current user's role and section permissions from `user_roles` and `user_section_permissions`. Exposes: `role`, `permissions`, `isSuperAdmin`, `isAdmin`, `isUser`, `canAccessSection(section)`, `canEditRecord(section, createdBy)`.

### 2. Update `AdminAuthGuard.tsx`
After confirming session, also verify user has a role in `user_roles`. Redirect to login if no role found.

### 3. Update `AdminLayout.tsx` sidebar
Filter `navItems` based on role and section permissions — users only see sections they have access to. Show "Settings" nav item only for admin and super_admin.

### 4. New page: `src/pages/AdminSettingsPage.tsx`
- **User list** — shows all users with their role and email
- **Add user** — form with email + password + role selector (admin can only create `user` role; super_admin can create `admin` or `user`)
- **Edit permissions** — click a user to see/toggle their section permissions (checkboxes per section: can_add, can_edit_own)
- **Remove user / Change role** — super_admin can promote/demote admins; admin can only remove users
- No one can edit their own permissions (disable controls when viewing self)

### 5. Update admin section pages (e.g. `AdminEventsPage.tsx`)
- Wrap action buttons (Add, Edit, Delete, Toggle Hidden) in permission checks
- Users see "Add" only if `can_add` is true for that section
- Users see "Edit" only on records where `created_by` matches their user ID
- Users cannot see Delete or Toggle Hidden controls
- Admins and super_admins retain full access

### 6. New route in `App.tsx`
```tsx
<Route path="settings" element={<AdminSettingsPage />} />
```

## Sections covered by permissions
`events`, `community_gardens`, `supported_gardening`, `wildlife_gardening`, `farms`, `surplus_projects`, `courses`, `resources`, `contacts`

## Files to create
- `src/hooks/useCurrentUserRole.ts`
- `src/pages/AdminSettingsPage.tsx`
- `src/components/admin/UserPermissionsModal.tsx`
- 4 migration files

## Files to modify
- `src/components/AdminLayout.tsx` — conditional nav items + Settings link
- `src/components/AdminAuthGuard.tsx` — role check
- `src/pages/AdminEventsPage.tsx` — permission-gated actions
- All other admin section pages — same permission gating
- `src/App.tsx` — add settings route

