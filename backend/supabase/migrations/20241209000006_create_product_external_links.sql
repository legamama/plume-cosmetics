-- Migration: 20241209000006_create_product_external_links.sql
-- Description: Create product external links for e-commerce platforms

CREATE TABLE product_external_links (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    platform      VARCHAR(50) NOT NULL,
    url           TEXT NOT NULL,
    label         VARCHAR(100),
    locale        VARCHAR(5) REFERENCES locales(code),
    is_active     BOOLEAN DEFAULT TRUE,
    sort_order    INTEGER DEFAULT 0,
    
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_external_links_product ON product_external_links(product_id);
CREATE INDEX idx_external_links_platform ON product_external_links(platform);
CREATE INDEX idx_external_links_active ON product_external_links(product_id, is_active) WHERE is_active = TRUE;

-- RLS
ALTER TABLE product_external_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active links of active products"
    ON product_external_links FOR SELECT
    USING (
        is_active = TRUE AND
        EXISTS (
            SELECT 1 FROM products
            WHERE id = product_id AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can manage external links"
    ON product_external_links FOR ALL
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
