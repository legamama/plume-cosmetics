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
