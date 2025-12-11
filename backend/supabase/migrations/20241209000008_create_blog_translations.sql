-- Migration: 20241209000008_create_blog_translations.sql
-- Description: Create blog translations with SEO fields

CREATE TABLE blog_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id    UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL REFERENCES locales(code),
    
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    excerpt         TEXT,
    content         TEXT,
    
    seo_title       VARCHAR(70),
    seo_description VARCHAR(160),
    seo_keywords    TEXT,
    og_image_url    TEXT,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(blog_post_id, locale),
    UNIQUE(locale, slug)
);

-- Indexes
CREATE INDEX idx_blog_trans_locale ON blog_translations(locale);
CREATE INDEX idx_blog_trans_slug ON blog_translations(locale, slug);
CREATE INDEX idx_blog_trans_post ON blog_translations(blog_post_id);

-- RLS
ALTER TABLE blog_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read translations of published posts"
    ON blog_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE id = blog_post_id
            AND status = 'published'
            AND published_at <= NOW()
        )
    );

CREATE POLICY "Admins can manage blog translations"
    ON blog_translations FOR ALL
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
