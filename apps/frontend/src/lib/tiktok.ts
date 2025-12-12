import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TikTokVideo {
    id: string;
    url: string;
    order: number;
    is_enabled: boolean;
}

/**
 * Fetches enabled TikTok videos ordered by their order field
 */
export async function getEnabledTikTokVideos(): Promise<TikTokVideo[]> {
    const { data, error } = await supabase
        .from('tiktok_videos')
        .select('id, url, order, is_enabled')
        .eq('is_enabled', true)
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching TikTok videos:', error);
        return [];
    }

    return data || [];
}
