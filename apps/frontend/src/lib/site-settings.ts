import { supabase } from "@/lib/supabase";

/**
 * Floating Action Button Configuration
 */
export interface FloatingAction {
    id: string;
    iconKey: string;           // Maps to icon component (facebook, tiktok, phone, email, etc.)
    label: string;             // Tooltip/hover text
    href: string;              // Link URL
    backgroundColor: string;   // Hex color
    hoverColor: string;        // Hover background color
    isEnabled: boolean;
    order: number;
}

/**
 * Social Link Item Configuration
 */
export interface SocialLinkItem {
    id: string;
    platform: string;          // 'facebook', 'tiktok', 'instagram', or custom
    url: string;
    label: string;             // Display name
    icon: string;              // Icon key
    isEnabled: boolean;
    order: number;
}

/**
 * Site-wide settings interface
 */
export interface SiteSettings {
    socials: SocialLinkItem[];
    floatingActions: FloatingAction[];
}

/**
 * Default settings fallback
 */
const defaultSettings: SiteSettings = {
    socials: [
        {
            id: '1',
            platform: 'facebook',
            url: 'https://www.facebook.com/giadinhlegamamaouc/',
            label: 'Facebook',
            icon: 'facebook',
            isEnabled: true,
            order: 1,
        },
        {
            id: '2',
            platform: 'tiktok',
            url: 'https://www.tiktok.com/@legamama',
            label: 'TikTok',
            icon: 'tiktok',
            isEnabled: true,
            order: 2,
        },
        {
            id: '3',
            platform: 'youtube',
            url: 'https://www.youtube.com/@giadinhlegamamaouc',
            label: 'YouTube',
            icon: 'youtube',
            isEnabled: true,
            order: 3,
        },
        {
            id: '4',
            platform: 'instagram',
            url: 'https://www.instagram.com/legamama.official',
            label: 'Instagram',
            icon: 'instagram',
            isEnabled: true,
            order: 4,
        }
    ],
    floatingActions: [
        {
            id: '1',
            iconKey: 'facebook',
            label: 'Follow on Facebook',
            href: 'https://www.facebook.com/giadinhlegamamaouc/',
            backgroundColor: '#E8A598',
            hoverColor: '#D4847A',
            isEnabled: true,
            order: 1,
        },
        {
            id: '2',
            iconKey: 'tiktok',
            label: 'Follow on TikTok',
            href: 'https://www.tiktok.com/@legamama',
            backgroundColor: '#E8A598',
            hoverColor: '#D4847A',
            isEnabled: true,
            order: 2,
        },
        {
            id: '3',
            iconKey: 'instagram',
            label: 'Follow on Instagram',
            href: 'https://www.instagram.com/legamama.official',
            backgroundColor: '#E8A598',
            hoverColor: '#D4847A',
            isEnabled: true,
            order: 3,
        },
    ],
};

interface SettingRow {
    setting_key: string;
    value: unknown;
}

/**
 * Fetch site settings from Supabase
 * Falls back to default settings if database is not available
 */
export async function getSiteSettings(_locale?: string): Promise<SiteSettings> {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, value');

        if (error) {
            console.warn('Failed to fetch site settings, using defaults:', error.message);
            return defaultSettings;
        }

        if (!data || data.length === 0) {
            return defaultSettings;
        }

        // Transform rows into settings object
        const socialsRow = data.find((s: SettingRow) => s.setting_key === 'socials');
        const floatingActionsRow = data.find((s: SettingRow) => s.setting_key === 'floating_actions');

        let socials = (socialsRow?.value as SiteSettings['socials']) ?? defaultSettings.socials;

        // Runtime check: handle migration period where it might still be an object
        if (socials && !Array.isArray(socials)) {
            console.warn('Socials setting is legacy object format, falling back to defaults temporarily');
            socials = defaultSettings.socials;
        }

        return {
            socials,
            floatingActions: (floatingActionsRow?.value as FloatingAction[]) ?? defaultSettings.floatingActions,
        };
    } catch (error) {
        console.warn('Error fetching site settings, using defaults:', error);
        return defaultSettings;
    }
}

/**
 * Get only floating actions from settings
 */
export async function getFloatingActions(): Promise<FloatingAction[]> {
    const settings = await getSiteSettings();
    return settings.floatingActions;
}

/**
 * Get only social links from settings
 */
export async function getSocialLinks(): Promise<SiteSettings['socials']> {
    const settings = await getSiteSettings();
    return settings.socials;
}

/**
 * Get TikTok section visibility setting
 */
export async function getTikTokSectionVisibility(): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('setting_key', 'tiktok_section_visible')
            .single();

        if (error || !data) {
            // Default to visible if no setting exists
            return true;
        }

        return data.value as boolean;
    } catch (error) {
        console.warn('Error fetching TikTok visibility, defaulting to visible:', error);
        return true;
    }
}
