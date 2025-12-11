/**
 * Products API Functions
 * Public read-only functions for fetching product data
 */

import { supabase } from './supabaseClient';
import type {
    Locale,
    ProductListItem,
    ProductDetail,
    GetProductsResponse,
} from './types';

export interface GetProductsParams {
    locale: Locale;
    category_slug?: string;
    is_featured?: boolean;
    is_new?: boolean;
    limit?: number;
    offset?: number;
}

/**
 * Get all products with locale-specific data
 */
export async function getProducts(params: GetProductsParams): Promise<GetProductsResponse> {
    const { locale, category_slug, is_featured, is_new, limit = 20, offset = 0 } = params;

    let query = supabase
        .from('products')
        .select(`
      id,
      sku,
      is_featured,
      is_new,
      category_id,
      product_translations!inner (
        name,
        slug,
        short_description,
        price,
        compare_price,
        currency
      ),
      product_media (
        url,
        alt_text,
        is_primary
      ),
      product_categories (
        id,
        slug,
        product_category_translations (
          name
        )
      )
    `, { count: 'exact' })
        .eq('is_active', true)
        .eq('product_translations.locale', locale)
        .order('sort_order', { ascending: true })
        .range(offset, offset + limit - 1);

    // Apply filters
    if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
    }
    if (is_new !== undefined) {
        query = query.eq('is_new', is_new);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    // Filter by category if specified
    let filteredData = data || [];
    if (category_slug && data) {
        filteredData = data.filter((p: any) =>
            p.product_categories?.slug === category_slug
        );
    }

    // Transform data to match ProductListItem type
    const products: ProductListItem[] = filteredData.map((p: any) => {
        const translation = Array.isArray(p.product_translations)
            ? p.product_translations[0]
            : p.product_translations;

        const primaryMedia = p.product_media?.find((m: any) => m.is_primary) || p.product_media?.[0];
        const categoryTranslation = p.product_categories?.product_category_translations?.find(
            (t: any) => t.locale === locale
        );

        return {
            id: p.id,
            sku: p.sku,
            is_featured: p.is_featured,
            is_new: p.is_new,
            category: p.product_categories ? {
                id: p.product_categories.id,
                slug: p.product_categories.slug,
                name: categoryTranslation?.name || '',
            } : null,
            translation: {
                name: translation?.name || '',
                slug: translation?.slug || '',
                short_description: translation?.short_description || null,
                price: translation?.price || null,
                compare_price: translation?.compare_price || null,
                currency: translation?.currency || null,
            },
            primary_image: primaryMedia ? {
                url: primaryMedia.url,
                alt_text: primaryMedia.alt_text,
            } : null,
        };
    });

    return {
        data: products,
        total: count || 0,
        has_more: (count || 0) > offset + limit,
    };
}

/**
 * Get a single product by its locale-specific slug
 * Uses RPC function for optimized query
 */
export async function getProductBySlug(locale: Locale, slug: string): Promise<ProductDetail | null> {
    const { data, error } = await supabase
        .rpc('get_product_by_slug', { p_locale: locale, p_slug: slug });

    if (error) {
        console.error('Error fetching product:', error);
        throw error;
    }

    return data as ProductDetail | null;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(locale: Locale, limit = 8): Promise<ProductListItem[]> {
    const response = await getProducts({
        locale,
        is_featured: true,
        limit,
    });
    return response.data;
}

/**
 * Get new products
 */
export async function getNewProducts(locale: Locale, limit = 8): Promise<ProductListItem[]> {
    const response = await getProducts({
        locale,
        is_new: true,
        limit,
    });
    return response.data;
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(
    locale: Locale,
    categorySlug: string,
    options?: { limit?: number; offset?: number }
): Promise<GetProductsResponse> {
    return getProducts({
        locale,
        category_slug: categorySlug,
        ...options,
    });
}
