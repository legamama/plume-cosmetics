import { Input } from '../../ui/Input';
import { ImagePicker } from '../../inputs/ImagePicker';
import { RichTextEditor } from '../../editor/RichTextEditor';
import type { HeroConfig } from '../../../types';

interface HeroEditorProps {
    config: HeroConfig;
    onChange: (config: HeroConfig) => void;
}

export function HeroEditor({ config, onChange }: HeroEditorProps) {
    const updateConfig = (updates: Partial<HeroConfig>) => {
        onChange({ ...config, ...updates });
    };

    const updateCTAButton = (field: 'label' | 'url', value: string) => {
        onChange({
            ...config,
            cta_button: {
                ...config.cta_button,
                label: config.cta_button?.label ?? '',
                url: config.cta_button?.url ?? '',
                [field]: value,
            },
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>Hero Banner:</strong> The main banner at the top of the page.
                Use rich text for the heading to add emphasis or formatting.
            </div>

            <RichTextEditor
                label="Heading"
                value={config.heading}
                onChange={(html) => updateConfig({ heading: html })}
                placeholder="Enter the main headline..."
                minHeight="100px"
            />

            <Input
                label="Subheading"
                value={config.subheading || ''}
                onChange={(e) => updateConfig({ subheading: e.target.value })}
                placeholder="Supporting text below the headline"
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="CTA Button Label"
                    value={config.cta_button?.label || ''}
                    onChange={(e) => updateCTAButton('label', e.target.value)}
                    placeholder="e.g., Shop Now"
                />
                <Input
                    label="CTA Button URL"
                    value={config.cta_button?.url || ''}
                    onChange={(e) => updateCTAButton('url', e.target.value)}
                    placeholder="/products"
                />
            </div>

            <ImagePicker
                label="Background Image URL"
                value={config.background_image_url || ''}
                onChange={(url) => updateConfig({ background_image_url: url })}
            />

            {config.background_image_url && (
                <div className="rounded-lg overflow-hidden border border-border">
                    <img
                        src={config.background_image_url}
                        alt="Hero background preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            <Input
                label="Background Video URL (optional)"
                value={config.background_video_url || ''}
                onChange={(e) => updateConfig({ background_video_url: e.target.value })}
                placeholder="https://plume.b-cdn.net/videos/..."
                hint="Video will play in background instead of image"
            />
        </div>
    );
}
