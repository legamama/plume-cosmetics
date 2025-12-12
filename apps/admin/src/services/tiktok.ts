import { supabase } from '@/lib/supabase';

export interface TikTokVideo {
    id: string;
    url: string;
    order: number;
    is_enabled: boolean;
    created_at: string;
}

export interface TikTokVisibilityConfig {
    mobile: boolean; // < 768px
    tablet: boolean; // 768px - 1024px
    desktop: boolean; // >= 1024px
}

export const tiktokService = {
    async getAll() {
        const { data, error } = await supabase
            .from('tiktok_videos')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data as TikTokVideo[];
    },

    async add(url: string) {
        // Get max order
        const { data: maxOrderData } = await supabase
            .from('tiktok_videos')
            .select('order')
            .order('order', { ascending: false })
            .limit(1); // single() might fail if empty

        const dbMax = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order : -1;
        const nextOrder = dbMax + 1;

        const { data, error } = await supabase
            .from('tiktok_videos')
            .insert({ url, order: nextOrder, is_enabled: true })
            .select()
            .single();

        if (error) throw error;
        return data as TikTokVideo;
    },

    async updateOrder(items: TikTokVideo[]) {
        // We only need to update the order field for these IDs
        // Supabase upsert updates rows with matching Private Key
        const updates = items.map((item, index) => ({
            id: item.id,
            url: item.url, // Including required fields for safety if strict
            order: index,
            is_enabled: item.is_enabled,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('tiktok_videos')
            .upsert(updates);

        if (error) throw error;
    },

    async toggle(id: string, isEnabled: boolean) {
        const { error } = await supabase
            .from('tiktok_videos')
            .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('tiktok_videos')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getSectionVisibility(): Promise<TikTokVisibilityConfig> {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('setting_key', 'tiktok_section_visible')
            .single();

        if (error || !data) {
            // Default to visible if no setting exists
            return { mobile: true, tablet: true, desktop: true };
        }

        const value = data.value;

        // Handle legacy boolean format
        if (typeof value === 'boolean') {
            return {
                mobile: value,
                tablet: value,
                desktop: value
            };
        }

        return value as TikTokVisibilityConfig;
    },

    async setSectionVisibility(config: TikTokVisibilityConfig): Promise<void> {
        const { error } = await supabase
            .from('site_settings')
            .upsert({
                setting_key: 'tiktok_section_visible',
                value: config,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'setting_key'
            });

        if (error) throw error;
    }
};
