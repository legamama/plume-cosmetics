-- Migration: 20241211000001_fix_product_external_links_rls.sql
-- Description: Fix RLS policies for product tables to allow authenticated users to manage them

BEGIN;

-- =====================
-- PRODUCT EXTERNAL LINKS
-- =====================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public can read active links of active products" ON product_external_links;
DROP POLICY IF EXISTS "Admins can manage external links" ON product_external_links;

-- Drop new policies if they already exist (for idempotency)
DROP POLICY IF EXISTS "Public can read external links" ON product_external_links;
DROP POLICY IF EXISTS "Authenticated users can manage external links" ON product_external_links;

-- Public read policy (for anonymous frontend users)
CREATE POLICY "Public can read external links"
    ON product_external_links FOR SELECT
    USING (is_active = TRUE);

-- Authenticated users can manage all external links
CREATE POLICY "Authenticated users can manage external links"
    ON product_external_links FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================
-- PRODUCTS
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Drop new policies if they already exist
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Public can read all products (published status is handled at app level)
CREATE POLICY "Public can read products"
    ON products FOR SELECT
    USING (true);

-- Authenticated users can manage all products
CREATE POLICY "Authenticated users can manage products"
    ON products FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================
-- PRODUCT TRANSLATIONS
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read translations of active products" ON product_translations;
DROP POLICY IF EXISTS "Admins can manage translations" ON product_translations;

-- Drop new policies if they already exist
DROP POLICY IF EXISTS "Public can read translations" ON product_translations;
DROP POLICY IF EXISTS "Authenticated users can manage translations" ON product_translations;

-- Public can read all translations
CREATE POLICY "Public can read translations"
    ON product_translations FOR SELECT
    USING (true);

-- Authenticated users can manage all translations
CREATE POLICY "Authenticated users can manage translations"
    ON product_translations FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================
-- PRODUCT MEDIA
-- =====================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read media of active products" ON product_media;
DROP POLICY IF EXISTS "Admins can manage media" ON product_media;

-- Drop new policies if they already exist
DROP POLICY IF EXISTS "Public can read media" ON product_media;
DROP POLICY IF EXISTS "Authenticated users can manage media" ON product_media;

-- Public can read all media
CREATE POLICY "Public can read media"
    ON product_media FOR SELECT
    USING (true);

-- Authenticated users can manage all media
CREATE POLICY "Authenticated users can manage media"
    ON product_media FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

COMMIT;
