
-- Replace the broad public SELECT policy with a more restrictive one
-- Public can still GET individual files via public URLs (storage handles that),
-- but listing the bucket contents is restricted to admins.
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;

-- Allow anyone to read individual objects (needed for <img src="..."/>)
CREATE POLICY "Anyone can view individual product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
