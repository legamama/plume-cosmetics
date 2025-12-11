/**
 * Supabase Client Configuration
 * 
 * This module provides configured Supabase clients for:
 * - Public/anonymous access (for frontend)
 * - Admin/service role access (for server-side operations)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables (must be set in .env)
const getEnv = (key: string) => {
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[key] || (import.meta as any).env[`VITE_${key}`];
    }
    return undefined;
};

const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL environment variable');
}

if (!SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

/**
 * Public Supabase client for frontend/anonymous access
 * Uses the anon key - subject to RLS policies
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
    },
});

/**
 * Admin Supabase client for server-side operations
 * Uses the service role key - bypasses RLS
 * 
 * ⚠️ NEVER expose this client to the frontend
 */
export const supabaseAdmin: SupabaseClient | null = SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

/**
 * Get the admin client or throw if not available
 * For use in server-side code that requires admin access
 */
export function getAdminClient(): SupabaseClient {
    if (!supabaseAdmin) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured - admin operations unavailable');
    }
    return supabaseAdmin;
}

/**
 * Create a Supabase client with a specific user's JWT
 * For use in API routes where you have the user's session
 */
export function createUserClient(accessToken: string): SupabaseClient {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase environment variables not configured');
    }

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
}

export default supabase;
