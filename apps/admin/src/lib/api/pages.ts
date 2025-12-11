// Pages and Sections API functions
import { supabase } from '../supabase';
import type { Locale } from '../../types/common';
import type {
    PageDefinition,
    PageSection,
    SectionType,
    PageWithSections,
    SectionConfig
} from '../../types/pages';
import { getDefaultSectionConfig } from '../../types/pages';

// ============================================
// API Functions
// ============================================

/**
 * Fetch all page definitions, grouped by slug to look like single pages to the Admin UI
 */
export async function fetchPages(): Promise<PageDefinition[]> {
    const { data, error } = await supabase
        .from('page_definitions')
        .select('*')
        .order('slug');

    if (error) {
        throw new Error(error.message);
    }

    if (!data) return [];

    // Group by slug to form the Admin's view of "Pages"
    // We'll use the 'vi' version as the primary, or merge them.
    // The Admin Type has name_vi, name_en, name_ko.
    // The DB has 'title' and 'locale'.

    const pagesMap = new Map<string, any>();

    data.forEach(row => {
        if (!pagesMap.has(row.slug)) {
            pagesMap.set(row.slug, {
                id: row.id, // Use the ID of the first one encountered (usually VI if sorted? No guarantee)
                slug: row.slug,
                is_published: row.is_published, // What if one is published and other isn't?
                created_at: row.created_at,
                updated_at: row.updated_at,
                name_vi: '',
                name_en: '',
                name_ko: ''
            });
        }

        const page = pagesMap.get(row.slug);
        if (row.locale === 'vi') {
            page.name_vi = row.title;
            // Prefer VI ID if available to be the "Main" ID
            page.id = row.id;
            page.is_published = row.is_published; // Prefer VI published state?
        } else if (row.locale === 'en') {
            page.name_en = row.title;
        } else if (row.locale === 'ko') {
            page.name_ko = row.title;
        }
    });

    return Array.from(pagesMap.values());
}

/**
 * Fetch a single page definition by ID
 */
export async function fetchPageById(id: string): Promise<PageDefinition | null> {
    const { data, error } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;

    // This returns the RAW row. 
    // If the UI expects name_vi etc, we might need to fetch siblings.
    // But usually fetchPageById is used for initial load.
    // Let's do a best effort to find siblings.

    // 1. Fetch siblings
    const { data: siblings } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('slug', data.slug);

    const result: any = {
        id: data.id,
        slug: data.slug,
        is_published: data.is_published,
        created_at: data.created_at,
        updated_at: data.updated_at,
        name_vi: '', name_en: '', name_ko: ''
    };

    if (siblings) {
        siblings.forEach(s => {
            if (s.locale === 'vi') result.name_vi = s.title;
            if (s.locale === 'en') result.name_en = s.title;
            if (s.locale === 'ko') result.name_ko = s.title;
        });
    }

    return result as PageDefinition;
}

/**
 * Fetch page with its sections for a specific locale
 * This handles the "Switch Context" logic.
 */
export async function fetchPageWithSections(
    pageId: string,
    locale: Locale
): Promise<PageWithSections | null> {
    // 1. Get the requested page definition (source) to find its slug
    const { data: sourcePage, error: reqErr } = await supabase
        .from('page_definitions')
        .select('slug')
        .eq('id', pageId)
        .single();

    if (reqErr || !sourcePage) return null;

    // 2. Find the target page for the requested locale with the same slug
    const { data: targetPage, error: targetErr } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('slug', sourcePage.slug)
        .eq('locale', locale)
        .single();

    if (targetErr || !targetPage) {
        // If target locale page doesn't exist, we can't show sections for it.
        // In a real app, we might create it here.
        // For now, let's return null. The UI might need to handle this.
        console.warn(`Page not found for slug ${sourcePage.slug} and locale ${locale}`);
        return null;
    }

    // 3. Fetch sections for the target page
    const { data: sections, error: secErr } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', targetPage.id)
        .order('position');

    if (secErr) throw new Error(secErr.message);

    // Construct response. 
    // We need to return the Target Page properties, but mapped to the Admin Interface.
    // The Admin Interface expects name_vi, name_en, etc.
    // But for the PageEditor, it mostly cares about `sections` and `id` (to know where to save).

    const result: PageWithSections = {
        id: targetPage.id, // CRITICAL: This IS the ID to be used for subsequent section operations
        slug: targetPage.slug,
        is_published: targetPage.is_published,
        created_at: targetPage.created_at,
        updated_at: targetPage.updated_at,
        name_vi: targetPage.title, // Fallback assignments
        name_en: targetPage.title,
        name_ko: targetPage.title,
        sections: (sections || []).map(s => ({
            ...s,
            locale: locale // Ensure locale is set, though DB doesn't have it on section, we inject it for UI
        })) as PageSection[]
    };

    return result;
}

