
-- Tighten admin_users SELECT to admin-only (bootstrap: first admin is self-referencing)
DROP POLICY IF EXISTS "admin_select_admin_users" ON public.admin_users;
CREATE POLICY "admin_select_admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
