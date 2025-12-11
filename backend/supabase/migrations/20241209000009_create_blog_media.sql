-- Migration: 20241209000009_create_blog_media.sql
-- Description: Create blog media table for Bunny CDN URLs

CREATE TABLE blog_media (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id  UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    
    url           TEXT NOT NULL,
    alt_text      VARCHAR(200),
    type          VARCHAR(20) DEFAULT 'image',
    is_featured   BOOLEAN DEFAULT FALSE,
    sort_order    INTEGER DEFAULT 0,
    caption       TEXT,
    
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_media_post ON blog_media(blog_post_id);
CREATE INDEX idx_blog_media_featured ON blog_media(blog_post_id, is_featured) WHERE is_featured = TRUE;

-- RLS
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media of published posts"
    ON blog_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE id = blog_post_id
            AND status = 'published'
            AND published_at <= NOW()
        )
    );

CREATE POLICY "Admins can manage blog media"
    ON blog_media FOR ALL
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
