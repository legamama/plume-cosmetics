// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase URL or Anon Key is missing. Running in mock mode. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Verify connection on init
supabase.from('page_definitions').select('count', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('❌ Supabase Connection Failed:', error.message);
        } else {
            console.log('✅ Supabase Connected. Page count:', count);
        }
    });

// Helper to check if we're in mock mode
export const isMockMode = !supabaseUrl || !supabaseAnonKey;
