import { Input } from '../../ui/Input';
import type { LaunchOfferConfig } from '../../../types/pages';

interface LaunchOfferEditorProps {
    config: LaunchOfferConfig;
    onChange: (config: LaunchOfferConfig) => void;
}

export function LaunchOfferEditor({ config, onChange }: LaunchOfferEditorProps) {
    const updateConfig = (updates: Partial<LaunchOfferConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>Launch Offer:</strong> A promotional section with a gradient background, title, description, and call-to-action button.
            </div>

            <Input
                label="Title"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="Ex: Opening Sale"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                    Description
                </label>
                <textarea
                    className="w-full px-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-plume-rose/20 focus:border-plume-rose outline-none transition-colors min-h-[100px]"
                    value={config.description}
                    onChange={(e) => updateConfig({ description: e.target.value })}
                    placeholder="Enter offer details..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="CTA Label"
                    value={config.ctaLabel}
                    onChange={(e) => updateConfig({ ctaLabel: e.target.value })}
                    placeholder="Ex: Shop Now"
                />
                <Input
                    label="CTA Link"
                    value={config.ctaLink || ''}
                    onChange={(e) => updateConfig({ ctaLink: e.target.value })}
                    placeholder="Ex: /products"
                />
            </div>
        </div>
    );
}
