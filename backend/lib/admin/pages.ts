/**
 * Admin Pages API Functions
 * Server-side CRUD operations for page builder
 */

import { getAdminClient } from '../supabaseClient';
import type {
    Locale,
    CreatePageRequest,
    PageDefinitionRow,
    PageSectionRow,
    SectionType,
} from '../types';

/**
 * Create a new page with sections
 */
export async function createPage(input: CreatePageRequest): Promise<PageDefinitionRow> {
    const supabase = getAdminClient();

    // 1. Create page definition
    const { data: page, error: pageError } = await supabase
        .from('page_definitions')
        .insert({
            slug: input.slug,
            locale: input.locale,
            page_type: input.page_type,
            title: input.title,
            route_pattern: input.route_pattern || null,
            seo_title: input.seo_title || null,
            seo_description: input.seo_description || null,
            seo_og_image_url: input.seo_og_image_url || null,
            seo_keywords: input.seo_keywords || null,
            is_published: input.is_published ?? false,
        })
        .select()
        .single();

    if (pageError) {
        console.error('Error creating page:', pageError);
        throw pageError;
    }

    // 2. Create sections
    if (input.sections && input.sections.length > 0) {
        const sections = input.sections.map((s) => ({
            page_id: page.id,
            section_type: s.section_type,
            section_key: s.section_key || null,
            position: s.position,
            is_enabled: s.is_enabled ?? true,
            config_json: s.config_json,
        }));

        const { error: sectionError } = await supabase
            .from('page_sections')
            .insert(sections);

        if (sectionError) {
            // Rollback: delete page
            await supabase.from('page_definitions').delete().eq('id', page.id);
            console.error('Error creating page sections:', sectionError);
            throw sectionError;
        }
    }

    return page as PageDefinitionRow;
}

/**
 * Update an existing page
 */
export async function updatePage(
    id: string,
    input: Partial<CreatePageRequest>
): Promise<PageDefinitionRow> {
    const supabase = getAdminClient();

    const pageUpdate: Record<string, unknown> = {};
    if (input.slug !== undefined) pageUpdate.slug = input.slug;
    if (input.page_type !== undefined) pageUpdate.page_type = input.page_type;
    if (input.title !== undefined) pageUpdate.title = input.title;
    if (input.route_pattern !== undefined) pageUpdate.route_pattern = input.route_pattern;
    if (input.seo_title !== undefined) pageUpdate.seo_title = input.seo_title;
    if (input.seo_description !== undefined) pageUpdate.seo_description = input.seo_description;
    if (input.seo_og_image_url !== undefined) pageUpdate.seo_og_image_url = input.seo_og_image_url;
    if (input.seo_keywords !== undefined) pageUpdate.seo_keywords = input.seo_keywords;
    if (input.is_published !== undefined) pageUpdate.is_published = input.is_published;

    if (Object.keys(pageUpdate).length > 0) {
        const { error } = await supabase
            .from('page_definitions')
            .update(pageUpdate)
            .eq('id', id);

        if (error) {
            console.error('Error updating page:', error);
            throw error;
        }
    }

    // Fetch and return updated page
    const { data, error } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as PageDefinitionRow;
}

/**
 * Delete a page (cascades to sections)
 */
export async function deletePage(id: string): Promise<void> {
    const supabase = getAdminClient();

    const { error } = await supabase
        .from('page_definitions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
}

/**
 * Publish a page
 */
export async function publishPage(id: string): Promise<PageDefinitionRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('page_definitions')
        .update({
            is_published: true,
            published_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error publishing page:', error);
        throw error;
    }

    return data as PageDefinitionRow;
}

/**
 * Unpublish a page
 */
export async function unpublishPage(id: string): Promise<PageDefinitionRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('page_definitions')
        .update({
            is_published: false,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error unpublishing page:', error);
        throw error;
    }

    return data as PageDefinitionRow;
}

// =============================================================================
// Section Management
// =============================================================================

/**
 * Add a section to a page
 */
export async function addSection(
    pageId: string,
    input: {
        section_type: SectionType;
        section_key?: string;
        position: number;
        is_enabled?: boolean;
        config_json: Record<string, unknown>;
    }
): Promise<PageSectionRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('page_sections')
        .insert({
            page_id: pageId,
            section_type: input.section_type,
            section_key: input.section_key || null,
            position: input.position,
            is_enabled: input.is_enabled ?? true,
            config_json: input.config_json,
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding section:', error);
        throw error;
    }

    return data as PageSectionRow;
}

/**
 * Update a section
 */
export async function updateSection(
    sectionId: string,
    input: Partial<{
        section_type: SectionType;
        section_key: string;
        position: number;
        is_enabled: boolean;
        config_json: Record<string, unknown>;
    }>
): Promise<PageSectionRow> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from('page_sections')
        .update(input)
        .eq('id', sectionId)
        .select()
        .single();

    if (error) {
        console.error('Error updating section:', error);
        throw error;
    }

    return data as PageSectionRow;
}

/**
 * Delete a section
 */
export async function deleteSection(sectionId: string): Promise<void> {
    const supabase = getAdminClient();

    const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', sectionId);

    if (error) {
        console.error('Error deleting section:', error);
        throw error;
    }
}

/**
 * Reorder sections within a page
 */
export async function reorderSections(
    pageId: string,
    sectionIds: string[]
): Promise<void> {
    const supabase = getAdminClient();

    // Update each section's position based on array order
    const updates = sectionIds.map((id, index) => ({
        id,
        position: index,
    }));

    for (const update of updates) {
        const { error } = await supabase
            .from('page_sections')
            .update({ position: update.position })
            .eq('id', update.id)
            .eq('page_id', pageId);

        if (error) {
            console.error('Error reordering sections:', error);
            throw error;
        }
    }
}

/**
 * Get all pages (for admin list view)
 */
export async function getAllPages(locale?: Locale): Promise<PageDefinitionRow[]> {
    const supabase = getAdminClient();

    let query = supabase
        .from('page_definitions')
        .select('*')
        .order('created_at', { ascending: false });

    if (locale) {
        query = query.eq('locale', locale);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching all pages:', error);
        throw error;
    }

    return data as PageDefinitionRow[];
}

/**
 * Get page with sections (for admin editor)
 */
export async function getPageWithSections(id: string): Promise<{
    page: PageDefinitionRow;
    sections: PageSectionRow[];
}> {
    const supabase = getAdminClient();

    const { data: page, error: pageError } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('id', id)
        .single();

    if (pageError) {
        console.error('Error fetching page:', pageError);
        throw pageError;
    }

    const { data: sections, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', id)
        .order('position', { ascending: true });

    if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        throw sectionsError;
    }

    return {
        page: page as PageDefinitionRow,
        sections: (sections || []) as PageSectionRow[],
    };
}
