// Page and Section type definitions for the visual page builder

import type { Locale } from './common';

// Page definitions - represents a page in the site (Home, About, etc.)
export interface PageDefinition {
    id: string;
    slug: string;              // "/" for home, "/about", "/products", etc.
    name_vi: string;
    name_en?: string;
    name_ko?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Section types available for pages
export type SectionType =
    | 'hero'
    | 'featured_products'
    | 'best_sellers'
    | 'categories_grid'
    | 'story'
    | 'testimonials'
    | 'faq'
    | 'blog_teaser'
    | 'cta_banner'
    | 'instagram_feed'
    | 'custom_content'
    | 'launch_offer';

// Human-readable labels for section types
export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
    hero: 'Hero Banner',
    featured_products: 'Featured Products',
    best_sellers: 'Best Sellers',
    categories_grid: 'Categories Grid',
    story: 'Brand Story',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    blog_teaser: 'Blog Teaser',
    cta_banner: 'CTA Banner',
    instagram_feed: 'Instagram Feed',
    custom_content: 'Custom Content',
    launch_offer: 'Launch Offer',
};

// Section icons for UI
export const SECTION_TYPE_ICONS: Record<SectionType, string> = {
    hero: '🎯',
    featured_products: '⭐',
    best_sellers: '🏆',
    categories_grid: '📦',
    story: '📖',
    testimonials: '💬',
    faq: '❓',
    blog_teaser: '📝',
    cta_banner: '📣',
    instagram_feed: '📸',
    custom_content: '✨',
    launch_offer: '🎁',
};

// Page section - a single section on a page for a specific locale
export interface PageSection {
    id: string;
    page_id: string;
    locale: Locale;
    section_type: SectionType;
    position: number;          // Order on page (0, 1, 2...)
    is_enabled: boolean;
    config_json: SectionConfig;
    created_at: string;
    updated_at: string;
}

// ============================================
// Section Config Types
// ============================================

export interface HeroConfig {
    heading: string;           // TipTap HTML content
    subheading?: string;
    cta_button?: {
        label: string;
        url: string;
    };
    background_image_url?: string;
    background_video_url?: string;
}

export interface FeaturedProductsConfig {
    title: string;
    subtitle?: string;
    product_ids: string[];     // References to products table
    layout: 'grid' | 'carousel';
    max_items: number;
}

export interface BestSellersConfig {
    title: string;
    subtitle?: string;
    max_items: number;
}

export interface CategoriesGridConfig {
    title: string;
    subtitle?: string;
    category_ids: string[];
}

export interface StoryConfig {
    heading: string;
    subtitle?: string;         // Added for frontend compatibility
    body: string;              // TipTap HTML content
    image_url?: string;
    image_position: 'left' | 'right';
}

export interface TestimonialsConfig {
    title: string;
    items: {
        id: string;
        quote: string;
        author_name: string;
        author_title?: string;
        author_image_url?: string;
    }[];
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;            // TipTap HTML content
}

export interface FAQConfig {
    title: string;
    subtitle?: string;
    items: FAQItem[];
}

export interface BlogTeaserConfig {
    title: string;
    subtitle?: string;
    post_ids?: string[];       // Specific posts, or empty for latest
    max_items: number;
}

export interface CTABannerConfig {
    heading: string;
    subheading?: string;
    button_label: string;
    button_url: string;
    background_color?: string;
    background_image_url?: string;
}

export interface InstagramFeedConfig {
    title: string;
    username: string;
    max_items: number;
}

export interface CustomContentConfig {
    html_content: string;      // TipTap HTML for fully custom sections
}

// Union type for all section configs
export type SectionConfig =
    | HeroConfig
    | FeaturedProductsConfig
    | BestSellersConfig
    | CategoriesGridConfig
    | StoryConfig
    | TestimonialsConfig
    | FAQConfig
    | BlogTeaserConfig
    | CTABannerConfig
    | InstagramFeedConfig
    | CTABannerConfig
    | InstagramFeedConfig
    | CustomContentConfig
    | LaunchOfferConfig;

export interface LaunchOfferConfig {
    title: string;
    description: string;
    ctaLabel: string;
    ctaLink: string;
    background_color?: string;
}

// Get default config for a section type
export function getDefaultSectionConfig(type: SectionType): SectionConfig {
    switch (type) {
        case 'hero':
            return {
                heading: '',
                subheading: '',
                cta_button: { label: '', url: '' },
                background_image_url: '',
            } as HeroConfig;
        case 'featured_products':
            return {
                title: '',
                subtitle: '',
                product_ids: [],
                layout: 'grid',
                max_items: 4,
            } as FeaturedProductsConfig;
        case 'best_sellers':
            return {
                title: '',
                subtitle: '',
                max_items: 4,
            } as BestSellersConfig;
        case 'categories_grid':
            return {
                title: '',
                subtitle: '',
                category_ids: [],
            } as CategoriesGridConfig;
        case 'story':
            return {
                heading: '',
                subtitle: '',
                body: '',
                image_url: '',
                image_position: 'right',
            } as StoryConfig;
        case 'testimonials':
            return {
                title: '',
                items: [],
            } as TestimonialsConfig;
        case 'faq':
            return {
                title: '',
                subtitle: '',
                items: [],
            } as FAQConfig;
        case 'blog_teaser':
            return {
                title: '',
                subtitle: '',
                post_ids: [],
                max_items: 3,
            } as BlogTeaserConfig;
        case 'cta_banner':
            return {
                heading: '',
                subheading: '',
                button_label: '',
                button_url: '',
                background_color: '#E8A598',
            } as CTABannerConfig;
        case 'instagram_feed':
            return {
                title: '',
                username: '',
                max_items: 6,
            } as InstagramFeedConfig;
        case 'custom_content':
            return {
                html_content: '',
            } as CustomContentConfig;
        case 'launch_offer':
            return {
                title: '',
                description: '',
                ctaLabel: '',
                ctaLink: '',
            } as LaunchOfferConfig;
    }
}

// Page with its sections for a specific locale
export interface PageWithSections extends PageDefinition {
    sections: PageSection[];
}
