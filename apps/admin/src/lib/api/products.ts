// Product API functions
// TODO: Replace mock implementations with real Supabase queries

import { supabase } from '../supabase';
import type { ProductWithDetails, ProductFormData } from '../../types';

/**
 * Check if a SKU already exists in the database
 * @param sku - The SKU to check
 * @param excludeProductId - Optional product ID to exclude (for updates)
 */
export async function checkSkuExists(sku: string, excludeProductId?: string): Promise<boolean> {
    let query = supabase
        .from('products')
        .select('id')
        .eq('sku', sku);

    if (excludeProductId) {
        query = query.neq('id', excludeProductId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
        console.error('Error checking SKU:', error);
        return false; // Assume it doesn't exist if we can't check
    }

    return data !== null;
}

/**
 * Fetch all products with their details
 */
export async function fetchProducts(): Promise<ProductWithDetails[]> {
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            translations:product_translations(*),
            media:product_media(*),
            external_links:product_external_links(*),
            category:categories(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw new Error(error.message);
    }

    return products as ProductWithDetails[];
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<ProductWithDetails | null> {
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            translations:product_translations(*),
            media:product_media(*),
            external_links:product_external_links(*),
            category:categories(*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching product:', error);
        throw new Error(error.message);
    }

    console.log('[fetchProductById] Loaded product:', product?.id);
    console.log('[fetchProductById] External links loaded:', product?.external_links);

    return product as ProductWithDetails;
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductFormData): Promise<ProductWithDetails> {
    // Check for duplicate SKU first
    const skuExists = await checkSkuExists(data.sku);
    if (skuExists) {
        throw new Error(`A product with SKU "${data.sku}" already exists. Please use a unique SKU.`);
    }

    // 1. Insert product
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
            sku: data.sku,
            category_id: data.category_id,
            base_price: data.base_price,
            status: data.status,
            tags: data.tags
        })
        .select()
        .single();

    if (productError) throw new Error(productError.message);

    // 2. Insert translations
    const translations = Object.entries(data.translations)
        .filter(([_, t]) => t && t.name)
        .map(([locale, t]) => ({
            product_id: product.id,
            locale,
            name: t!.name,
            short_description: t!.short_description,
            long_description: t!.long_description,
            seo: t!.seo,
            price: t!.price
        }));

    if (translations.length > 0) {
        const { error: transError } = await supabase
            .from('product_translations')
            .insert(translations);
        if (transError) throw new Error(transError.message);
    }

    // 3. Insert media
    if (data.media.length > 0) {
        const media = data.media.map(m => ({
            product_id: product.id,
            url: m.url,
            alt_text_vi: m.alt_text_vi,
            alt_text_en: m.alt_text_en,
            alt_text_ko: m.alt_text_ko,
            sort_order: m.sort_order,
            is_carousel: m.is_carousel || false
        }));
        const { error: mediaError } = await supabase.from('product_media').insert(media);
        if (mediaError) throw new Error(mediaError.message);
    }

    // 4. Insert external links
    if (data.external_links.length > 0) {
        const links = data.external_links.map(l => ({
            product_id: product.id,
            platform: l.platform,
            label: l.label,
            url: l.url,
            sort_order: l.sort_order || 0,
            is_active: true,
            icon: l.icon,
            color: l.color,
            hover_color: l.hover_color
        }));
        const { error: linksError } = await supabase.from('product_external_links').insert(links);
        if (linksError) throw new Error(linksError.message);
    }

    return await fetchProductById(product.id) as ProductWithDetails;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: ProductFormData): Promise<ProductWithDetails> {
    // Check for duplicate SKU first (excluding current product)
    const skuExists = await checkSkuExists(data.sku, id);
    if (skuExists) {
        throw new Error(`A product with SKU "${data.sku}" already exists. Please use a unique SKU.`);
    }

    // 1. Update product basic info
    const { error: productError } = await supabase
        .from('products')
        .update({
            sku: data.sku,
            category_id: data.category_id,
            base_price: data.base_price,
            status: data.status,
            tags: data.tags,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (productError) throw new Error(productError.message);

    // 2. Update translations (Upsert)
    const translations = Object.entries(data.translations)
        .filter(([_, t]) => t && t.name)
        .map(([locale, t]) => ({
            product_id: id,
            locale,
            name: t!.name,
            short_description: t!.short_description,
            long_description: t!.long_description,
            seo: t!.seo,
            price: t!.price
        }));

    if (translations.length > 0) {
        const { error: transError } = await supabase
            .from('product_translations')
            .upsert(translations, { onConflict: 'product_id,locale' });
        if (transError) throw new Error(transError.message);
    }

    // 3. Update Media (Strategy: Delete all related and re-insert)
    // This is simplest for list management unless we track IDs in the form.
    // The current form data interface implies 'media' is the full desired state.
    await supabase.from('product_media').delete().eq('product_id', id);
    if (data.media.length > 0) {
        const media = data.media.map(m => ({
            product_id: id,
            url: m.url,
            alt_text_vi: m.alt_text_vi,
            alt_text_en: m.alt_text_en,
            alt_text_ko: m.alt_text_ko,
            sort_order: m.sort_order,
            is_carousel: m.is_carousel || false
        }));
        await supabase.from('product_media').insert(media);
    }

    // 4. Update External Links (Strategy: Delete all and re-insert)
    console.log('[updateProduct] Deleting existing external links for product:', id);
    const { error: deleteLinksError } = await supabase.from('product_external_links').delete().eq('product_id', id);
    if (deleteLinksError) {
        console.error('[updateProduct] Error deleting external links:', deleteLinksError);
    }

    console.log('[updateProduct] External links to insert:', data.external_links);
    if (data.external_links.length > 0) {
        const links = data.external_links.map(l => ({
            product_id: id,
            platform: l.platform,
            label: l.label,
            url: l.url,
            sort_order: l.sort_order || 0,
            is_active: true,
            icon: l.icon,
            color: l.color,
            hover_color: l.hover_color
        }));
        console.log('[updateProduct] Inserting external links:', links);
        const { error: insertLinksError } = await supabase.from('product_external_links').insert(links);
        if (insertLinksError) {
            console.error('[updateProduct] Error inserting external links:', insertLinksError);
            throw new Error(insertLinksError.message);
        }
        console.log('[updateProduct] External links inserted successfully');
    }

    return await fetchProductById(id) as ProductWithDetails;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

/**
 * Update product sort order (for drag-and-drop reordering)
 */
export async function updateProductOrder(items: { id: string; sort_order: number }[]): Promise<void> {
    const updates = items.map(item => ({
        id: item.id,
        sort_order: item.sort_order,
        updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
        .from('products')
        .upsert(updates, { onConflict: 'id' });

    if (error) throw new Error(error.message);
}

