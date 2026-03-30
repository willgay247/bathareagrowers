
-- Fix 1: Remove user_select_contacts policy so only admins can read contact submissions
DROP POLICY IF EXISTS "user_select_contacts" ON public.contact_submissions;

-- Fix 2: Tighten admin_insert_user_roles to prevent admins from inserting roles for themselves
DROP POLICY IF EXISTS "admin_insert_user_roles" ON public.user_roles;
CREATE POLICY "admin_insert_user_roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::text)
    AND role = 'user'::app_role
    AND user_id != auth.uid()
  );

-- Also tighten admin_delete to prevent self-deletion
DROP POLICY IF EXISTS "admin_delete_user_roles" ON public.user_roles;
CREATE POLICY "admin_delete_user_roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::text)
    AND role = 'user'::app_role
    AND user_id != auth.uid()
  );

-- Fix 3: Allow authenticated users with section permissions to upload to cms-images
CREATE POLICY "user_upload_cms_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms-images'
    AND has_any_role(auth.uid())
  );
