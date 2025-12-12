import { supabase } from './supabase';
import { Product, ProductCategory, LocalizedContent, ProductTag, BuyLink } from '@/types/product';
import type { Locale } from '@/i18n/config';

// Define Supabase return types manually for now since we don't have auto-generated types
interface DBExternalLink {
    id: string;
    platform: string;
    url: string;
    label: string | null;
    locale: string | null;
    is_active: boolean;
    sort_order: number;
    icon?: string;
    color?: string;
    hover_color?: string;
}

interface DBProduct {
    id: string;
    sku: string;
    base_price: number;
    status: string;
    tags: ProductTag[];
    created_at: string;
    updated_at: string;
    category?: {
        name_vi: string;
        name_en: string;
        name_ko: string;
        slug: string;
    } | null;
    translations: {
        locale: string;
        name: string;
        short_description: string;
        long_description: string;
        price?: number;
        slug?: string;
        benefits?: string;
        ingredients?: string;
        how_to_use?: string;
    }[];
    media: {
        url: string;
        alt_text_vi: string;
        alt_text_en: string;
        alt_text_ko: string;
        sort_order: number;
    }[];
    external_links?: DBExternalLink[];
}

export async function getProducts(locale: Locale): Promise<Product[]> {
    console.log('Fetching products for locale:', locale);
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories (
                name_vi,
                name_en,
                name_ko,
                slug
            ),
            translations:product_translations (
                locale,
                name,
                short_description,
                long_description,
                price,
                slug
            ),
            media:product_media (
                url,
                alt_text_vi,
                alt_text_en,
                alt_text_ko,
                sort_order
            )
        `)
        .eq('status', 'published')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }); // Secondary sort

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    console.log('Fetched products raw:', products?.length, products);

    if (!products) return [];

    return (products as unknown as DBProduct[]).map((p) => transformProduct(p));
}

// Helper function to validate UUID format
function isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}

export async function getProductBySlug(slugOrId: string): Promise<Product | null> {
    console.log('Fetching product by slug or ID:', slugOrId);

    let productId: string | null = null;

    // First, try to find by slug in translations
    const { data: translation, error: translationError } = await supabase
        .from('product_translations')
        .select('product_id')
        .eq('slug', slugOrId)
        .limit(1)
        .maybeSingle();

    if (translationError) {
        console.error('Error looking up slug in translations:', translationError.message || translationError);
    }

    if (translation?.product_id) {
        productId = translation.product_id;
        console.log('Found product_id from slug lookup:', productId);
    } else if (isValidUUID(slugOrId)) {
        // Only try using slugOrId as product ID if it's a valid UUID
        productId = slugOrId;
        console.log('Slug not found, trying as product ID (valid UUID):', slugOrId);
    } else {
        // Not a valid UUID and no translation found - product doesn't exist
        console.log('Slug not found in translations and not a valid UUID:', slugOrId);
        return null;
    }

    console.log('Looking up product with ID:', productId);

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories (
                name_vi,
                name_en,
                name_ko,
                slug
            ),
            translations:product_translations (
                locale,
                name,
                short_description,
                long_description,
                price,
                slug
            ),
            media:product_media (
                url,
                alt_text_vi,
                alt_text_en,
                alt_text_ko,
                sort_order
            ),
            external_links:product_external_links (
                id,
                platform,
                url,
                label,
                locale,
                is_active,
                sort_order,
                icon,
                color,
                hover_color
            )
        `)
        .eq('id', productId)
        // Temporarily remove status filter for debugging
        // .eq('status', 'published')
        .maybeSingle();

    if (error) {
        console.error('Error fetching product:', error.message || JSON.stringify(error) || error);
        return null;
    }

    if (!product) {
        console.log('Product not found for ID:', productId);
        return null;
    }

    console.log('Found product:', product.id);
    const dbProduct = product as unknown as DBProduct;
    return transformProduct(dbProduct, slugOrId);
}

