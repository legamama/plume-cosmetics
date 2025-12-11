/**
 * Admin Navigation API Functions
 * Server-side CRUD operations for navigation items
 */

import { getAdminClient } from '../supabaseClient';
import type {
    Locale,
    CreateNavigationItemRequest,
    NavigationItemRow,
    NavGroup,
} from '../types';

/**
 * Create a new navigation item
 */
export async function createNavigationItem(
    input: CreateNavigationItemRequest
): Promise<NavigationItemRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('navigation_items')
        .insert({
            locale: input.locale,
            nav_group: input.nav_group,
            parent_id: input.parent_id || null,
            label: input.label,
            href: input.href,
            target: input.target || '_self',
            icon: input.icon || null,
            position: input.position,
            is_enabled: input.is_enabled ?? true,
            highlight: input.highlight ?? false,
            badge_text: input.badge_text || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating navigation item:', error);
        throw error;
    }

    return data as NavigationItemRow;
}

/**
 * Update an existing navigation item
 */
export async function updateNavigationItem(
    id: string,
    input: Partial<CreateNavigationItemRequest>
): Promise<NavigationItemRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('navigation_items')
        .update(input)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating navigation item:', error);
        throw error;
    }

    return data as NavigationItemRow;
}

/**
 * Delete a navigation item (cascades to children)
 */
export async function deleteNavigationItem(id: string): Promise<void> {
    const supabase = getAdminClient();

    const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting navigation item:', error);
        throw error;
    }
}

/**
 * Reorder navigation items
 */
export async function reorderNavigationItems(
    locale: Locale,
    navGroup: NavGroup,
    itemIds: string[]
): Promise<void> {
    const supabase = getAdminClient();

    for (let i = 0; i < itemIds.length; i++) {
        const { error } = await supabase
            .from('navigation_items')
            .update({ position: i })
            .eq('id', itemIds[i]);

        if (error) {
            console.error('Error reordering navigation:', error);
            throw error;
        }
    }
}

/**
 * Get all navigation items for a locale and group (for admin)
 */
export async function getNavigationItems(
    locale: Locale,
    navGroup: NavGroup
): Promise<NavigationItemRow[]> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('locale', locale)
        .eq('nav_group', navGroup)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching navigation items:', error);
        throw error;
    }

    return data as NavigationItemRow[];
}

/**
 * Get all navigation items for a locale (all groups)
 */
export async function getAllNavigationItems(locale: Locale): Promise<NavigationItemRow[]> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('locale', locale)
        .order('nav_group', { ascending: true })
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching all navigation items:', error);
        throw error;
    }

    return data as NavigationItemRow[];
}

/**
 * Bulk update navigation items (for drag-and-drop reordering)
 */
export async function bulkUpdateNavigationItems(
    updates: Array<{ id: string; position: number; parent_id?: string | null }>
): Promise<void> {
    const supabase = getAdminClient();

    for (const update of updates) {
        const { error } = await supabase
            .from('navigation_items')
            .update({
                position: update.position,
                ...(update.parent_id !== undefined && { parent_id: update.parent_id }),
            })
            .eq('id', update.id);

        if (error) {
            console.error('Error bulk updating navigation:', error);
            throw error;
        }
    }
}
