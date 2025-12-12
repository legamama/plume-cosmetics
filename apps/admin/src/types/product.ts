// Product type definitions

import type { Locale, Status, MediaItem, ExternalLink, SEOFields, Category } from './common';

export interface ProductTag {
    id: string;
    label: string;
    color?: string; // Hex color for custom tags
    type: 'system' | 'custom';
}

export interface Product {
    id: string;
    sku: string;
    category_id: string | null;
    base_price: number;
    status: Status;
    tags: ProductTag[];
    created_at: string;
    updated_at: string;
}

export interface ProductTranslation {
    id: string;
    product_id: string;
    locale: Locale;
    name: string;
    short_description: string;
    long_description: string; // TipTap HTML content
    seo: SEOFields;
    price?: number;
}

export interface ProductMedia extends MediaItem {
    product_id: string;
}

export interface ProductExternalLink extends ExternalLink {
    product_id: string;
}

export interface ProductWithDetails extends Product {
    translations: ProductTranslation[];
    media: ProductMedia[];
    external_links: ProductExternalLink[];
    category?: Category;
}

// Form data type for creating/updating products
export interface ProductFormData {
    sku: string;
    category_id: string | null;
    base_price: number;
    status: Status;
    tags: ProductTag[];
    translations: {
        vi: {
            name: string;
            short_description: string;
            long_description: string;
            seo: SEOFields;
            price?: number;
        };
        en?: {
            name: string;
            short_description: string;
            long_description: string;
            seo: SEOFields;
            price?: number;
        };
        ko?: {
            name: string;
            short_description: string;
            long_description: string;
            seo: SEOFields;
            price?: number;
        };
    };
    media: Omit<ProductMedia, 'product_id'>[];
    external_links: Omit<ProductExternalLink, 'product_id'>[];
}

// Default empty product form data
export const getEmptyProductFormData = (): ProductFormData => ({
    sku: '',
    category_id: null,
    base_price: 0,
    status: 'draft',
    tags: [],
    translations: {
        vi: {
            name: '',
            short_description: '',
            long_description: '',
            seo: { meta_title: '', meta_description: '', slug: '' },
        },
    },
    media: [],
    external_links: [],
});

// Product Feedback types
export interface ProductFeedback {
    id: string;
    product_id: string;
    image_url?: string;
    author_name?: string;
    author_context?: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductFeedbackTranslation {
    id: string;
    feedback_id: string;
    locale: Locale;
    title?: string;
    body: string;
    context?: string;
}

export interface ProductFeedbackWithTranslations extends ProductFeedback {
    translations: ProductFeedbackTranslation[];
}

export interface FeedbackFormData {
    id?: string;
    image_url?: string;
    author_name?: string;
    author_context?: string;
    sort_order: number;
    is_active: boolean;
    translations: {
        vi: { title?: string; body: string; context?: string };
        en?: { title?: string; body: string; context?: string };
        ko?: { title?: string; body: string; context?: string };
    };
}

export const getEmptyFeedbackFormData = (): FeedbackFormData => ({
    image_url: '',
    author_name: '',
    author_context: '',
    sort_order: 0,
    is_active: true,
    translations: {
        vi: { title: '', body: '', context: '' },
    },
});
