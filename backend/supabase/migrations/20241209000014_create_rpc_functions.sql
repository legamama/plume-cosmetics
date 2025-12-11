-- Migration: 20241209000014_create_rpc_functions.sql
-- Description: Create RPC functions for page builder

-- Get complete page content with sections
CREATE OR REPLACE FUNCTION get_page_content(p_locale VARCHAR(5), p_slug VARCHAR(200))
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'page', json_build_object(
            'id', pd.id,
            'slug', pd.slug,
            'page_type', pd.page_type,
            'title', pd.title,
            'seo', json_build_object(
                'title', pd.seo_title,
                'description', pd.seo_description,
                'og_image_url', pd.seo_og_image_url,
                'keywords', pd.seo_keywords
            ),
            'is_published', pd.is_published,
            'published_at', pd.published_at
        ),
        'sections', COALESCE(
            (SELECT json_agg(
                json_build_object(
                    'id', ps.id,
                    'section_type', ps.section_type,
                    'section_key', ps.section_key,
                    'position', ps.position,
                    'config', ps.config_json
                ) ORDER BY ps.position ASC
            )
            FROM page_sections ps
            WHERE ps.page_id = pd.id
            AND ps.is_enabled = TRUE),
            '[]'::json
        ),
        'alternate_pages', (
            SELECT json_object_agg(
                alt.locale,
                json_build_object('slug', alt.slug, 'title', alt.title)
            )
            FROM page_definitions alt
            WHERE alt.slug = pd.slug
            AND alt.is_published = TRUE
        )
    ) INTO result
    FROM page_definitions pd
    WHERE pd.locale = p_locale
    AND pd.slug = p_slug
    AND pd.is_published = TRUE;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get navigation items with nested children
CREATE OR REPLACE FUNCTION get_navigation(p_locale VARCHAR(5), p_nav_group VARCHAR(50) DEFAULT 'main')
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE nav_tree AS (
        -- Root level items (no parent)
        SELECT 
            id, parent_id, label, href, target, icon, 
            position, highlight, badge_text,
            0 as depth
        FROM navigation_items
        WHERE locale = p_locale
        AND nav_group = p_nav_group
        AND parent_id IS NULL
        AND is_enabled = TRUE
        
        UNION ALL
        
        -- Child items
        SELECT 
            ni.id, ni.parent_id, ni.label, ni.href, ni.target, ni.icon,
            ni.position, ni.highlight, ni.badge_text,
            nt.depth + 1
        FROM navigation_items ni
        INNER JOIN nav_tree nt ON ni.parent_id = nt.id
        WHERE ni.is_enabled = TRUE
    )
    SELECT json_agg(
        json_build_object(
            'id', id,
            'label', label,
            'href', href,
            'target', target,
            'icon', icon,
            'highlight', highlight,
            'badge_text', badge_text,
            'children', (
                SELECT json_agg(
                    json_build_object(
                        'id', c.id,
                        'label', c.label,
                        'href', c.href,
                        'target', c.target,
                        'icon', c.icon,
                        'highlight', c.highlight,
                        'badge_text', c.badge_text
                    ) ORDER BY c.position
                )
                FROM nav_tree c
                WHERE c.parent_id = nav_tree.id
            )
        ) ORDER BY position
    ) INTO result
    FROM nav_tree
    WHERE parent_id IS NULL;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get all published pages for sitemap/nav generation
CREATE OR REPLACE FUNCTION get_all_pages(p_locale VARCHAR(5))
RETURNS JSON AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'id', id,
                'slug', slug,
                'page_type', page_type,
                'title', title,
                'seo_title', seo_title
            ) ORDER BY page_type, title
        )
        FROM page_definitions
        WHERE locale = p_locale
        AND is_published = TRUE
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get product by slug with full details
CREATE OR REPLACE FUNCTION get_product_by_slug(p_locale VARCHAR(5), p_slug VARCHAR(200))
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'sku', p.sku,
        'is_featured', p.is_featured,
        'is_new', p.is_new,
        'category', (
            SELECT json_build_object(
                'id', pc.id,
                'slug', pc.slug,
                'name', pct.name
            )
            FROM product_categories pc
            LEFT JOIN product_category_translations pct ON pct.category_id = pc.id AND pct.locale = p_locale
            WHERE pc.id = p.category_id
        ),
        'translation', json_build_object(
            'name', pt.name,
            'slug', pt.slug,
            'short_description', pt.short_description,
            'description', pt.description,
            'ingredients', pt.ingredients,
            'how_to_use', pt.how_to_use,
            'price', pt.price,
            'compare_price', pt.compare_price,
            'currency', pt.currency,
            'seo_title', pt.seo_title,
            'seo_description', pt.seo_description,
            'seo_keywords', pt.seo_keywords,
            'og_image_url', pt.og_image_url
        ),
        'media', (
            SELECT json_agg(
                json_build_object(
                    'id', pm.id,
                    'url', pm.url,
                    'alt_text', pm.alt_text,
                    'type', pm.type,
                    'is_primary', pm.is_primary,
                    'sort_order', pm.sort_order
                ) ORDER BY pm.is_primary DESC, pm.sort_order ASC
            )
            FROM product_media pm
            WHERE pm.product_id = p.id
        ),
        'external_links', (
            SELECT json_agg(
                json_build_object(
                    'id', pel.id,
                    'platform', pel.platform,
                    'url', pel.url,
                    'label', pel.label
                ) ORDER BY pel.sort_order
            )
            FROM product_external_links pel
            WHERE pel.product_id = p.id
            AND pel.is_active = TRUE
            AND (pel.locale IS NULL OR pel.locale = p_locale)
        ),
        'alternate_slugs', (
            SELECT json_object_agg(
                alt.locale,
                alt.slug
            )
            FROM product_translations alt
            WHERE alt.product_id = p.id
        )
    ) INTO result
    FROM products p
    INNER JOIN product_translations pt ON pt.product_id = p.id AND pt.locale = p_locale
    WHERE pt.slug = p_slug
    AND p.is_active = TRUE;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get blog post by slug with full details
CREATE OR REPLACE FUNCTION get_blog_post_by_slug(p_locale VARCHAR(5), p_slug VARCHAR(200))
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', bp.id,
        'published_at', bp.published_at,
        'is_featured', bp.is_featured,
        'reading_time', bp.reading_time,
        'translation', json_build_object(
            'title', bt.title,
            'slug', bt.slug,
            'excerpt', bt.excerpt,
            'content', bt.content,
            'seo_title', bt.seo_title,
            'seo_description', bt.seo_description,
            'seo_keywords', bt.seo_keywords,
            'og_image_url', bt.og_image_url
        ),
        'media', (
            SELECT json_agg(
                json_build_object(
                    'id', bm.id,
                    'url', bm.url,
                    'alt_text', bm.alt_text,
                    'type', bm.type,
                    'is_featured', bm.is_featured,
                    'caption', bm.caption
                ) ORDER BY bm.is_featured DESC, bm.sort_order ASC
            )
            FROM blog_media bm
            WHERE bm.blog_post_id = bp.id
        ),
        'alternate_slugs', (
            SELECT json_object_agg(
                alt.locale,
                alt.slug
            )
            FROM blog_translations alt
            WHERE alt.blog_post_id = bp.id
        )
    ) INTO result
    FROM blog_posts bp
    INNER JOIN blog_translations bt ON bt.blog_post_id = bp.id AND bt.locale = p_locale
    WHERE bt.slug = p_slug
    AND bp.status = 'published'
    AND bp.published_at <= NOW();
    
    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
