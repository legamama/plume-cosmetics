// Categories API functions
// TODO: Replace mock implementations with real Supabase queries


import { supabase } from '../supabase';
import type { Category } from '../../types';

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message);
    }

    return data || [];
}

/**
 * Fetch a single category by ID
 */
export async function fetchCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching category:', error);
        throw new Error(error.message);
    }

    return data;
}
