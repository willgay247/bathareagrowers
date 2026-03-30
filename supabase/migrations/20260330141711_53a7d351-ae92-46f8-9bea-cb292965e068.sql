
-- Drop old permissive storage policies on cms-images
DROP POLICY IF EXISTS "auth_upload_cms_images" ON storage.objects;
DROP POLICY IF EXISTS "auth_update_cms_images" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_cms_images" ON storage.objects;

-- Create admin-only storage write policies
CREATE POLICY "admin_upload_cms_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-images' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_update_cms_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-images' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'cms-images' AND public.is_admin(auth.uid()));

CREATE POLICY "admin_delete_cms_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-images' AND public.is_admin(auth.uid()));

-- Remove the overly permissive anon insert policy on contact_submissions
DROP POLICY IF EXISTS "anon_insert_contact" ON public.contact_submissions;
