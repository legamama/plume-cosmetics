import { useState, useEffect, useCallback } from 'react';
import type { PageDefinition } from '../types';
import { fetchPages, togglePagePublished, upsertPage } from '../lib/api/pages';

export function usePages() {
    const [pages, setPages] = useState<PageDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPages = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchPages();
            setPages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load pages');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPages();
    }, [loadPages]);

    const togglePublished = useCallback(async (id: string) => {
        try {
            const updated = await togglePagePublished(id);
            setPages(prev => prev.map(p => p.id === id ? updated : p));
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle publish status');
            throw err;
        }
    }, []);

    const addPage = useCallback(async (data: { title: string; slug: string }) => {
        try {
            // Create a new page definition (initially for 'vi', upsertPage handles default)
            const newPage = {
                id: '', // Empty ID for new page
                slug: data.slug,
                name_vi: data.title,
                is_published: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as PageDefinition;

            await upsertPage(newPage);
            // Reload to get the proper ID and grouped structure
            await loadPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create page');
            throw err;
        }
    }, [loadPages]);

    return {
        pages,
        isLoading,
        error,
        refetch: loadPages,
        togglePublished,
        addPage,
    };
}
