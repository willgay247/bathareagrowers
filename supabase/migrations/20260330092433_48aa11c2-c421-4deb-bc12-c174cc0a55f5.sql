-- TABLE 1: community_gardens
CREATE TABLE public.community_gardens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL CHECK (region IN ('west','central','east')),
  image_url text,
  bio text,
  external_link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_gardens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_community_gardens" ON public.community_gardens FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_community_gardens" ON public.community_gardens FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_community_gardens" ON public.community_gardens FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_community_gardens" ON public.community_gardens FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_community_gardens" ON public.community_gardens FOR DELETE TO authenticated USING (true);

-- TABLE 2: supported_gardening
CREATE TABLE public.supported_gardening (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  description text,
  link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.supported_gardening ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_supported_gardening" ON public.supported_gardening FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_supported_gardening" ON public.supported_gardening FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_supported_gardening" ON public.supported_gardening FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_supported_gardening" ON public.supported_gardening FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_supported_gardening" ON public.supported_gardening FOR DELETE TO authenticated USING (true);

-- TABLE 3: wildlife_gardening_entries
CREATE TABLE public.wildlife_gardening_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  description text,
  link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.wildlife_gardening_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_wildlife" ON public.wildlife_gardening_entries FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_wildlife" ON public.wildlife_gardening_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_wildlife" ON public.wildlife_gardening_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_wildlife" ON public.wildlife_gardening_entries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_wildlife" ON public.wildlife_gardening_entries FOR DELETE TO authenticated USING (true);

-- TABLE 4: farms
CREATE TABLE public.farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  description text,
  volunteering_link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_farms" ON public.farms FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_farms" ON public.farms FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_farms" ON public.farms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_farms" ON public.farms FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_farms" ON public.farms FOR DELETE TO authenticated USING (true);

-- TABLE 5: surplus_projects
CREATE TABLE public.surplus_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  description text,
  link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.surplus_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_surplus" ON public.surplus_projects FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_surplus" ON public.surplus_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_surplus" ON public.surplus_projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_surplus" ON public.surplus_projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_surplus" ON public.surplus_projects FOR DELETE TO authenticated USING (true);

-- TABLE 6: courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  logo_url text,
  course_name text,
  location text,
  link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_courses" ON public.courses FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_courses" ON public.courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_courses" ON public.courses FOR DELETE TO authenticated USING (true);

-- TABLE 7: resources
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  link text,
  hidden boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_resources" ON public.resources FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_resources" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_resources" ON public.resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_resources" ON public.resources FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_resources" ON public.resources FOR DELETE TO authenticated USING (true);

-- TABLE 8: events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  date_display text,
  event_date date,
  time_display text,
  location text,
  address text,
  organiser text DEFAULT 'Bath Area Growers',
  tags text[],
  image_url text,
  description text,
  booking_link text,
  hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_events" ON public.events FOR SELECT TO anon USING (hidden = false);
CREATE POLICY "auth_select_events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_insert_events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_events" ON public.events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_events" ON public.events FOR DELETE TO authenticated USING (true);

-- TABLE 9: contact_submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  is_read boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_contact" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_select_contact" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_contact" ON public.contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_contact" ON public.contact_submissions FOR DELETE TO authenticated USING (true);

-- Storage bucket: cms-images (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

CREATE POLICY "public_read_cms_images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
CREATE POLICY "auth_upload_cms_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-images');
CREATE POLICY "auth_update_cms_images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-images');
CREATE POLICY "auth_delete_cms_images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-images');