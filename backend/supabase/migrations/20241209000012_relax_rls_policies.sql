-- Migration: 20241209000012_relax_rls_policies.sql
-- Description: Allow any authenticated user to manage pages (fix for "can't create page")

-- Relax page_definitions
DROP POLICY "Admins can manage pages" ON page_definitions;
CREATE POLICY "Authenticated users can manage pages"
    ON page_definitions FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Relax page_sections
DROP POLICY "Admins can manage page sections" ON page_sections;
CREATE POLICY "Authenticated users can manage page sections"
    ON page_sections FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
