// CTA Banner Section Editor

import { Input } from '../../ui/Input';
import { ImagePicker } from '../../inputs/ImagePicker';
import type { CTABannerConfig } from '../../../types';

interface CTABannerEditorProps {
    config: CTABannerConfig;
    onChange: (config: CTABannerConfig) => void;
}

// Predefined color options
const COLOR_OPTIONS = [
    { value: '#E8A598', label: 'Coral (Primary)' },
    { value: '#F8E8E8', label: 'Rose (Light)' },
    { value: '#8FB59A', label: 'Sage (Green)' },
    { value: '#E8C598', label: 'Amber (Gold)' },
    { value: '#2D2D2D', label: 'Charcoal (Dark)' },
];

export function CTABannerEditor({ config, onChange }: CTABannerEditorProps) {
    const updateConfig = (updates: Partial<CTABannerConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>CTA Banner:</strong> A call-to-action banner to drive user engagement.
                Perfect for promotions, newsletter signups, or featured offers.
            </div>

            <Input
                label="Heading"
                value={config.heading}
                onChange={(e) => updateConfig({ heading: e.target.value })}
                placeholder="Start your beauty journey"
            />

            <Input
                label="Subheading (optional)"
                value={config.subheading || ''}
                onChange={(e) => updateConfig({ subheading: e.target.value })}
                placeholder="Get 10% off your first order"
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Button Label"
                    value={config.button_label}
                    onChange={(e) => updateConfig({ button_label: e.target.value })}
                    placeholder="Shop Now"
                />
                <Input
                    label="Button URL"
                    value={config.button_url}
                    onChange={(e) => updateConfig({ button_url: e.target.value })}
                    placeholder="/products"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                    Background Color
                </label>
                <div className="flex flex-wrap gap-3">
                    {COLOR_OPTIONS.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => updateConfig({ background_color: color.value })}
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                ${config.background_color === color.value
                                    ? 'border-plume-coral ring-2 ring-plume-coral/20'
                                    : 'border-border hover:border-plume-coral/50'
                                }
              `}
                        >
                            <div
                                className="w-6 h-6 rounded-full border border-border"
                                style={{ backgroundColor: color.value }}
                            />
                            <span className="text-sm">{color.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <ImagePicker
                label="Background Image URL (optional)"
                value={config.background_image_url || ''}
                onChange={(url) => updateConfig({ background_image_url: url })}
            />

            {/* Preview */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Preview</label>
                <div
                    className="rounded-lg p-6 text-center"
                    style={{
                        backgroundColor: config.background_color || '#E8A598',
                        backgroundImage: config.background_image_url ? `url(${config.background_image_url})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <h3 className="text-xl font-semibold text-white drop-shadow">
                        {config.heading || 'Your heading here'}
                    </h3>
                    {config.subheading && (
                        <p className="text-white/90 mt-1 drop-shadow">{config.subheading}</p>
                    )}
                    {config.button_label && (
                        <button className="mt-4 px-6 py-2 bg-white text-text-primary rounded-full font-medium shadow-md">
                            {config.button_label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
