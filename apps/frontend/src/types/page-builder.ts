export type SectionType =
    | 'hero'
    | 'hero_primary'
    | 'category_row'
    | 'categories_grid'
    | 'products_hero'
    | 'featured_products'
    | 'brand_story'
    | 'story'
    | 'testimonials'
    | 'faq'
    | 'faq_teaser'
    | 'cta_banner'
    | 'best_sellers'
    | 'launch_offer'
    | 'custom_content';

export interface BaseSectionConfig {
    isEnabled?: boolean;
}

export interface HeroPrimaryConfig extends BaseSectionConfig {
    title: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaLink?: string;
    image?: string;
    backgroundColor?: string;
    overlayCard?: {
        title: string;
        description: string;
    };
}

export interface CategoryItem {
    id: string;
    label: string;
    href: string;
    image?: string;
}

export interface CategoryRowConfig extends BaseSectionConfig {
    categories: CategoryItem[];
}

export interface ProductsHeroConfig extends BaseSectionConfig {
    title: string;
    description?: string;
    featuredProductId?: string;
    categoryFilter?: string; // e.g., 'best-sellers'
}

// Mapped from Admin types
export interface StoryConfig extends BaseSectionConfig {
    heading: string;
    subtitle?: string;
    body: string;
    image_url?: string;
    image_position?: 'left' | 'right';
}

export interface TestimonialsConfig extends BaseSectionConfig {
    title: string;
    items: {
        id: string;
        quote: string;
        author_name: string;
        author_title?: string;
        author_image_url?: string;
    }[];
}

export interface FAQConfig extends BaseSectionConfig {
    title: string;
    subtitle?: string;
    items: {
        id: string;
        question: string;
        answer: string;
    }[];
}

export interface CTABannerConfig extends BaseSectionConfig {
    heading: string;
    subheading?: string;
    button_label: string;
    button_url: string;
    background_color?: string;
    background_image_url?: string;
}

export interface BestSellersConfig extends BaseSectionConfig {
    title: string;
    subtitle?: string;
    max_items: number;
}

// Launch Offer might need a custom config or map to one of the above
export interface LaunchOfferConfig extends BaseSectionConfig {
    title: string;
    description: string;
    ctaLabel: string;
    ctaLink?: string;
}

export interface CustomContentConfig {
    html_content: string;
}

export interface PageSection {
    id: string;
    section_type: SectionType;
    position: number;
    config_json: HeroPrimaryConfig | CategoryRowConfig | ProductsHeroConfig | StoryConfig | TestimonialsConfig | FAQConfig | CTABannerConfig | BestSellersConfig | LaunchOfferConfig | CustomContentConfig | any;
}

export interface PageDefinition {
    id: string;
    slug: string;
    title: string;
    sections: PageSection[];
}
