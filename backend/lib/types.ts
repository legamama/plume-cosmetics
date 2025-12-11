/**
 * Plumé Backend TypeScript Types
 * Auto-generated from Supabase schema
 */

// =============================================================================
// Base Types
// =============================================================================

export type Locale = 'vi' | 'en' | 'ko';
export type Currency = 'VND' | 'AUD';
export type BlogStatus = 'draft' | 'published' | 'archived';
export type PageType = 'home' | 'about' | 'products' | 'product_detail' | 'blog' | 'blog_detail' | 'contact' | 'custom';
export type NavGroup = 'main' | 'footer' | 'footer_legal' | 'mobile';
export type MediaType = 'image' | 'video';
export type SectionType =
    | 'hero'
    | 'usp_grid'
    | 'best_sellers'
    | 'faq'
    | 'blog_teaser'
    | 'cta_banner'
    | 'testimonials'
    | 'tiktok_video_feed'
    | 'facebook_post_feed'
    | 'product_carousel'
    | 'rich_text'
    | 'image_gallery'
    | 'contact_form';

// =============================================================================
// Database Row Types
// =============================================================================

export interface LocaleRow {
    code: Locale;
    name: string;
    native_name: string;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
}

export interface ProductCategoryRow {
    id: string;
    slug: string;
    parent_id: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductCategoryTranslationRow {
    id: string;
    category_id: string;
    locale: Locale;
    name: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
}

export interface ProductRow {
    id: string;
    category_id: string | null;
    sku: string | null;
    is_featured: boolean;
    is_active: boolean;
    is_new: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface ProductTranslationRow {
    id: string;
    product_id: string;
    locale: Locale;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    ingredients: string | null;
    how_to_use: string | null;
    price: number | null;
    compare_price: number | null;
    currency: Currency;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    og_image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductMediaRow {
    id: string;
    product_id: string;
    url: string;
    alt_text: string | null;
    type: MediaType;
    is_primary: boolean;
    sort_order: number;
    width: number | null;
    height: number | null;
    file_size: number | null;
    created_at: string;
}

export interface ProductExternalLinkRow {
    id: string;
    product_id: string;
    platform: string;
    url: string;
    label: string | null;
    locale: Locale | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface BlogPostRow {
    id: string;
    author_id: string | null;
    status: BlogStatus;
    published_at: string | null;
    is_featured: boolean;
    reading_time: number | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface BlogTranslationRow {
    id: string;
    blog_post_id: string;
    locale: Locale;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    og_image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface BlogMediaRow {
    id: string;
    blog_post_id: string;
    url: string;
    alt_text: string | null;
    type: MediaType;
    is_featured: boolean;
    sort_order: number;
    caption: string | null;
    created_at: string;
}

export interface PageDefinitionRow {
    id: string;
    slug: string;
    route_pattern: string | null;
    locale: Locale;
    page_type: PageType;
    title: string;
    seo_title: string | null;
    seo_description: string | null;
    seo_og_image_url: string | null;
    seo_keywords: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PageSectionRow {
    id: string;
    page_id: string;
    section_type: SectionType;
    section_key: string | null;
    position: number;
    is_enabled: boolean;
    config_json: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface NavigationItemRow {
    id: string;
    locale: Locale;
    nav_group: NavGroup;
    parent_id: string | null;
    label: string;
    href: string;
    target: '_self' | '_blank';
    icon: string | null;
    position: number;
    is_enabled: boolean;
    highlight: boolean;
    badge_text: string | null;
    created_at: string;
    updated_at: string;
}

export interface RedirectRow {
    id: string;
    from_path: string;
    to_url: string;
    status_code: number;
    is_enabled: boolean;
    site: string | null;
    locale: Locale | null;
    created_at: string;
    updated_at: string;
}

export interface MediaFolderRow {
    id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

export interface MediaAssetRow {
    id: string;
    filename: string;
    mime_type: string;
    size_bytes: number | null;
    width: number | null;
    height: number | null;
    bunny_path: string;
    bunny_cdn_url: string;
    folder_id: string | null;
    alt_text: string | null;
    credits: string | null;
    uploaded_by: string | null;
    created_at: string;
    updated_at: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface SEOFields {
    title: string | null;
    description: string | null;
    og_image_url: string | null;
    keywords: string | null;
}

export interface ProductListItem {
    id: string;
    sku: string | null;
    is_featured: boolean;
    is_new: boolean;
    category: {
        id: string;
        slug: string;
        name: string;
    } | null;
    translation: {
        name: string;
        slug: string;
        short_description: string | null;
        price: number | null;
        compare_price: number | null;
        currency: Currency | null;
    };
    primary_image: {
        url: string;
        alt_text: string | null;
    } | null;
}

export interface ProductDetail {
    id: string;
    sku: string | null;
    is_featured: boolean;
    is_new: boolean;
    category: {
        id: string;
        slug: string;
        name: string;
    } | null;
    translation: {
        name: string;
        slug: string;
        short_description: string | null;
        description: string | null;
        ingredients: string | null;
        how_to_use: string | null;
        price: number | null;
        compare_price: number | null;
        currency: Currency | null;
        seo_title: string | null;
        seo_description: string | null;
        seo_keywords: string | null;
        og_image_url: string | null;
    };
    media: Array<{
        id: string;
        url: string;
        alt_text: string | null;
        type: MediaType;
        is_primary: boolean;
        sort_order: number;
    }>;
    external_links: Array<{
        id: string;
        platform: string;
        url: string;
        label: string | null;
    }>;
    alternate_slugs: Record<Locale, string | null>;
}

export interface CategoryListItem {
    id: string;
    slug: string;
    parent_id: string | null;
    name: string;
    description: string | null;
    seo_title: string | null;
    seo_description: string | null;
    product_count?: number;
}

export interface BlogPostListItem {
    id: string;
    published_at: string;
    is_featured: boolean;
    reading_time: number | null;
    translation: {
        title: string;
        slug: string;
        excerpt: string | null;
        seo_title: string | null;
        og_image_url: string | null;
    };
    featured_image: {
        url: string;
        alt_text: string | null;
    } | null;
}

export interface BlogPostDetail {
    id: string;
    published_at: string;
    is_featured: boolean;
    reading_time: number | null;
    translation: {
        title: string;
        slug: string;
        excerpt: string | null;
        content: string | null;
        seo_title: string | null;
        seo_description: string | null;
        seo_keywords: string | null;
        og_image_url: string | null;
    };
    media: Array<{
        id: string;
        url: string;
        alt_text: string | null;
        type: MediaType;
        is_featured: boolean;
        caption: string | null;
    }>;
    alternate_slugs: Record<Locale, string | null>;
}

export interface PageContent {
    page: {
        id: string;
        slug: string;
        page_type: PageType;
        title: string;
        seo: SEOFields;
        is_published: boolean;
        published_at: string | null;
    };
    sections: Array<{
        id: string;
        section_type: SectionType;
        section_key: string | null;
        position: number;
        config: Record<string, unknown>;
    }>;
    alternate_pages: Record<Locale, { slug: string; title: string } | null>;
}

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    target: string;
    icon: string | null;
    highlight: boolean;
    badge_text: string | null;
    children: NavigationItem[] | null;
}

// =============================================================================
// Section Config Types
// =============================================================================

export interface CTAButton {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
}

export interface MediaItem {
    url: string;
    alt: string;
    type?: MediaType;
}

export interface HeroConfig {
    title: string;
    subtitle?: string;
    body?: string;
    primaryCta?: CTAButton;
    secondaryCta?: CTAButton;
    media?: MediaItem[];
    backgroundOverlay?: string;
    textAlignment?: 'left' | 'center' | 'right';
}

export interface USPGridConfig {
    title?: string;
    subtitle?: string;
    items: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    columns?: number;
    style?: 'cards' | 'minimal';
}

export interface BestSellersConfig {
    title?: string;
    subtitle?: string;
    source: 'featured' | 'new' | `category:${string}` | `ids:${string}`;
    limit?: number;
    showPrice?: boolean;
    showQuickView?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
}

export interface FAQConfig {
    title?: string;
    items: Array<{
        question: string;
        answer: string;
    }>;
    expandFirst?: boolean;
    style?: 'accordion' | 'list';
}

export interface BlogTeaserConfig {
    title?: string;
    subtitle?: string;
    source: 'featured' | 'recent';
    limit?: number;
    layout?: 'grid' | 'list';
    showExcerpt?: boolean;
    showDate?: boolean;
    ctaLabel?: string;
    ctaHref?: string;
}

export interface CTABannerConfig {
    title: string;
    body?: string;
    cta?: CTAButton;
    backgroundImage?: string;
    backgroundOverlay?: number;
    textColor?: 'white' | 'black';
}

export interface TestimonialsConfig {
    title?: string;
    items: Array<{
        quote: string;
        author: string;
        role?: string;
        avatar?: string;
        rating?: number;
    }>;
    style?: 'carousel' | 'grid';
    autoplay?: boolean;
}

export interface TikTokVideoFeedConfig {
    title?: string;
    handle: string;
    showFollowButton?: boolean;
    layout?: 'carousel' | 'grid';
    autoplay?: boolean;
    muted?: boolean;
    videos: Array<{
        videoUrl: string;
        thumbnailUrl: string;
        permalink: string;
        caption?: string;
        views?: number;
        likes?: number;
    }>;
    embedType?: 'custom' | 'native';
}

export interface FacebookPostFeedConfig {
    title?: string;
    pageHandle: string;
    showLikeButton?: boolean;
    layout?: 'grid' | 'list';
    columns?: number;
    posts: Array<{
        imageUrl: string;
        permalink: string;
        caption?: string;
        timestamp?: string;
        likes?: number;
        comments?: number;
    }>;
    embedType?: 'custom' | 'native';
}

export interface RichTextConfig {
    title?: string;
    content: {
        type: 'doc';
        content: unknown[];
    };
    textAlignment?: 'left' | 'center' | 'right';
    maxWidth?: 'prose' | 'full';
}

export interface ImageGalleryConfig {
    title?: string;
    layout?: 'grid' | 'masonry';
    columns?: number;
    images: Array<{
        url: string;
        alt: string;
        caption?: string;
    }>;
    lightbox?: boolean;
}

export interface ContactFormConfig {
    title?: string;
    subtitle?: string;
    showMap?: boolean;
    mapCoordinates?: { lat: number; lng: number };
    address?: string;
    phone?: string;
    email?: string;
    socialLinks?: Array<{
        platform: string;
        url: string;
    }>;
}

export type SectionConfig =
    | HeroConfig
    | USPGridConfig
    | BestSellersConfig
    | FAQConfig
    | BlogTeaserConfig
    | CTABannerConfig
    | TestimonialsConfig
    | TikTokVideoFeedConfig
    | FacebookPostFeedConfig
    | RichTextConfig
    | ImageGalleryConfig
    | ContactFormConfig;

// =============================================================================
// Request Types (for Admin APIs)
// =============================================================================

export interface CreateProductRequest {
    category_id?: string;
    sku?: string;
    is_featured?: boolean;
    is_active?: boolean;
    is_new?: boolean;
    translations: Array<{
        locale: Locale;
        name: string;
        slug?: string;
        short_description?: string;
        description?: string;
        ingredients?: string;
        how_to_use?: string;
        price?: number;
        compare_price?: number;
        currency?: Currency;
        seo_title?: string;
        seo_description?: string;
        seo_keywords?: string;
        og_image_url?: string;
    }>;
    media?: Array<{
        url: string;
        alt_text?: string;
        type?: MediaType;
        is_primary?: boolean;
        sort_order?: number;
    }>;
    external_links?: Array<{
        platform: string;
        url: string;
        label?: string;
        locale?: Locale;
        is_active?: boolean;
    }>;
}

export interface CreateBlogPostRequest {
    status?: BlogStatus;
    published_at?: string;
    is_featured?: boolean;
    reading_time?: number;
    translations: Array<{
        locale: Locale;
        title: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        seo_title?: string;
        seo_description?: string;
        seo_keywords?: string;
        og_image_url?: string;
    }>;
    media?: Array<{
        url: string;
        alt_text?: string;
        type?: MediaType;
        is_featured?: boolean;
        caption?: string;
    }>;
}

export interface CreatePageRequest {
    slug: string;
    locale: Locale;
    page_type: PageType;
    title: string;
    route_pattern?: string;
    seo_title?: string;
    seo_description?: string;
    seo_og_image_url?: string;
    seo_keywords?: string;
    is_published?: boolean;
    sections?: Array<{
        section_type: SectionType;
        section_key?: string;
        position: number;
        is_enabled?: boolean;
        config_json: Record<string, unknown>;
    }>;
}

export interface CreateNavigationItemRequest {
    locale: Locale;
    nav_group: NavGroup;
    parent_id?: string;
    label: string;
    href: string;
    target?: '_self' | '_blank';
    icon?: string;
    position: number;
    is_enabled?: boolean;
    highlight?: boolean;
    badge_text?: string;
}

// =============================================================================
// Paginated Response Types
// =============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    has_more: boolean;
}

export type GetProductsResponse = PaginatedResponse<ProductListItem>;
export type GetBlogPostsResponse = PaginatedResponse<BlogPostListItem>;
