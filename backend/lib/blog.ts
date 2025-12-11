/**
 * Blog API Functions
 * Public read-only functions for fetching blog data
 */

import { supabase } from './supabaseClient';
import type {
    Locale,
    BlogPostListItem,
    BlogPostDetail,
    GetBlogPostsResponse,
} from './types';

export interface GetBlogPostsParams {
    locale: Locale;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
}

/**
 * Get all published blog posts
 */
export async function getBlogPosts(params: GetBlogPostsParams): Promise<GetBlogPostsResponse> {
    const { locale, is_featured, limit = 20, offset = 0 } = params;

    let query = supabase
        .from('blog_posts')
        .select(`
      id,
      published_at,
      is_featured,
      reading_time,
      blog_translations!inner (
        title,
        slug,
        excerpt,
        seo_title,
        og_image_url
      ),
      blog_media (
        url,
        alt_text,
        is_featured
      )
    `, { count: 'exact' })
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .eq('blog_translations.locale', locale)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }

    // Transform data to match BlogPostListItem type
    const posts: BlogPostListItem[] = (data || []).map((p: any) => {
        const translation = Array.isArray(p.blog_translations)
            ? p.blog_translations[0]
            : p.blog_translations;

        const featuredImage = p.blog_media?.find((m: any) => m.is_featured) || p.blog_media?.[0];

        return {
            id: p.id,
            published_at: p.published_at,
            is_featured: p.is_featured,
            reading_time: p.reading_time,
            translation: {
                title: translation?.title || '',
                slug: translation?.slug || '',
                excerpt: translation?.excerpt || null,
                seo_title: translation?.seo_title || null,
                og_image_url: translation?.og_image_url || null,
            },
            featured_image: featuredImage ? {
                url: featuredImage.url,
                alt_text: featuredImage.alt_text,
            } : null,
        };
    });

    return {
        data: posts,
        total: count || 0,
        has_more: (count || 0) > offset + limit,
    };
}

/**
 * Get a single blog post by its locale-specific slug
 * Uses RPC function for optimized query
 */
export async function getBlogPostBySlug(locale: Locale, slug: string): Promise<BlogPostDetail | null> {
    const { data, error } = await supabase
        .rpc('get_blog_post_by_slug', { p_locale: locale, p_slug: slug });

    if (error) {
        console.error('Error fetching blog post:', error);
        throw error;
    }

    return data as BlogPostDetail | null;
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(locale: Locale, limit = 3): Promise<BlogPostListItem[]> {
    const response = await getBlogPosts({
        locale,
        is_featured: true,
        limit,
    });
    return response.data;
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(locale: Locale, limit = 5): Promise<BlogPostListItem[]> {
    const response = await getBlogPosts({
        locale,
        limit,
    });
    return response.data;
}
