
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'user');

-- 2. Create user_roles table (one role per user)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create user_section_permissions table
CREATE TABLE public.user_section_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section text NOT NULL,
  can_add boolean DEFAULT false,
  can_edit_own boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, section)
);
ALTER TABLE public.user_section_permissions ENABLE ROW LEVEL SECURITY;

-- 4. Add created_by to all content tables
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.community_gardens ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.supported_gardening ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.wildlife_gardening_entries ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.farms ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.surplus_projects ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- 5. Migrate existing admin_users to user_roles as super_admin
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'super_admin'::app_role FROM public.admin_users
ON CONFLICT (user_id) DO NOTHING;

-- 6. Helper functions (all SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role::app_role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.user_has_section_access(_user_id uuid, _section text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_section_permissions WHERE user_id = _user_id AND section = _section
  )
$$;

CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id uuid, _section text, _perm text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_section_permissions
    WHERE user_id = _user_id AND section = _section
    AND CASE _perm
      WHEN 'can_add' THEN can_add
      WHEN 'can_edit_own' THEN can_edit_own
      ELSE false
    END
  )
$$;

-- Update existing is_admin to use user_roles
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  )
$$;

-- 7. RLS on user_roles
CREATE POLICY "super_admin_all_user_roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "admin_select_user_roles" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_insert_user_roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND role = 'user'::app_role);

CREATE POLICY "admin_delete_user_roles" ON public.user_roles
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND role = 'user'::app_role);

CREATE POLICY "user_select_own_role" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 8. RLS on user_section_permissions
CREATE POLICY "super_admin_all_perms" ON public.user_section_permissions
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "admin_select_perms" ON public.user_section_permissions
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_insert_perms" ON public.user_section_permissions
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_section_permissions.user_id AND role = 'user'::app_role)
);

CREATE POLICY "admin_update_perms" ON public.user_section_permissions
FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_section_permissions.user_id AND role = 'user'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_section_permissions.user_id AND role = 'user'::app_role)
);

CREATE POLICY "admin_delete_perms" ON public.user_section_permissions
FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_section_permissions.user_id AND role = 'user'::app_role)
);

CREATE POLICY "user_select_own_perms" ON public.user_section_permissions
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 9. User-level policies on content tables

-- EVENTS
CREATE POLICY "user_select_events" ON public.events
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'events'));

CREATE POLICY "user_insert_events" ON public.events
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'events', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_events" ON public.events
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'events', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'events', 'can_edit_own')
  AND created_by = auth.uid()
);

-- COMMUNITY GARDENS
CREATE POLICY "user_select_community_gardens" ON public.community_gardens
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'community_gardens'));

CREATE POLICY "user_insert_community_gardens" ON public.community_gardens
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'community_gardens', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_community_gardens" ON public.community_gardens
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'community_gardens', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'community_gardens', 'can_edit_own')
  AND created_by = auth.uid()
);

-- SUPPORTED GARDENING
CREATE POLICY "user_select_supported_gardening" ON public.supported_gardening
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'supported_gardening'));

CREATE POLICY "user_insert_supported_gardening" ON public.supported_gardening
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'supported_gardening', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_supported_gardening" ON public.supported_gardening
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'supported_gardening', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'supported_gardening', 'can_edit_own')
  AND created_by = auth.uid()
);

-- WILDLIFE GARDENING
CREATE POLICY "user_select_wildlife" ON public.wildlife_gardening_entries
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'wildlife_gardening'));

CREATE POLICY "user_insert_wildlife" ON public.wildlife_gardening_entries
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'wildlife_gardening', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_wildlife" ON public.wildlife_gardening_entries
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'wildlife_gardening', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'wildlife_gardening', 'can_edit_own')
  AND created_by = auth.uid()
);

-- FARMS
CREATE POLICY "user_select_farms" ON public.farms
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'farms'));

CREATE POLICY "user_insert_farms" ON public.farms
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'farms', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_farms" ON public.farms
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'farms', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'farms', 'can_edit_own')
  AND created_by = auth.uid()
);

-- SURPLUS PROJECTS
CREATE POLICY "user_select_surplus" ON public.surplus_projects
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'surplus_projects'));

CREATE POLICY "user_insert_surplus" ON public.surplus_projects
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'surplus_projects', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_surplus" ON public.surplus_projects
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'surplus_projects', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'surplus_projects', 'can_edit_own')
  AND created_by = auth.uid()
);

-- COURSES
CREATE POLICY "user_select_courses" ON public.courses
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'courses'));

CREATE POLICY "user_insert_courses" ON public.courses
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'courses', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_courses" ON public.courses
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'courses', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'courses', 'can_edit_own')
  AND created_by = auth.uid()
);

-- RESOURCES
CREATE POLICY "user_select_resources" ON public.resources
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'resources'));

CREATE POLICY "user_insert_resources" ON public.resources
FOR INSERT TO authenticated
WITH CHECK (
  public.user_has_permission(auth.uid(), 'resources', 'can_add')
  AND created_by = auth.uid()
);

CREATE POLICY "user_update_own_resources" ON public.resources
FOR UPDATE TO authenticated
USING (
  public.user_has_permission(auth.uid(), 'resources', 'can_edit_own')
  AND created_by = auth.uid()
)
WITH CHECK (
  public.user_has_permission(auth.uid(), 'resources', 'can_edit_own')
  AND created_by = auth.uid()
);

-- CONTACTS (view-only for users)
CREATE POLICY "user_select_contacts" ON public.contact_submissions
FOR SELECT TO authenticated
USING (public.user_has_section_access(auth.uid(), 'contacts'));
