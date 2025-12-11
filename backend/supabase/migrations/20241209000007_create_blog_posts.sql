-- Migration: 20241209000007_create_blog_posts.sql
-- Description: Create blog posts base table

CREATE TABLE blog_posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    status          VARCHAR(20) DEFAULT 'draft',
    published_at    TIMESTAMPTZ,
    is_featured     BOOLEAN DEFAULT FALSE,
    
    reading_time    INTEGER,
    sort_order      INTEGER DEFAULT 0,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
    ON blog_posts FOR SELECT
    USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Admins can manage all posts"
    ON blog_posts FOR ALL
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
