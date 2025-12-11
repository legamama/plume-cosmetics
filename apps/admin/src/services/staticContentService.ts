import { supabase } from '../lib/supabase';

export interface StaticPage {
    id: string;
    slug: string;
    name: string;
}

export interface StaticPageTranslation {
    id?: string;
    page_id: string;
    locale: string;
    seo_title: string;
    seo_description: string;
    seo_og_image_url: string;
    content: any; // Using any for flexibility with JSONB
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

    async getTranslation(pageId: string, locale: string) {
        const { data, error } = await supabase
            .from('static_page_translations')
            .select('*')
            .eq('page_id', pageId)
            .eq('locale', locale)
            .maybeSingle();

        if (error) throw error;
        return data as StaticPageTranslation | null;
    },

    async saveTranslation(translation: Omit<StaticPageTranslation, 'updated_at' | 'created_at'>) {
        // Upsert based on page_id and locale
        const { data, error } = await supabase
            .from('static_page_translations')
            .upsert({
                page_id: translation.page_id,
                locale: translation.locale,
                seo_title: translation.seo_title,
                seo_description: translation.seo_description,
                seo_og_image_url: translation.seo_og_image_url,
                content: translation.content
            }, { onConflict: 'page_id, locale' })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
