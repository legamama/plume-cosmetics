/**
 * Categories API Functions
 * Public read-only functions for fetching category data
 */

import { supabase } from './supabaseClient';
import type { Locale, CategoryListItem } from './types';

/**
 * Get all categories with locale-specific names
 */
export async function getCategories(locale: Locale): Promise<CategoryListItem[]> {
    const { data, error } = await supabase
        .from('product_categories')
        .select(`
      id,
      slug,
      parent_id,
      sort_order,
      product_category_translations!inner (
        name,
        description,
        seo_title,
        seo_description
      )
    `)
        .eq('is_active', true)
        .eq('product_category_translations.locale', locale)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }

    // Transform data
    const categories: CategoryListItem[] = (data || []).map((c: any) => {
        const translation = Array.isArray(c.product_category_translations)
            ? c.product_category_translations[0]
            : c.product_category_translations;

        return {
            id: c.id,
            slug: c.slug,
            parent_id: c.parent_id,
            name: translation?.name || '',
            description: translation?.description || null,
            seo_title: translation?.seo_title || null,
            seo_description: translation?.seo_description || null,
        };
    });

    return categories;
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(locale: Locale, slug: string): Promise<CategoryListItem | null> {
    const { data, error } = await supabase
        .from('product_categories')
        .select(`
      id,
      slug,
      parent_id,
      product_category_translations!inner (
        name,
        description,
        seo_title,
        seo_description
      )
    `)
        .eq('is_active', true)
        .eq('slug', slug)
        .eq('product_category_translations.locale', locale)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        console.error('Error fetching category:', error);
        throw error;
    }

    const translation = Array.isArray(data.product_category_translations)
        ? data.product_category_translations[0]
        : data.product_category_translations;

    return {
        id: data.id,
        slug: data.slug,
        parent_id: data.parent_id,
        name: translation?.name || '',
        description: translation?.description || null,
        seo_title: translation?.seo_title || null,
        seo_description: translation?.seo_description || null,
    };
}

/**
 * Get child categories of a parent
 */
export async function getChildCategories(locale: Locale, parentId: string): Promise<CategoryListItem[]> {
    const { data, error } = await supabase
        .from('product_categories')
        .select(`
      id,
      slug,
      parent_id,
      sort_order,
      product_category_translations!inner (
        name,
        description,
        seo_title,
        seo_description
      )
    `)
        .eq('is_active', true)
        .eq('parent_id', parentId)
        .eq('product_category_translations.locale', locale)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching child categories:', error);
        throw error;
    }

    return (data || []).map((c: any) => {
        const translation = Array.isArray(c.product_category_translations)
            ? c.product_category_translations[0]
            : c.product_category_translations;

        return {
            id: c.id,
            slug: c.slug,
            parent_id: c.parent_id,
            name: translation?.name || '',
            description: translation?.description || null,
            seo_title: translation?.seo_title || null,
            seo_description: translation?.seo_description || null,
        };
    });
}

/**
 * Get root categories (no parent)
 */
export async function getRootCategories(locale: Locale): Promise<CategoryListItem[]> {
    const { data, error } = await supabase
        .from('product_categories')
        .select(`
      id,
      slug,
      parent_id,
      sort_order,
      product_category_translations!inner (
        name,
        description,
        seo_title,
        seo_description
      )
    `)
        .eq('is_active', true)
        .is('parent_id', null)
        .eq('product_category_translations.locale', locale)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching root categories:', error);
        throw error;
    }

    return (data || []).map((c: any) => {
        const translation = Array.isArray(c.product_category_translations)
            ? c.product_category_translations[0]
            : c.product_category_translations;

        return {
            id: c.id,
            slug: c.slug,
            parent_id: c.parent_id,
            name: translation?.name || '',
            description: translation?.description || null,
            seo_title: translation?.seo_title || null,
            seo_description: translation?.seo_description || null,
        };
    });
}
