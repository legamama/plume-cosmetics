-- Migration: 20241209000013_make_rls_public.sql
-- Description: Make page management public to ensure seeding works in dev

-- Public page_definitions
DROP POLICY "Authenticated users can manage pages" ON page_definitions;
CREATE POLICY "Public can manage pages"
    ON page_definitions FOR ALL
    USING (true)
    WITH CHECK (true);

-- Public page_sections
DROP POLICY "Authenticated users can manage page sections" ON page_sections;
CREATE POLICY "Public can manage page sections"
    ON page_sections FOR ALL
    USING (true)
    WITH CHECK (true);
