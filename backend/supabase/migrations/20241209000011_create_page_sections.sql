-- Migration: 20241209000011_create_page_sections.sql
-- Description: Create page sections for dynamic content blocks

CREATE TABLE page_sections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id         UUID NOT NULL REFERENCES page_definitions(id) ON DELETE CASCADE,
    
    -- Section identification
    section_type    VARCHAR(50) NOT NULL,
    section_key     VARCHAR(100),
    
    -- Ordering & visibility
    position        INTEGER NOT NULL DEFAULT 0,
    is_enabled      BOOLEAN DEFAULT TRUE,
    
    -- Structured content (NOT raw HTML)
    config_json     JSONB NOT NULL DEFAULT '{}',
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_page_sections_page ON page_sections(page_id);
CREATE INDEX idx_page_sections_type ON page_sections(section_type);
CREATE INDEX idx_page_sections_position ON page_sections(page_id, position);
CREATE INDEX idx_page_sections_enabled ON page_sections(page_id, is_enabled) WHERE is_enabled = TRUE;
CREATE INDEX idx_page_sections_config ON page_sections USING GIN (config_json);

-- RLS
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read sections of published pages"
    ON page_sections FOR SELECT
    USING (
        is_enabled = TRUE AND
        EXISTS (
            SELECT 1 FROM page_definitions
            WHERE id = page_id AND is_published = TRUE
        )
    );

CREATE POLICY "Admins can manage page sections"
    ON page_sections FOR ALL
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
