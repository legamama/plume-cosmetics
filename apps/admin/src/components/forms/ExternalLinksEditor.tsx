// External Links Editor component

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { ExternalLink } from '../../types';
import { PLATFORMS } from '../../types';

interface ExternalLinksEditorProps {
    value: ExternalLink[];
    onChange: (value: ExternalLink[]) => void;
}

export function ExternalLinksEditor({ value, onChange }: ExternalLinksEditorProps) {
    const handleAddLink = () => {
        const newLink: ExternalLink = {
            id: crypto.randomUUID(),
            platform: 'shopee',
            label: '',
            url: '',
            sort_order: value.length,
        };
        onChange([...value, newLink]);
    };

    const handleRemoveLink = (id: string) => {
        onChange(value.filter((link) => link.id !== id));
    };

    const handleUpdateLink = (id: string, updates: Partial<ExternalLink>) => {
        onChange(
            value.map((link) =>
                link.id === id ? { ...link, ...updates } : link
            )
        );
    };

    // Get default label for platform
    const getDefaultLabel = (platform: string): string => {
        const platformLabels: Record<string, string> = {
            shopee: 'Mua trên Shopee',
            lazada: 'Mua trên Lazada',
            tiktok: 'Mua trên TikTok Shop',
            sendo: 'Mua trên Sendo',
            tiki: 'Mua trên Tiki',
            website: 'Mua ngay',
            other: 'Mua ngay',
        };
        return platformLabels[platform] || 'Mua ngay';
    };

    const handlePlatformChange = (id: string, platform: string) => {
        const link = value.find((l) => l.id === id);
        const updates: Partial<ExternalLink> = { platform };

        // Auto-fill label if empty or if it was a default label
        if (!link?.label || Object.values(getDefaultLabel(link.platform)).includes(link.label)) {
            updates.label = getDefaultLabel(platform);
        }

        handleUpdateLink(id, updates);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">External Buy Links</h4>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={handleAddLink}
                >
                    Add Link
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-sm text-text-muted">No buy links added yet</p>
                    <p className="text-xs text-text-muted mt-1">
                        Add links to Shopee, Lazada, TikTok Shop, etc.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {value.map((link) => (
                        <div
                            key={link.id}
                            className="flex items-start gap-3 p-4 border border-border rounded-lg bg-surface"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Select
                                        value={link.platform}
                                        onChange={(e) => handlePlatformChange(link.id, e.target.value)}
                                        options={PLATFORMS.map((p) => ({ value: p.value, label: p.label }))}
                                        label="Platform"
                                    />
                                    <Input
                                        value={link.label}
                                        onChange={(e) => handleUpdateLink(link.id, { label: e.target.value })}
                                        placeholder="Button label"
                                        label="Button Text"
                                    />
                                    <Input
                                        value={link.url}
                                        onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                                        placeholder="https://..."
                                        label="URL"
                                        type="url"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        value={link.icon || ''}
                                        onChange={(e) => handleUpdateLink(link.id, { icon: e.target.value })}
                                        placeholder="Emoji or Icon Name"
                                        label="Icon (Optional)"
                                    />
                                    <Input
                                        value={link.color || ''}
                                        onChange={(e) => handleUpdateLink(link.id, { color: e.target.value })}
                                        placeholder="#FF0000 or bg-red-500"
                                        label="Background Color (Optional)"
                                    />
                                    <Input
                                        value={link.hover_color || ''}
                                        onChange={(e) => handleUpdateLink(link.id, { hover_color: e.target.value })}
                                        placeholder="#CC0000 or hover:bg-red-600"
                                        label="Hover Color (Optional)"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveLink(link.id)}
                                className="p-2 mt-6 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove link"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
