-- Extend the signup trigger to also capture bio and applicant_message
-- from auth user metadata.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_group_name        text := trim(both from coalesce(NEW.raw_user_meta_data->>'group_name', ''));
  v_group_type        text := nullif(trim(both from coalesce(NEW.raw_user_meta_data->>'group_type', '')), '');
  v_bio               text := nullif(trim(both from coalesce(NEW.raw_user_meta_data->>'bio', '')), '');
  v_applicant_message text := nullif(trim(both from coalesce(NEW.raw_user_meta_data->>'applicant_message', '')), '');
BEGIN
  IF v_group_name = '' THEN
    RETURN NEW;
  END IF;

  IF length(v_group_name) < 2 OR length(v_group_name) > 80 THEN
    RAISE EXCEPTION 'group_name must be 2 to 80 characters';
  END IF;

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

  INSERT INTO public.member_profiles (user_id, group_name, group_type, bio, applicant_message)
  VALUES (NEW.id, v_group_name, v_group_type, v_bio, v_applicant_message)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
