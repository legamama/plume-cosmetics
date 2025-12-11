// Blog posts hook for CRUD operations

import { useState, useEffect, useCallback } from 'react';
import type { BlogPostWithDetails, BlogFormData } from '../types';
import {
    fetchBlogPosts,
    fetchBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
} from '../lib/api/blog';

interface UseBlogPostsReturn {
    posts: BlogPostWithDetails[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBlogPosts(): UseBlogPostsReturn {
    const [posts, setPosts] = useState<BlogPostWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchBlogPosts();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { posts, isLoading, error, refetch };
}

interface UseBlogPostReturn {
    post: BlogPostWithDetails | null;
    isLoading: boolean;
    error: string | null;
    save: (data: BlogFormData) => Promise<BlogPostWithDetails>;
    remove: () => Promise<void>;
}

export function useBlogPost(id?: string): UseBlogPostReturn {
    const [post, setPost] = useState<BlogPostWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setPost(null);
            setIsLoading(false);
            return;
        }

        const loadPost = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchBlogPostById(id);
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [id]);

    const save = useCallback(async (data: BlogFormData): Promise<BlogPostWithDetails> => {
        if (id) {
            const updated = await updateBlogPost(id, data);
            setPost(updated);
            return updated;
        } else {
            return await createBlogPost(data);
        }
    }, [id]);

    const remove = useCallback(async () => {
        if (!id) throw new Error('Cannot delete blog post without ID');
        await deleteBlogPost(id);
        setPost(null);
    }, [id]);

    return { post, isLoading, error, save, remove };
}
