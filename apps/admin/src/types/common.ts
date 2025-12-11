// Common types used across the admin dashboard

export type Locale = 'vi' | 'en' | 'ko';
export type Status = 'draft' | 'published' | 'archived';

export const LOCALES: { value: Locale; label: string; required: boolean }[] = [
    { value: 'vi', label: 'Vietnamese', required: true },
    { value: 'en', label: 'English', required: false },
    { value: 'ko', label: 'Korean', required: false },
];

export interface MediaItem {
    id: string;
    url: string; // Bunny CDN URL
    alt_text_vi: string;
    alt_text_en?: string;
    alt_text_ko?: string;
    sort_order: number;
    is_carousel: boolean;
}

export interface ExternalLink {
    id: string;
    platform: string; // e.g., "shopee", "lazada", "tiktok"
    label: string; // Display text
    url: string;
    sort_order: number;
    // Custom styling options
    icon?: string; // Lucide icon name or emoji
    color?: string; // Background color (hex or CSS color)
    hover_color?: string; // Hover background color
}

export interface SEOFields {
    meta_title: string;
    meta_description: string;
    slug: string;
}

export interface Category {
    id: string;
    name_vi: string;
    name_en?: string;
    name_ko?: string;
    slug: string;
    parent_id?: string;
    sort_order: number;
}

export const PLATFORMS = [
    { value: 'shopee', label: 'Shopee' },
    { value: 'lazada', label: 'Lazada' },
    { value: 'tiktok', label: 'TikTok Shop' },
    { value: 'sendo', label: 'Sendo' },
    { value: 'tiki', label: 'Tiki' },
    { value: 'website', label: 'Official Website' },
    { value: 'other', label: 'Other' },
] as const;

export type Platform = typeof PLATFORMS[number]['value'];
