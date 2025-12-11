-- Create media_folders table
CREATE TABLE media_folders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    parent_id       UUID REFERENCES media_folders(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Create media_assets table
CREATE TABLE media_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- File Metadata
    filename        VARCHAR(255) NOT NULL,          -- Original filename
    mime_type       VARCHAR(100) NOT NULL,          -- e.g. 'image/jpeg'
    size_bytes      INTEGER,
    width           INTEGER,                        -- For images
    height          INTEGER,                        -- For images
    
    -- Bunny Integration
    bunny_path      TEXT NOT NULL,                  -- Storage path (e.g. '/2024/01/image.jpg')
    bunny_cdn_url   TEXT NOT NULL,                  -- Full public URL
    
    -- Organization
    folder_id       UUID REFERENCES media_folders(id) ON DELETE SET NULL,
    alt_text        VARCHAR(255),                   -- Default alt text
    credits         VARCHAR(255),
    
    uploaded_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_media_assets_folder ON media_assets(folder_id);
CREATE INDEX idx_media_assets_mime ON media_assets(mime_type);
CREATE INDEX idx_media_assets_uploaded_by ON media_assets(uploaded_by);

-- Enable RLS
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Policies for media_folders
-- Admins have full access
CREATE POLICY "Admins can do everything with media_folders" 
ON media_folders
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' LIKE '%@plume.vn%') -- Adjust this check based on your actual admin role implementation
WITH CHECK (auth.jwt() ->> 'email' LIKE '%@plume.vn%');

-- Policies for media_assets
-- Admins have full access
CREATE POLICY "Admins can do everything with media_assets" 
ON media_assets
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' LIKE '%@plume.vn%') 
WITH CHECK (auth.jwt() ->> 'email' LIKE '%@plume.vn%');

-- Everyone can view (for frontend usage if needed, though they mostly use CDN URLs provided in other tables)
CREATE POLICY "Public can view media_assets" 
ON media_assets
FOR SELECT
TO public
USING (true);
