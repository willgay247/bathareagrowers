
-- Fix admin_users INSERT policy: replace self-referential subquery with is_admin()
DROP POLICY IF EXISTS "admin_insert_admin_users" ON public.admin_users;
CREATE POLICY "admin_insert_admin_users" ON public.admin_users
  FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Fix admin_users DELETE policy: replace self-referential subquery with is_admin()
DROP POLICY IF EXISTS "admin_delete_admin_users" ON public.admin_users;
CREATE POLICY "admin_delete_admin_users" ON public.admin_users
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));

-- Add path restriction to public read policy on cms-images storage bucket
DROP POLICY IF EXISTS "public_read_cms_images" ON storage.objects;
CREATE POLICY "public_read_cms_images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'cms-images' AND (storage.foldername(name))[1] IN ('images', 'logos'));
