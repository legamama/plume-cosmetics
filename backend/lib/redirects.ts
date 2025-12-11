
import { getAdminClient } from './supabaseClient';
import { RedirectRow } from './types';

// Re-export specific type or alias if needed
export type Redirect = RedirectRow;
export type RedirectInput = Partial<Redirect> & { from_path: string; to_url: string };

/**
 * Trigger Netlify build to publish redirects
 */
export async function publishRedirects(): Promise<void> {
    const buildHook = (typeof process !== 'undefined' && process.env.NETLIFY_BUILD_HOOK) ||
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_NETLIFY_BUILD_HOOK);

    if (!buildHook) {
        console.warn('No NETLIFY_BUILD_HOOK configured, skipping build trigger');
        return;
    }

    const res = await fetch(buildHook, { method: 'POST' });
    if (!res.ok) {
        throw new Error(`Failed to trigger build: ${res.statusText}`);
    }
}

/**
 * List all redirects (for Admin UI)
 */
export async function listRedirects(options?: { limit?: number; offset?: number }): Promise<{ data: Redirect[]; count: number }> {
    const admin = getAdminClient();
    const { limit = 50, offset = 0 } = options || {};

    const { data, error, count } = await admin
        .from('redirects')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error listing redirects:', error);
        throw error;
    }

    return {
        data: (data as Redirect[]) || [],
        count: count || 0
    };
}

/**
 * Create or update a redirect
 */
export async function upsertRedirect(redirect: Partial<Redirect> & { from_path: string; to_url: string }): Promise<Redirect> {
    const admin = getAdminClient();

    // Basic cleanup
    const cleanPath = (path: string) => path.trim();

    const payload = {
        ...redirect,
        from_path: cleanPath(redirect.from_path),
        to_url: cleanPath(redirect.to_url),
        // let Postgres handle updated_at via trigger, or set it explicitly if needed
        // But typically upsert might need specific handling if ID is present.
    };

    const { data, error } = await admin
        .from('redirects')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

    if (error) {
        console.error('Error upserting redirect:', error);
        throw error;
    }
    return data as Redirect;
}

/**
 * Delete a redirect by ID
 */
export async function deleteRedirect(id: string): Promise<void> {
    const admin = getAdminClient();
    const { error } = await admin
        .from('redirects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting redirect:', error);
        throw error;
    }
}

/**
 * Get all active redirects (for Build/Runtime)
 * Returns lightweight array for config generation
 * NOTE: Requires Service Role / Admin access as redirects are not public.
 */
export async function getActiveRedirects(): Promise<Redirect[]> {
    const admin = getAdminClient();

    const { data, error } = await admin
        .from('redirects')
        .select('*')
        .eq('is_enabled', true)
        .order('from_path');

    if (error) {
        console.error('Error fetching active redirects:', error);
        throw error;
    }
    return (data as Redirect[]) || [];
}
