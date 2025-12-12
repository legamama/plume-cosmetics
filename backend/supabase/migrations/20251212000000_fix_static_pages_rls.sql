-- Migration: 20251212000000_fix_static_pages_rls.sql
-- Description: Update RLS policies for static pages to allow authenticated users to manage them
-- This aligns with the permissions pattern used in product tables.

BEGIN;

-- =====================
-- STATIC PAGES
-- =====================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin Write static_pages" ON static_pages;

-- Create new permissive policy for authenticated users
CREATE POLICY "Authenticated users can manage static_pages"
    ON static_pages FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================
-- STATIC PAGE TRANSLATIONS
-- =====================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin Write static_page_translations" ON static_page_translations;

-- Create new permissive policy for authenticated users
CREATE POLICY "Authenticated users can manage static_page_translations"
    ON static_page_translations FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

COMMIT;
