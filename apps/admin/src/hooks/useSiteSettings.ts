import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

/**
 * Floating Action Button Configuration
 */
export interface FloatingAction {
    id: string;
    iconKey: string;
    label: string;
    href: string;
    backgroundColor: string;
    hoverColor: string;
    isEnabled: boolean;
    order: number;
}

/**
 * Social Link Item Configuration
 */
export interface SocialLinkItem {
    id: string;
    platform: string;
    url: string;
    label: string;
    icon: string;
    isEnabled: boolean;
    order: number;
}

/**
 * Site Settings
 */
export interface SiteSettingsData {
    socials: SocialLinkItem[];
    floatingActions: FloatingAction[];
}

interface UseSiteSettingsReturn {
    settings: SiteSettingsData | null;
    isLoading: boolean;
    error: string | null;
    updateSocials: (socials: SocialLinkItem[]) => Promise<void>;
    updateFloatingActions: (actions: FloatingAction[]) => Promise<void>;
    addFloatingAction: (action: Omit<FloatingAction, 'id'>) => Promise<void>;
    deleteFloatingAction: (id: string) => Promise<void>;
    reorderFloatingActions: (actions: FloatingAction[]) => Promise<void>;
    addSocialLink: (link: Omit<SocialLinkItem, 'id'>) => Promise<void>;
    deleteSocialLink: (id: string) => Promise<void>;
    reorderSocialLinks: (links: SocialLinkItem[]) => Promise<void>;
    refetch: () => Promise<void>;
}

export function useSiteSettings(): UseSiteSettingsReturn {
    const [settings, setSettings] = useState<SiteSettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('site_settings')
                .select('setting_key, value');

            if (fetchError) throw fetchError;

            const socialsRow = data?.find(s => s.setting_key === 'socials');
            const floatingActionsRow = data?.find(s => s.setting_key === 'floating_actions');

            let socials = (socialsRow?.value as SocialLinkItem[]) ?? [];

            // Runtime check for legacy object format
            if (socials && !Array.isArray(socials)) {
                console.warn('Socials setting is legacy object, please run migration.');
                // We could auto-convert here for display, but better to enforce migration
                socials = [];
            }

            setSettings({
                socials,
                floatingActions: (floatingActionsRow?.value as FloatingAction[]) ?? [],
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch settings';
            setError(message);
            console.error('Error fetching site settings:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSocials = useCallback(async (socials: SocialLinkItem[]) => {
        try {
            const { error: updateError } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'socials',
                    value: socials,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'setting_key',
                });

            if (updateError) throw updateError;

            setSettings(prev => prev ? { ...prev, socials } : null);
            showToast('success', 'Social links updated successfully');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update social links';
            showToast('error', message);
            throw err;
        }
    }, [showToast]);

    const updateFloatingActions = useCallback(async (actions: FloatingAction[]) => {
        try {
            const { error: updateError } = await supabase
                .from('site_settings')
                .upsert({
                    setting_key: 'floating_actions',
                    value: actions,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'setting_key',
                });

            if (updateError) throw updateError;

            setSettings(prev => prev ? { ...prev, floatingActions: actions } : null);
            showToast('success', 'Floating actions updated successfully');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update floating actions';
            showToast('error', message);
            throw err;
        }
    }, [showToast]);

    const addFloatingAction = useCallback(async (action: Omit<FloatingAction, 'id'>) => {
        if (!settings) return;

        const newAction: FloatingAction = {
            ...action,
            id: crypto.randomUUID(),
        };

        const updatedActions = [...settings.floatingActions, newAction];
        await updateFloatingActions(updatedActions);
    }, [settings, updateFloatingActions]);

    const deleteFloatingAction = useCallback(async (id: string) => {
        if (!settings) return;

        const updatedActions = settings.floatingActions.filter(a => a.id !== id);
        await updateFloatingActions(updatedActions);
    }, [settings, updateFloatingActions]);

    const reorderFloatingActions = useCallback(async (actions: FloatingAction[]) => {
        const reorderedActions = actions.map((action, index) => ({
            ...action,
            order: index + 1,
        }));
        await updateFloatingActions(reorderedActions);
    }, [updateFloatingActions]);

    // --- New Social Links Helpers ---

    const addSocialLink = useCallback(async (link: Omit<SocialLinkItem, 'id'>) => {
        if (!settings) return;

        const newLink: SocialLinkItem = {
            ...link,
            id: crypto.randomUUID(),
        };

        const updatedLinks = [...settings.socials, newLink];
        await updateSocials(updatedLinks);
    }, [settings, updateSocials]);

    const deleteSocialLink = useCallback(async (id: string) => {
        if (!settings) return;

        const updatedLinks = settings.socials.filter(s => s.id !== id);
        await updateSocials(updatedLinks);
    }, [settings, updateSocials]);

    const reorderSocialLinks = useCallback(async (links: SocialLinkItem[]) => {
        const reorderedLinks = links.map((link, index) => ({
            ...link,
            order: index + 1,
        }));
        await updateSocials(reorderedLinks);
    }, [updateSocials]);

    return {
        settings,
        isLoading,
        error,
        updateSocials,
        updateFloatingActions,
        addFloatingAction,
        deleteFloatingAction,
        reorderFloatingActions,
        addSocialLink,
        deleteSocialLink,
        reorderSocialLinks,
        refetch: fetchSettings,
    };
}
