-- Migration: 20241209000012_create_navigation_items.sql
-- Description: Create navigation items for site navigation structure

CREATE TABLE navigation_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locale          VARCHAR(5) NOT NULL REFERENCES locales(code),
    
    -- Navigation structure
    nav_group       VARCHAR(50) NOT NULL DEFAULT 'main',
    parent_id       UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    
    -- Link details
    label           VARCHAR(100) NOT NULL,
    href            VARCHAR(200) NOT NULL,
    target          VARCHAR(20) DEFAULT '_self',
    icon            VARCHAR(50),
    
    -- Ordering & visibility
    position        INTEGER DEFAULT 0,
    is_enabled      BOOLEAN DEFAULT TRUE,
    
    -- Optional: highlight styles
    highlight       BOOLEAN DEFAULT FALSE,
    badge_text      VARCHAR(20),
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_navigation_locale ON navigation_items(locale);
CREATE INDEX idx_navigation_group ON navigation_items(locale, nav_group);
CREATE INDEX idx_navigation_parent ON navigation_items(parent_id);
CREATE INDEX idx_navigation_enabled ON navigation_items(is_enabled) WHERE is_enabled = TRUE;

-- RLS
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read enabled navigation"
    ON navigation_items FOR SELECT
    USING (is_enabled = TRUE);

CREATE POLICY "Admins can manage navigation"
    ON navigation_items FOR ALL
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
