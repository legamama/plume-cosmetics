// Form validation utility functions

/**
 * Check if a string is empty or only whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if a string is a valid Bunny CDN URL
 */
export function isBunnyCdnUrl(url: string): boolean {
    if (!isValidUrl(url)) return false;
    try {
        const parsed = new URL(url);
        return parsed.hostname.endsWith('.b-cdn.net');
    } catch {
        return false;
    }
}

/**
 * Check if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Check if a price is valid (positive number)
 */
export function isValidPrice(price: number): boolean {
    return typeof price === 'number' && price >= 0 && isFinite(price);
}

/**
 * Validate required fields for a locale
 */
export function validateLocaleFields(
    fields: { name?: string; title?: string },
    isRequired: boolean
): string[] {
    const errors: string[] = [];

    if (isRequired) {
        if (isEmpty(fields.name) && isEmpty(fields.title)) {
            errors.push('Name or title is required');
        }
    }

    return errors;
}

/**
 * Validate SEO fields
 */
export function validateSeoFields(seo: { meta_title: string; meta_description: string; slug: string }): string[] {
    const errors: string[] = [];

    if (seo.meta_title && seo.meta_title.length > 60) {
        errors.push('Meta title should be under 60 characters');
    }

    if (seo.meta_description && seo.meta_description.length > 160) {
        errors.push('Meta description should be under 160 characters');
    }

    if (seo.slug && !isValidSlug(seo.slug)) {
        errors.push('Slug should only contain lowercase letters, numbers, and hyphens');
    }

    return errors;
}
