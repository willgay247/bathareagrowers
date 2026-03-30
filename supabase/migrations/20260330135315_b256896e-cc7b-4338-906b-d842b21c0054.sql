
-- 1. Create admin_users table
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read/manage admin_users
CREATE POLICY "admin_select_admin_users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "admin_insert_admin_users" ON public.admin_users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "admin_delete_admin_users" ON public.admin_users
  FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- 2. Create is_admin helper function (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = _user_id
  )
$$;

-- 3. Seed ALL existing authenticated users as admins (since they are the site admins)
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 4. Drop all permissive authenticated write policies and replace with admin-only

-- community_gardens
DROP POLICY IF EXISTS "auth_insert_community_gardens" ON public.community_gardens;
DROP POLICY IF EXISTS "auth_update_community_gardens" ON public.community_gardens;
DROP POLICY IF EXISTS "auth_delete_community_gardens" ON public.community_gardens;
CREATE POLICY "admin_insert_community_gardens" ON public.community_gardens FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_community_gardens" ON public.community_gardens FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_community_gardens" ON public.community_gardens FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- supported_gardening
DROP POLICY IF EXISTS "auth_insert_supported_gardening" ON public.supported_gardening;
DROP POLICY IF EXISTS "auth_update_supported_gardening" ON public.supported_gardening;
DROP POLICY IF EXISTS "auth_delete_supported_gardening" ON public.supported_gardening;
CREATE POLICY "admin_insert_supported_gardening" ON public.supported_gardening FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_supported_gardening" ON public.supported_gardening FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_supported_gardening" ON public.supported_gardening FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- wildlife_gardening_entries
DROP POLICY IF EXISTS "auth_insert_wildlife" ON public.wildlife_gardening_entries;
DROP POLICY IF EXISTS "auth_update_wildlife" ON public.wildlife_gardening_entries;
DROP POLICY IF EXISTS "auth_delete_wildlife" ON public.wildlife_gardening_entries;
CREATE POLICY "admin_insert_wildlife" ON public.wildlife_gardening_entries FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_wildlife" ON public.wildlife_gardening_entries FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_wildlife" ON public.wildlife_gardening_entries FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- farms
DROP POLICY IF EXISTS "auth_insert_farms" ON public.farms;
DROP POLICY IF EXISTS "auth_update_farms" ON public.farms;
DROP POLICY IF EXISTS "auth_delete_farms" ON public.farms;
CREATE POLICY "admin_insert_farms" ON public.farms FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_farms" ON public.farms FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_farms" ON public.farms FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- surplus_projects
DROP POLICY IF EXISTS "auth_insert_surplus" ON public.surplus_projects;
DROP POLICY IF EXISTS "auth_update_surplus" ON public.surplus_projects;
DROP POLICY IF EXISTS "auth_delete_surplus" ON public.surplus_projects;
CREATE POLICY "admin_insert_surplus" ON public.surplus_projects FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_surplus" ON public.surplus_projects FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_surplus" ON public.surplus_projects FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- resources
DROP POLICY IF EXISTS "auth_insert_resources" ON public.resources;
DROP POLICY IF EXISTS "auth_update_resources" ON public.resources;
DROP POLICY IF EXISTS "auth_delete_resources" ON public.resources;
CREATE POLICY "admin_insert_resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_resources" ON public.resources FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_resources" ON public.resources FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- events
DROP POLICY IF EXISTS "auth_insert_events" ON public.events;
DROP POLICY IF EXISTS "auth_update_events" ON public.events;
DROP POLICY IF EXISTS "auth_delete_events" ON public.events;
CREATE POLICY "admin_insert_events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_events" ON public.events FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_events" ON public.events FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- courses
DROP POLICY IF EXISTS "auth_insert_courses" ON public.courses;
DROP POLICY IF EXISTS "auth_update_courses" ON public.courses;
DROP POLICY IF EXISTS "auth_delete_courses" ON public.courses;
CREATE POLICY "admin_insert_courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_courses" ON public.courses FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_courses" ON public.courses FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- contact_submissions
DROP POLICY IF EXISTS "auth_insert_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "auth_update_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "auth_delete_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "auth_select_contact" ON public.contact_submissions;
CREATE POLICY "admin_select_contact" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin_insert_contact" ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_update_contact" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin_delete_contact" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- 5. Also tighten the authenticated SELECT policies on content tables to admin-only
DROP POLICY IF EXISTS "auth_select_community_gardens" ON public.community_gardens;
CREATE POLICY "admin_select_community_gardens" ON public.community_gardens FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_supported_gardening" ON public.supported_gardening;
CREATE POLICY "admin_select_supported_gardening" ON public.supported_gardening FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_wildlife" ON public.wildlife_gardening_entries;
CREATE POLICY "admin_select_wildlife" ON public.wildlife_gardening_entries FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_farms" ON public.farms;
CREATE POLICY "admin_select_farms" ON public.farms FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_surplus" ON public.surplus_projects;
CREATE POLICY "admin_select_surplus" ON public.surplus_projects FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_resources" ON public.resources;
CREATE POLICY "admin_select_resources" ON public.resources FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_events" ON public.events;
CREATE POLICY "admin_select_events" ON public.events FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "auth_select_courses" ON public.courses;
CREATE POLICY "admin_select_courses" ON public.courses FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
