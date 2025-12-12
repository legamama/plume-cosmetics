import { supabase } from '../lib/supabase';

export interface StaticPage {
    id: string;
    slug: string;
    name: string;
}

export interface StaticPageContent {
    seo_title: string;
    seo_description: string;
    seo_og_image_url: string;
    slots: Record<string, string>;
}

export const staticContentService = {
    async getPages() {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as StaticPage[];
    },

    async getPage(id: string) {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as StaticPage;
    },

    async getPageContent(pageId: string, locale: string): Promise<StaticPageContent> {
        // Fetch SEO fields
        const { data: translation } = await supabase
            .from('static_page_translations')
            .select('seo_title, seo_description, seo_og_image_url')
            .eq('page_id', pageId)
            .eq('locale', locale)
            .maybeSingle();

        // Fetch Slots
        const { data: slotsData } = await supabase
            .from('static_page_slots')
            .select('slot_key, content_value')
            .eq('page_id', pageId)
            .eq('locale', locale);

        const slots: Record<string, string> = {};
        if (slotsData) {
            slotsData.forEach((s: any) => {
                slots[s.slot_key] = s.content_value || '';
            });
        }

        return {
            seo_title: translation?.seo_title || '',
            seo_description: translation?.seo_description || '',
            seo_og_image_url: translation?.seo_og_image_url || '',
            slots
        };
    },

    async savePageContent(pageId: string, locale: string, content: StaticPageContent) {
        // 1. Save SEO
        const { error: seoError } = await supabase
            .from('static_page_translations')
            .upsert({
                page_id: pageId,
                locale: locale,
                seo_title: content.seo_title,
                seo_description: content.seo_description,
                seo_og_image_url: content.seo_og_image_url
            }, { onConflict: 'page_id, locale' });

        if (seoError) throw seoError;

        // 2. Save Slots
        // We only upsert the slots that are present in the map.
        // Assuming we don't delete slots that are missing (unless we want to?)
        // The prompt implies we just update values.

        if (Object.keys(content.slots).length > 0) {
            const slotsToUpsert = Object.entries(content.slots).map(([key, value]) => ({
                page_id: pageId,
                locale: locale,
                slot_key: key,
                content_value: value
            }));

            const { error: slotsError } = await supabase
                .from('static_page_slots')
                .upsert(slotsToUpsert, { onConflict: 'page_id, locale, slot_key' });

            if (slotsError) throw slotsError;
        }
    }
};
