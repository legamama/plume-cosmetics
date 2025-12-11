// Blog API functions
// TODO: Replace mock implementations with real Supabase queries

import type { BlogPostWithDetails, BlogFormData } from '../../types';

// Mock data for development
const mockBlogPosts: BlogPostWithDetails[] = [
    {
        id: '1',
        status: 'published',
        featured_image_url: 'https://plume.b-cdn.net/blog/skincare-routine.jpg',
        published_at: '2024-01-10T08:00:00Z',
        created_at: '2024-01-08T10:00:00Z',
        updated_at: '2024-01-10T08:00:00Z',
        translations: [
            {
                id: '1-vi',
                blog_post_id: '1',
                locale: 'vi',
                title: 'Hướng Dẫn Chăm Sóc Da Mùa Đông',
                excerpt: 'Những bí quyết giữ da ẩm mịn trong mùa đông lạnh giá',
                body: '<h2>Giữ da ẩm mịn mùa đông</h2><p>Mùa đông đến kèm theo không khí khô hanh khiến da dễ bị khô, bong tróc...</p>',
                seo: {
                    meta_title: 'Chăm Sóc Da Mùa Đông | Plumé Blog',
                    meta_description: 'Hướng dẫn chăm sóc da mùa đông từ chuyên gia Plumé',
                    slug: 'cham-soc-da-mua-dong',
                },
            },
            {
                id: '1-en',
                blog_post_id: '1',
                locale: 'en',
                title: 'Winter Skincare Guide',
                excerpt: 'Tips to keep your skin moisturized during cold winter months',
                body: '<h2>Keep your skin moisturized in winter</h2><p>Winter brings dry air that can cause skin to become dry and flaky...</p>',
                seo: {
                    meta_title: 'Winter Skincare Guide | Plumé Blog',
                    meta_description: 'Expert winter skincare tips from Plumé',
                    slug: 'winter-skincare-guide',
                },
            },
        ],
        media: [],
    },
    {
        id: '2',
        status: 'draft',
        featured_image_url: '',
        published_at: undefined,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        translations: [
            {
                id: '2-vi',
                blog_post_id: '2',
                locale: 'vi',
                title: 'Top 5 Thành Phần Dưỡng Da Phải Biết',
                excerpt: 'Khám phá các thành phần làm đẹp hiệu quả nhất cho làn da',
                body: '<p>Nội dung đang được hoàn thiện...</p>',
                seo: {
                    meta_title: 'Thành Phần Dưỡng Da | Plumé',
                    meta_description: 'Top 5 thành phần dưỡng da hiệu quả nhất',
                    slug: 'top-5-thanh-phan-duong-da',
                },
            },
        ],
        media: [],
    },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all blog posts with their details
 */
export async function fetchBlogPosts(): Promise<BlogPostWithDetails[]> {
    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from('blog_posts')
    //   .select(`
    //     *,
    //     translations:blog_translations(*),
    //     media:blog_media(*)
    //   `)
    //   .order('created_at', { ascending: false });

    await delay(300);
    return [...mockBlogPosts];
}

/**
 * Fetch a single blog post by ID
 */
export async function fetchBlogPostById(id: string): Promise<BlogPostWithDetails | null> {
    // TODO: Replace with Supabase query
    await delay(200);
    return mockBlogPosts.find(p => p.id === id) || null;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: BlogFormData): Promise<BlogPostWithDetails> {
    // TODO: Replace with Supabase transaction
    // 1. Insert blog_post
    // 2. Insert translations
    // 3. Insert media items

    await delay(500);

    const newPost: BlogPostWithDetails = {
        id: crypto.randomUUID(),
        status: data.status,
        featured_image_url: data.featured_image_url || undefined,
        published_at: data.status === 'published' ? (data.published_at || new Date().toISOString()) : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        translations: Object.entries(data.translations).map(([locale, trans]) => ({
            id: crypto.randomUUID(),
            blog_post_id: '',
            locale: locale as 'vi' | 'en' | 'ko',
            ...trans!,
        })).filter(t => t.title),
        media: data.media.map(m => ({ ...m, blog_post_id: '' })),
    };

    mockBlogPosts.unshift(newPost);
    return newPost;
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, data: BlogFormData): Promise<BlogPostWithDetails> {
    // TODO: Replace with Supabase transaction
    await delay(500);

    const index = mockBlogPosts.findIndex(p => p.id === id);
    if (index === -1) {
        throw new Error('Blog post not found');
    }

    const updated: BlogPostWithDetails = {
        ...mockBlogPosts[index],
        status: data.status,
        featured_image_url: data.featured_image_url || undefined,
        published_at: data.status === 'published' ? (data.published_at || mockBlogPosts[index].published_at || new Date().toISOString()) : undefined,
        updated_at: new Date().toISOString(),
        translations: Object.entries(data.translations).map(([locale, trans]) => ({
            id: crypto.randomUUID(),
            blog_post_id: id,
            locale: locale as 'vi' | 'en' | 'ko',
            ...trans!,
        })).filter(t => t.title),
        media: data.media.map(m => ({ ...m, blog_post_id: id })),
    };

    mockBlogPosts[index] = updated;
    return updated;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<void> {
    // TODO: Replace with Supabase delete
    await delay(300);

    const index = mockBlogPosts.findIndex(p => p.id === id);
    if (index !== -1) {
        mockBlogPosts.splice(index, 1);
    }
}
