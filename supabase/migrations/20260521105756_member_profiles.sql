-- Self-signup member profiles
-- Stores group/organisation info for non-admin users who self-sign-up.
-- Approval state is implicit: a user is "approved" once an admin grants them
-- any rows in user_section_permissions. No explicit status column needed.

CREATE TABLE public.member_profiles (
  user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  group_name  text NOT NULL,
  group_type  text,
  bio         text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY admin_all_member_profiles ON public.member_profiles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- User: read own profile
CREATE POLICY user_select_own_profile ON public.member_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- User: update own profile (group_type stays admin-controlled at the UI layer,
-- but we don't add a column-level restriction here — RLS is row-scoped)
CREATE POLICY user_update_own_profile ON public.member_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT is intentionally restricted to service_role only — the member-signup
-- edge function performs the insert. No client-side INSERT policy exists.

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.touch_member_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER member_profiles_touch
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_member_profiles_updated_at();

CREATE INDEX member_profiles_created_at_idx
  ON public.member_profiles (created_at DESC);
