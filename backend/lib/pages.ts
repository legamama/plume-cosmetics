/**
 * Pages API Functions
 * Public read-only functions for fetching page builder content
 */

import { supabase } from './supabaseClient';
import type { Locale, PageContent, NavigationItem, NavGroup } from './types';

/**
 * Get page content by slug
 * Uses RPC function for optimized query with sections
 */
export async function getPageContent(locale: Locale, slug: string): Promise<PageContent | null> {
    const { data, error } = await supabase
        .rpc('get_page_content', { p_locale: locale, p_slug: slug });

    if (error) {
        console.error('Error fetching page content:', error);
        throw error;
    }

    return data as PageContent | null;
}

/**
 * Get navigation items
 * Uses RPC function for optimized hierarchical query
 */
export async function getNavigation(locale: Locale, navGroup: NavGroup = 'main'): Promise<NavigationItem[]> {
    const { data, error } = await supabase
        .rpc('get_navigation', { p_locale: locale, p_nav_group: navGroup });

    if (error) {
        console.error('Error fetching navigation:', error);
        throw error;
    }

    return (data as NavigationItem[]) || [];
}

/**
 * Get all published pages for sitemap
 */
export async function getAllPages(locale: Locale): Promise<Array<{
    id: string;
    slug: string;
    page_type: string;
    title: string;
    seo_title: string | null;
}>> {
    const { data, error } = await supabase
        .rpc('get_all_pages', { p_locale: locale });

    if (error) {
        console.error('Error fetching all pages:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get page by type (e.g., 'home', 'about')
 * Useful for pages with fixed types
 */
export async function getPageByType(locale: Locale, pageType: string): Promise<PageContent | null> {
    // First, find the page definition
    const { data: pageData, error: pageError } = await supabase
        .from('page_definitions')
        .select('slug')
        .eq('locale', locale)
        .eq('page_type', pageType)
        .eq('is_published', true)
        .single();

    if (pageError) {
        if (pageError.code === 'PGRST116') {
            return null; // Not found
        }
        console.error('Error finding page by type:', pageError);
        throw pageError;
    }

    // Then fetch full content using RPC
    return getPageContent(locale, pageData.slug);
}

/**
 * Get all navigation groups for a locale
 */
export async function getAllNavigation(locale: Locale): Promise<{
    main: NavigationItem[];
    footer: NavigationItem[];
    footer_legal: NavigationItem[];
    mobile: NavigationItem[];
}> {
    const [main, footer, footer_legal, mobile] = await Promise.all([
        getNavigation(locale, 'main'),
        getNavigation(locale, 'footer'),
        getNavigation(locale, 'footer_legal'),
        getNavigation(locale, 'mobile'),
    ]);

    return { main, footer, footer_legal, mobile };
}
