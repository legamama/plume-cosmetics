-- Migration: 20241209000005_create_product_media.sql
-- Description: Create product media table for Bunny CDN URLs

CREATE TABLE product_media (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    url           TEXT NOT NULL,
    alt_text      VARCHAR(200),
    type          VARCHAR(20) DEFAULT 'image',
    is_primary    BOOLEAN DEFAULT FALSE,
    sort_order    INTEGER DEFAULT 0,
    
    width         INTEGER,
    height        INTEGER,
    file_size     INTEGER,
    
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_product_media_product ON product_media(product_id);
CREATE INDEX idx_product_media_primary ON product_media(product_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_product_media_sort ON product_media(product_id, sort_order);

-- RLS
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media of active products"
    ON product_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE id = product_id AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can manage product media"
    ON product_media FOR ALL
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
