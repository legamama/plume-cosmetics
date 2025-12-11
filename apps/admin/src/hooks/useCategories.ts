// Categories hook

import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { fetchCategories } from '../lib/api/categories';

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch categories');
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, isLoading, error };
}
