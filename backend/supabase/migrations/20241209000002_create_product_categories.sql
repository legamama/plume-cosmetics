-- Migration: 20241209000002_create_product_categories.sql
-- Description: Create product categories with translations

CREATE TABLE product_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) UNIQUE NOT NULL,
    parent_id   UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_category_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL REFERENCES locales(code),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    seo_title       VARCHAR(70),
    seo_description VARCHAR(160),
    
    UNIQUE(category_id, locale)
);

-- Indexes
CREATE INDEX idx_product_categories_parent ON product_categories(parent_id);
CREATE INDEX idx_product_categories_active ON product_categories(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_product_category_trans_locale ON product_category_translations(locale);

-- RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
    ON product_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories"
    ON product_categories FOR ALL
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

CREATE POLICY "Public can read category translations"
    ON product_category_translations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM product_categories
            WHERE id = category_id AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can manage category translations"
    ON product_category_translations FOR ALL
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
