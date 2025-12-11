// Hook for managing page sections

import { useState, useEffect, useCallback } from 'react';
import type { Locale, PageSection, PageWithSections, SectionType, SectionConfig } from '../types';
import {
    fetchPageWithSections,
    createSection,
    updateSection,
    deleteSection,
    toggleSectionEnabled,
    reorderSections,
} from '../lib/api/pages';

interface UsePageSectionsOptions {
    pageId: string;
    locale: Locale;
}

export function usePageSections({ pageId, locale }: UsePageSectionsOptions) {
    const [page, setPage] = useState<PageWithSections | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPage = useCallback(async () => {
        if (!pageId) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchPageWithSections(pageId, locale);
            setPage(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load page');
        } finally {
            setIsLoading(false);
        }
    }, [pageId, locale]);

    useEffect(() => {
        loadPage();
    }, [loadPage]);

    const addSection = useCallback(async (sectionType: SectionType) => {
        const position = page?.sections.length ?? 0;
        try {
            const newSection = await createSection(pageId, locale, sectionType, position);
            setPage(prev => prev ? {
                ...prev,
                sections: [...prev.sections, newSection],
            } : null);
            return newSection;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add section');
            throw err;
        }
    }, [pageId, locale, page?.sections.length]);

    const updateSectionConfig = useCallback(async (id: string, config: SectionConfig) => {
        try {
            const updated = await updateSection(id, { config_json: config });
            setPage(prev => prev ? {
                ...prev,
                sections: prev.sections.map(s => s.id === id ? updated : s),
            } : null);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update section');
            throw err;
        }
    }, []);

    const toggleEnabled = useCallback(async (id: string) => {
        try {
            const updated = await toggleSectionEnabled(id);
            setPage(prev => prev ? {
                ...prev,
                sections: prev.sections.map(s => s.id === id ? updated : s),
            } : null);
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle section');
            throw err;
        }
    }, []);

    const removeSection = useCallback(async (id: string) => {
        try {
            await deleteSection(id);
            setPage(prev => prev ? {
                ...prev,
                sections: prev.sections.filter(s => s.id !== id),
            } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete section');
            throw err;
        }
    }, []);

    const reorder = useCallback(async (orderedIds: string[]) => {
        try {
            await reorderSections(pageId, locale, orderedIds);
            setPage(prev => {
                if (!prev) return null;
                const sectionMap = new Map(prev.sections.map(s => [s.id, s]));
                const reorderedSections = orderedIds
                    .map(id => sectionMap.get(id))
                    .filter((s): s is PageSection => !!s)
                    .map((s, index) => ({ ...s, position: index }));
                return { ...prev, sections: reorderedSections };
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reorder sections');
            throw err;
        }
    }, [pageId, locale]);

    return {
        page,
        sections: page?.sections ?? [],
        isLoading,
        error,
        refetch: loadPage,
        addSection,
        updateSectionConfig,
        toggleEnabled,
        removeSection,
        reorder,
    };
}