/**
 * Create or update a page definition
 * NOTE: This usually updates the CURRENT locale's page.
 */
export async function upsertPage(
    page: Partial<PageDefinition> & { name_vi: string; slug: string }
): Promise<PageDefinition> {
    // This function seems to be for creating NEW pages (which usually start as VI).
    // Or updating existing.

    const payload = {
        slug: page.slug,
        title: page.name_vi, // Defaulting to VI title
        locale: 'vi',
        page_type: 'standard', // Default
        is_published: page.is_published ?? false
    };

    if (page.id) {
        // Update
        const { data, error } = await supabase
            .from('page_definitions')
            .update({
                slug: page.slug,
                title: page.name_vi, // Assume we are editing VI?
                updated_at: new Date().toISOString()
            })
            .eq('id', page.id)
            .select()
            .single();

        if (error) throw error;
        return { ...data, name_vi: data.title } as any;
    } else {
        // Create - we should probably create for ALL locales?
        // Or just VI?
        // Let's create VI.
        const { data, error } = await supabase
            .from('page_definitions')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        // Also create placeholders for EN and KO?
        await supabase.from('page_definitions').insert([
            { slug: page.slug, title: page.name_en || page.name_vi, locale: 'en', page_type: 'standard' },
            { slug: page.slug, title: page.name_ko || page.name_vi, locale: 'ko', page_type: 'standard' }
        ]);

        return { ...data, name_vi: data.title } as any;
    }
}

/**
 * Toggle page published status
 */
export async function togglePagePublished(id: string): Promise<PageDefinition> {
    const { data: current } = await supabase.from('page_definitions').select('is_published').eq('id', id).single();
    if (!current) throw new Error('Page not found');

    const { data, error } = await supabase
        .from('page_definitions')
        .update({ is_published: !current.is_published })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return { ...data, name_vi: data.title } as any;
}

/**
 * Create a new section
 */
export async function createSection(
    pageId: string,
    locale: Locale, // Unused in DB insert if we trust pageId, but good for validation
    sectionType: SectionType,
    position: number,
    initialConfig?: SectionConfig // Add optional config
): Promise<PageSection> {
    const defaultConfig = getDefaultSectionConfig(sectionType);
    const config = initialConfig ? { ...defaultConfig, ...initialConfig } : defaultConfig;

    const payload = {
        page_id: pageId,
        section_type: sectionType,
        position,
        is_enabled: true,
        config_json: config
    };

    const { data, error } = await supabase
        .from('page_sections')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return {
        ...data,
        locale // Inject back
    } as PageSection;
}

/**
 * Update a section's config
 */
export async function updateSection(
    id: string,
    updates: Partial<Pick<PageSection, 'config_json' | 'is_enabled'>>
): Promise<PageSection> {
    const { data, error } = await supabase
        .from('page_sections')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as PageSection; // locale missing but UI might tolerate it if it just updates list
}

/**
 * Reorder sections for a page and locale
 */
export async function reorderSections(
    _pageId: string,
    _locale: Locale,
    orderedIds: string[]
): Promise<void> {
    // We can use upsert to batch update positions?
    // Supabase JS doesn't support easy batch update of different values.
    // Loop for now.

    const promises = orderedIds.map((id, index) =>
        supabase
            .from('page_sections')
            .update({ position: index })
            .eq('id', id)
    );

    await Promise.all(promises);
}

/**
 * Toggle section enabled/disabled
 */
export async function toggleSectionEnabled(id: string): Promise<PageSection> {
    const { data: current } = await supabase.from('page_sections').select('is_enabled').eq('id', id).single();
    if (!current) throw new Error('Section not found');

    const { data, error } = await supabase
        .from('page_sections')
        .update({ is_enabled: !current.is_enabled })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as PageSection;
}

/**
 * Delete a section
 */
export async function deleteSection(id: string): Promise<void> {
    const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
