import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a placeholder client for build-time, real client for runtime
let supabaseClient: SupabaseClient | null = null;

export const supabase = (() => {
    // During build, return a dummy that won't be used
    if (!supabaseUrl || !supabaseAnonKey) {
        if (typeof window !== 'undefined') {
            console.warn('Missing Supabase environment variables');
        }
        // Return a minimal mock for build-time
        return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
})();
