-- Migration: 20241209000010_create_page_definitions.sql
-- Description: Create page definitions for the visual page builder

CREATE TABLE page_definitions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Routing
    slug            VARCHAR(200) NOT NULL,
    route_pattern   VARCHAR(200),
    locale          VARCHAR(5) NOT NULL REFERENCES locales(code),
    
    -- Page metadata
    page_type       VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL,
    
    -- SEO fields
    seo_title       VARCHAR(70),
    seo_description VARCHAR(160),
    seo_og_image_url TEXT,
    seo_keywords    TEXT,
    
    -- Status
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(locale, slug)
);

-- Indexes
CREATE INDEX idx_page_definitions_locale ON page_definitions(locale);
CREATE INDEX idx_page_definitions_slug ON page_definitions(locale, slug);
CREATE INDEX idx_page_definitions_type ON page_definitions(page_type);
CREATE INDEX idx_page_definitions_published ON page_definitions(is_published) WHERE is_published = TRUE;

-- RLS
ALTER TABLE page_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published pages"
    ON page_definitions FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Admins can manage pages"
    ON page_definitions FOR ALL
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
