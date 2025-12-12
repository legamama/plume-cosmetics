-- Migration: 20251212000002_fix_static_page_slots_rls.sql
-- Description: Update RLS policies for static_page_slots to allow authenticated users to manage them
-- This aligns with the permissions pattern used in static_pages and static_page_translations tables.

BEGIN;

-- =====================
-- STATIC PAGE SLOTS
-- =====================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin Write static_page_slots" ON static_page_slots;

-- Create new permissive policy for authenticated users
CREATE POLICY "Authenticated users can manage static_page_slots"
    ON static_page_slots FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

COMMIT;
