// Blog type definitions

import type { Locale, Status, MediaItem, SEOFields } from './common';

export interface BlogPost {
    id: string;
    status: Status;
    featured_image_url?: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface BlogTranslation {
    id: string;
    blog_post_id: string;
    locale: Locale;
    title: string;
    excerpt: string;
    body: string; // TipTap HTML content
    seo: SEOFields;
}

export interface BlogMedia extends MediaItem {
    blog_post_id: string;
}

export interface BlogPostWithDetails extends BlogPost {
    translations: BlogTranslation[];
    media: BlogMedia[];
}

// Form data type for creating/updating blog posts
export interface BlogFormData {
    status: Status;
    featured_image_url: string;
    published_at: string;
    translations: {
        vi: {
            title: string;
            excerpt: string;
            body: string;
            seo: SEOFields;
        };
        en?: {
            title: string;
            excerpt: string;
            body: string;
            seo: SEOFields;
        };
        ko?: {
            title: string;
            excerpt: string;
            body: string;
            seo: SEOFields;
        };
    };
    media: Omit<BlogMedia, 'blog_post_id'>[];
}

// Default empty blog form data
export const getEmptyBlogFormData = (): BlogFormData => ({
    status: 'draft',
    featured_image_url: '',
    published_at: '',
    translations: {
        vi: {
            title: '',
            excerpt: '',
            body: '',
            seo: { meta_title: '', meta_description: '', slug: '' },
        },
    },
    media: [],
});
