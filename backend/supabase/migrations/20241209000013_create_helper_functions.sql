-- Migration: 20241209000013_create_helper_functions.sql
-- Description: Create helper functions and triggers

-- Admin role check helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Slug generation function: converts title to URL-safe slug
-- Handles Vietnamese characters by transliterating to ASCII
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    -- Convert to lowercase
    result := LOWER(title);
    
    -- Vietnamese character transliteration
    result := TRANSLATE(result,
        'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
        'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
    );
    
    -- Replace spaces and special chars with hyphens
    result := REGEXP_REPLACE(result, '[^a-z0-9가-힣\-]', '-', 'g');
    
    -- Remove consecutive hyphens
    result := REGEXP_REPLACE(result, '-+', '-', 'g');
    
    -- Trim hyphens from start and end
    result := TRIM(BOTH '-' FROM result);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-generate slug from name for product translations
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Only generate if slug is NULL or empty
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.name);
        final_slug := base_slug;
        
        -- Handle uniqueness by appending counter if needed
        WHILE EXISTS (
            SELECT 1 FROM product_translations 
            WHERE locale = NEW.locale AND slug = final_slug 
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        ) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate slug for blog translations
CREATE OR REPLACE FUNCTION auto_generate_blog_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := generate_slug(NEW.title);
        final_slug := base_slug;
        
        WHILE EXISTS (
            SELECT 1 FROM blog_translations 
            WHERE locale = NEW.locale AND slug = final_slug 
            AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        ) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_translations_updated_at
    BEFORE UPDATE ON product_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_external_links_updated_at
    BEFORE UPDATE ON product_external_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_translations_updated_at
    BEFORE UPDATE ON blog_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_page_definitions_updated_at
    BEFORE UPDATE ON page_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_page_sections_updated_at
    BEFORE UPDATE ON page_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_navigation_items_updated_at
    BEFORE UPDATE ON navigation_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-slug triggers
CREATE TRIGGER auto_slug_product_translations
    BEFORE INSERT OR UPDATE ON product_translations
    FOR EACH ROW EXECUTE FUNCTION auto_generate_product_slug();

CREATE TRIGGER auto_slug_blog_translations
    BEFORE INSERT OR UPDATE ON blog_translations
    FOR EACH ROW EXECUTE FUNCTION auto_generate_blog_slug();
