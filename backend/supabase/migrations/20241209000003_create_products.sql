-- Migration: 20241209000003_create_products.sql
-- Description: Create products base table

CREATE TABLE products (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id   UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    sku           VARCHAR(50) UNIQUE,
    is_featured   BOOLEAN DEFAULT FALSE,
    is_active     BOOLEAN DEFAULT TRUE,
    is_new        BOOLEAN DEFAULT FALSE,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = TRUE;

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
    ON products FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
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
