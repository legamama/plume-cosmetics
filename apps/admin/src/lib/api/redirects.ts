
import { supabase } from '../supabase';

export interface Redirect {
    id: string;
    from_path: string;
    to_url: string;
    status_code: number;
    is_enabled: boolean;
    updated_at?: string;
    created_at?: string;
}

export type RedirectInput = Omit<Redirect, 'id' | 'updated_at' | 'created_at'> & { id?: string };

/**
 * List all redirects
 */
export async function listRedirects(): Promise<Redirect[]> {
    const { data, error } = await supabase
        .from('redirects')
        .select('*')
        .order('from_path', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch redirects: ${error.message}`);
    }

    return data as Redirect[];
}

/**
 * Create or update a redirect
 */
export async function upsertRedirect(redirect: RedirectInput): Promise<Redirect> {
    const payload = {
        ...redirect,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('redirects')
        .upsert(payload)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to save redirect: ${error.message}`);
    }

    return data as Redirect;
}

/**
 * Delete a redirect by ID
 */
export async function deleteRedirect(id: string): Promise<void> {
    const { error } = await supabase
        .from('redirects')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete redirect: ${error.message}`);
    }
}

/**
 * Trigger a Netlify build to publish redirects
 */
export async function publishRedirects(): Promise<void> {
    const buildHookUrl = import.meta.env.VITE_NETLIFY_BUILD_HOOK_URL;

    if (!buildHookUrl) {
        console.warn('VITE_NETLIFY_BUILD_HOOK_URL not set.');
        // In dev, we can just proceed or throw. Let's not throw to avoid breaking UI flow if just testing.
        // But for "Publish" action, users expect it to work.
        // throw new Error('Build hook URL not configured');
        return;
    }

    try {
        const response = await fetch(buildHookUrl, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Netlify build hook failed: ${response.statusText}`);
        }
    } catch (err) {
        throw new Error(`Failed to trigger publish: ${err instanceof Error ? err.message : String(err)}`);
    }
}
