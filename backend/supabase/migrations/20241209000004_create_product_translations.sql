-- Migration: 20241209000004_create_product_translations.sql
-- Description: Create product translations with per-locale pricing

CREATE TABLE product_translations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    locale            VARCHAR(5) NOT NULL REFERENCES locales(code),
    
    -- Content fields
    name              VARCHAR(200) NOT NULL,
    slug              VARCHAR(200) NOT NULL,
    short_description TEXT,
    description       TEXT,
    ingredients       TEXT,
    how_to_use        TEXT,
    
    -- Per-locale pricing (optional - hidden if NULL)
    price             DECIMAL(12, 2),
    compare_price     DECIMAL(12, 2),
    currency          VARCHAR(3) DEFAULT 'VND',
    
    -- SEO fields
    seo_title         VARCHAR(70),
    seo_description   VARCHAR(160),
    seo_keywords      TEXT,
    og_image_url      TEXT,
    
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(product_id, locale),
    UNIQUE(locale, slug)
);

-- Indexes
CREATE INDEX idx_product_trans_locale ON product_translations(locale);
CREATE INDEX idx_product_trans_slug ON product_translations(locale, slug);
CREATE INDEX idx_product_trans_product ON product_translations(product_id);

-- RLS
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read translations of active products"
    ON product_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE id = product_id AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can manage product translations"
    ON product_translations FOR ALL
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
