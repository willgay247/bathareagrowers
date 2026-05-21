-- Auto-provision user_roles + member_profiles when a self-signup occurs.
--
-- Discriminator: presence of `group_name` in raw_user_meta_data means
-- "this is a public self-signup" (the SignupPage passes it via
-- auth.signUp({ options: { data: { group_name, group_type } } })).
--
-- Admin-driven user creation (via manage-users edge function) does NOT
-- pass group_name and so the trigger is a no-op for those flows; the
-- edge function still inserts user_roles explicitly.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_group_name text := trim(both from coalesce(NEW.raw_user_meta_data->>'group_name', ''));
  v_group_type text := nullif(trim(both from coalesce(NEW.raw_user_meta_data->>'group_type', '')), '');
BEGIN
  -- Only act on self-signups (identified by group_name in metadata).
  IF v_group_name = '' THEN
    RETURN NEW;
  END IF;

  IF length(v_group_name) < 2 OR length(v_group_name) > 80 THEN
    RAISE EXCEPTION 'group_name must be 2 to 80 characters';
  END IF;

  -- Validate group_type against the canonical SECTIONS list.
  -- 'contacts' is admin-only and not offered to members.
  IF v_group_type IS NOT NULL AND v_group_type NOT IN (
    'events',
    'community_gardens',
    'supported_gardening',
    'wildlife_gardening',
    'farms',
    'surplus_projects',
    'courses',
    'resources'
  ) THEN
    RAISE EXCEPTION 'invalid group_type';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.member_profiles (user_id, group_name, group_type)
  VALUES (NEW.id, v_group_name, v_group_type)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_self_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();
