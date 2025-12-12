-- Migration: Remove Bunny CDN dependencies and switch to Supabase Storage

-- 1. Create 'media' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Rename columns in media_assets table
ALTER TABLE media_assets
    RENAME COLUMN bunny_path TO storage_path;

ALTER TABLE media_assets
    RENAME COLUMN bunny_cdn_url TO public_url;

-- 3. Rename columns in product_media (if applicable, user schema had standard 'url' but let's be safe)
-- Note: based on plan, product_media already uses 'url' but we should ensure no bunny content remains.
-- If product_media had bunny columns, we'd rename them here. Checking previous grep, it seemed to have 'url'.

-- 4. Set up RLS for Storage
-- Allow public read access to 'media' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users (admins) to upload/delete
CREATE POLICY "Authenticated Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );

-- 5. Comments cleanup
COMMENT ON COLUMN media_assets.storage_path IS 'Supabase Storage path (e.g. folder/file.jpg)';
COMMENT ON COLUMN media_assets.public_url IS 'Full Supabase public URL';
