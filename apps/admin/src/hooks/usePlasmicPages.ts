// Hook for managing Plasmic pages
import { useState, useCallback, useMemo } from 'react';
import { plasmicPagesConfig, type PlasmicPageConfig } from '../lib/plasmic-config';

export function usePlasmicPages() {
    const [pages] = useState<PlasmicPageConfig[]>(plasmicPagesConfig);
    const [isLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter pages based on search query
    const filteredPages = useMemo(() => {
        if (!searchQuery.trim()) return pages;

        const query = searchQuery.toLowerCase();
        return pages.filter(
            page =>
                page.name.toLowerCase().includes(query) ||
                page.slug.toLowerCase().includes(query) ||
                page.description?.toLowerCase().includes(query)
        );
    }, [pages, searchQuery]);

    // Get pages by status
    const publishedPages = useMemo(
        () => filteredPages.filter(p => p.isPublished),
        [filteredPages]
    );

    const draftPages = useMemo(
        () => filteredPages.filter(p => !p.isPublished),
        [filteredPages]
    );

    const search = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return {
        pages: filteredPages,
        allPages: pages,
        publishedPages,
        draftPages,
        isLoading,
        search,
        searchQuery,
    };
}