export async function getProductSlugs(): Promise<string[]> {
    // Get all published products with their translations
    const { data, error } = await supabase
        .from('products')
        .select('id, translations:product_translations(slug)')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching product slugs:', error);
        return [];
    }

    // Get slug from translation, or fall back to product ID
    const slugsOrIds = data?.map(product => {
        const slug = product.translations?.find((t: { slug?: string }) => t.slug)?.slug;
        return slug || product.id;
    }).filter(Boolean) || [];

    return [...new Set(slugsOrIds)] as string[];
}

function transformProduct(p: DBProduct, slugOverride?: string): Product {
    const media = (p.media || []).sort((a, b) => a.sort_order - b.sort_order);
    const images = media.map((m) => m.url);
    const primaryImage = images[0] || '';
    const secondaryImage = images[1] || primaryImage; // Fallback to primary if no second image

    // Always use product ID as the slug for reliable routing
    // The slugOverride is passed from getProductBySlug for context preservation
    const productSlug = p.id;

    // Transform external links to buy links
    const buyLinks = transformExternalLinks(p.external_links || []);

    // Parse benefits from translations (stored as comma-separated or JSON string)
    const parseBenefits = (benefitsStr: string | undefined): string[] => {
        if (!benefitsStr) return [];
        try {
            // Try parsing as JSON array first
            const parsed = JSON.parse(benefitsStr);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Fallback to splitting by comma or newline
            return benefitsStr.split(/[,\n]/).map(b => b.trim()).filter(Boolean);
        }
        return [];
    };

    return {
        id: p.id,
        slug: productSlug,
        name: reduceTranslations(p.translations, 'name'),
        description: reduceTranslations(p.translations, 'long_description'),
        shortDescription: reduceTranslations(p.translations, 'short_description'),
        price: {
            vi: getPrice(p, 'vi'),
            en: getPrice(p, 'en'),
            ko: getPrice(p, 'ko'),
        },
        currency: 'VND', // Base currency
        images: images,
        thumbnail: primaryImage,
        primaryImage,
        secondaryImage,
        category: (p.category?.slug || 'serum') as ProductCategory,
        benefits: {
            vi: parseBenefits(p.translations?.find(t => t.locale === 'vi')?.benefits),
            en: parseBenefits(p.translations?.find(t => t.locale === 'en')?.benefits),
            ko: parseBenefits(p.translations?.find(t => t.locale === 'ko')?.benefits),
        },
        ingredients: reduceTranslations(p.translations, 'ingredients'),
        howToUse: reduceTranslations(p.translations, 'how_to_use'),
        buyLinks,
        rating: 5,
        reviewCount: 0,
        isNew: p.tags?.some((t) => t.label === 'New Product' || t.label === 'New') ?? false,
        isBestSeller: p.tags?.some((t) => t.label === 'Best Seller') ?? false,
        tags: p.tags || [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    };
}

function transformExternalLinks(links: DBExternalLink[]): BuyLink[] {
    // Filter active links and sort by sort_order
    const activeLinks = links.filter(l => l.is_active).sort((a, b) => a.sort_order - b.sort_order);

    // Group by platform to get unique platforms
    const platformMap = new Map<string, DBExternalLink[]>();
    activeLinks.forEach(link => {
        const existing = platformMap.get(link.platform) || [];
        existing.push(link);
        platformMap.set(link.platform, existing);
    });

    // Transform to BuyLink format
    const buyLinks: BuyLink[] = [];
    platformMap.forEach((links, platform) => {
        // Get the primary link (first one or non-locale-specific one)
        const primaryLink = links.find(l => !l.locale) || links[0];

        // Build localized labels
        const getLabel = (locale: string): string => {
            const localeLink = links.find(l => l.locale === locale);
            if (localeLink?.label) return localeLink.label;
            if (primaryLink.label) return primaryLink.label;
            // Default labels by platform
            const defaultLabels: Record<string, Record<string, string>> = {
                tiktok: { vi: 'Mua trên TikTok', en: 'Buy on TikTok', ko: 'TikTok에서 구매' },
                shopee: { vi: 'Mua trên Shopee', en: 'Buy on Shopee', ko: 'Shopee에서 구매' },
                lazada: { vi: 'Mua trên Lazada', en: 'Buy on Lazada', ko: 'Lazada에서 구매' },
                tiki: { vi: 'Mua trên Tiki', en: 'Buy on Tiki', ko: 'Tiki에서 구매' },
                sendo: { vi: 'Mua trên Sendo', en: 'Buy on Sendo', ko: 'Sendo에서 구매' },
            };
            return defaultLabels[platform.toLowerCase()]?.[locale] || `Mua trên ${platform}`;
        };

        buyLinks.push({
            platform,
            url: primaryLink.url,
            label: {
                vi: getLabel('vi'),
                en: getLabel('en'),
                ko: getLabel('ko'),
            },
            icon: primaryLink.icon,
            color: primaryLink.color,
            hoverColor: primaryLink.hover_color,
        });
    });

    return buyLinks;
}

function getPrice(p: DBProduct, locale: string): number {
    const localePrice = p.translations?.find((t) => t.locale === locale)?.price;
    // Check if localePrice is a valid number (it might be null/undefined in DB or JSON)
    // If it exists and > 0 (assuming 0 is not valid price override, or maybe it is? Let's assume override exists if value is present)
    // Type definition says `price?: number`.
    if (localePrice !== undefined && localePrice !== null) {
        return Number(localePrice);
    }
    return p.base_price;
}

function reduceTranslations(translations: { locale: string;[key: string]: any }[], field: string): LocalizedContent {
    const getContent = (locale: string) =>
        translations?.find((t) => t.locale === locale)?.[field] || '';

    return {
        vi: getContent('vi'),
        en: getContent('en'),
        ko: getContent('ko'),
    };
}

interface StaticPageData {
    slots: Record<string, string>;
    seo_title?: string;
    seo_description?: string;
    seo_og_image_url?: string;
}

export async function getStaticSlots(slug: string, locale: string): Promise<Record<string, string>> {
    const { data: page } = await supabase
        .from('static_pages')
        .select('id')
        .eq('slug', slug)
        .single();

    if (!page) return {};

    const { data: slotsData } = await supabase
        .from('static_page_slots')
        .select('slot_key, content_value')
        .eq('page_id', page.id)
        .eq('locale', locale);

    const slots: Record<string, string> = {};
    if (slotsData) {
        slotsData.forEach((row: { slot_key: string, content_value: string | null }) => {
            if (row.content_value) {
                slots[row.slot_key] = row.content_value;
            }
        });
    }
    return slots;
}

export async function getStaticPageContent(slug: string, locale: string): Promise<StaticPageData | null> {
    console.log(`Fetching static content for ${slug} (${locale})`);

    // First get the page ID
    const { data: page, error: pageError } = await supabase
        .from('static_pages')
        .select('id')
        .eq('slug', slug)
        .single();

    if (pageError || !page) {
        console.warn(`Static page not found: ${slug}`, pageError);
        return null;
    }

    // Get SEO translation
    const { data: translation } = await supabase
        .from('static_page_translations')
        .select('seo_title, seo_description, seo_og_image_url')
        .eq('page_id', page.id)
        .eq('locale', locale)
        .maybeSingle();

    // Get Slots
    const { data: slotsData } = await supabase
        .from('static_page_slots')
        .select('slot_key, content_value')
        .eq('page_id', page.id)
        .eq('locale', locale);

    const slots: Record<string, string> = {};
    if (slotsData) {
        slotsData.forEach((row: { slot_key: string, content_value: string | null }) => {
            if (row.content_value) {
                slots[row.slot_key] = row.content_value;
            }
        });
    }

    return {
        slots,
        seo_title: translation?.seo_title || undefined,
        seo_description: translation?.seo_description || undefined,
        seo_og_image_url: translation?.seo_og_image_url || undefined
    };
}
