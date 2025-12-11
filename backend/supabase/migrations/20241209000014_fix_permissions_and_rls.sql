-- Migration: 20241209000014_fix_permissions_and_rls.sql
-- Description: Consolidate RLS fixes. Force policies to be PUBLIC for dev.

BEGIN;

-- 1. Enable RLS (just in case)
ALTER TABLE page_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read published pages" ON page_definitions;
DROP POLICY IF EXISTS "Admins can manage pages" ON page_definitions;
DROP POLICY IF EXISTS "Authenticated users can manage pages" ON page_definitions;
DROP POLICY IF EXISTS "Public can manage pages" ON page_definitions;

DROP POLICY IF EXISTS "Public can read sections of published pages" ON page_sections;
DROP POLICY IF EXISTS "Admins can manage page sections" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can manage page sections" ON page_sections;
DROP POLICY IF EXISTS "Public can manage page sections" ON page_sections;

-- 3. Create ULTIMATE PUBLIC POLICIES (Allow ALL access to EVERYONE for Dev)
CREATE POLICY "Enable ALL access for page_definitions"
    ON page_definitions FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable ALL access for page_sections"
    ON page_sections FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Grant schema usage (sometimes needed for Anon role)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

COMMIT;
