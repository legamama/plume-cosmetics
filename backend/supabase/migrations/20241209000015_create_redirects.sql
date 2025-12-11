-- Migration: 20241209000015_create_redirects.sql
-- Description: Create redirects table for URL management

CREATE TABLE redirects (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Redirect Configuration
    from_path     VARCHAR(200) NOT NULL,          -- e.g. /old-product
    to_url        TEXT NOT NULL,                  -- e.g. /products/new-product or https://google.com
    status_code   INTEGER DEFAULT 301,            -- 301 (Permanent) or 302 (Temporary)
    is_enabled    BOOLEAN DEFAULT TRUE,
    
    -- Optional categorization
    site          VARCHAR(50),                    -- specific site/domain if multi-tenant
    locale        VARCHAR(5),                     -- specific locale if needed
    
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure unique source path
-- We enforce uniqueness on from_path. If you support multi-site/multi-locale, you might want to include those in the unique constraint.
-- For now, per the plan, global uniqueness on from_path is a good start, or scoped by site if site is used.
-- Based on the user request "path only like /old-url", we'll assume global for now but add an index.
CREATE UNIQUE INDEX idx_redirects_from ON redirects(from_path);
CREATE INDEX idx_redirects_enabled ON redirects(is_enabled) WHERE is_enabled = TRUE;

-- Triggers
CREATE TRIGGER update_redirects_updated_at
    BEFORE UPDATE ON redirects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public: No direct access (redirects are consumed by system/build process)
-- No policy = deny all by default for public/anon

-- Admins: Full access
CREATE POLICY "Admins can manage redirects"
    ON redirects FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());
