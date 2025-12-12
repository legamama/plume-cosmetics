import { supabase } from "@/lib/supabase";
import { PageDefinition, PageSection } from "@/types/page-builder";

export async function getPageData(slug: string, locale: string = 'vi'): Promise<PageDefinition | null> {
    // 1. Find the page definition for this slug & locale
    // We try to find the specific locale first.
    let { data: page, error: pageError } = await supabase
        .from('page_definitions')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .eq('is_published', true)
        .maybeSingle();

    if (pageError) {
        console.error('Error fetching page definition:', pageError);
        return null;
    }

    // Fallback: If no page found for 'en'/'ko', try 'vi' (default) if strictly required?
    // User requirement: "Make sure Vietnamese (vi) remains the default locale when no locale is specified"
    // The previous logic returned mock VI data for 'vi' and mock EN for everything else.
    // If we return NULL here, the Next.js page will 404.
    // Let's strictly return null if the requested locale page doesn't exist,
    // OR should we fallback to VI content?
    // User said: "The frontend must request the matching locale data... Make sure Vietnamese (vi) remains the default locale when no locale is specified"
    // This usually means if explicit locale is missing. But here we receive `locale` from params.
    // If the URL is `/en`, we expect English. If English is missing -> 404 is correct, OR fallback to VI?
    // Usually 404 or fallback. I'll stick to 404 (null) for now to be "correct",
    // unless the Slug matches but the Locale doesn't?
    // Let's just return null if not found.

    if (!page) {
        // Try fallback to VI only if we are at root and maybe logic dictates it?
        // For now, assume data exists.
        return null;
    }

    // 2. Fetch sections for this specific page definition (which is bound to the locale)
    const { data: sections, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_enabled', true)
        .order('position');

    if (sectionsError) {
        console.error('Error fetching page sections:', sectionsError);
        return null;
    }

    // Map DB result to PageSection type if necessary (handling any vs types)
    const mappedSections: PageSection[] = (sections || []).map(s => ({
        id: s.id,
        section_type: s.section_type,
        position: s.position,
        config_json: s.config_json
    }));

    return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        sections: mappedSections
    };
}
