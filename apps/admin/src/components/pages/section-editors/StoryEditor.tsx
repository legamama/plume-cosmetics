// Story Section Editor

import { Input } from '../../ui/Input';
import { RichTextEditor } from '../../editor/RichTextEditor';
import { ImagePicker } from '../../inputs/ImagePicker';
import type { StoryConfig } from '../../../types';

interface StoryEditorProps {
    config: StoryConfig;
    onChange: (config: StoryConfig) => void;
}

export function StoryEditor({ config, onChange }: StoryEditorProps) {
    const updateConfig = (updates: Partial<StoryConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>Brand Story:</strong> Tell your brand's story with a heading, rich text body,
                and an optional image. The image can be positioned on the left or right.
            </div>

            <Input
                label="Heading"
                value={config.heading}
                onChange={(e) => updateConfig({ heading: e.target.value })}
                placeholder="Our Story"
            />

            <Input
                label="Subtitle"
                value={config.subtitle || ''}
                onChange={(e) => updateConfig({ subtitle: e.target.value })}
                placeholder="The inspiration behind the brand"
            />

            <RichTextEditor
                label="Body Content"
                value={config.body}
                onChange={(html) => updateConfig({ body: html })}
                placeholder="Tell your brand's story..."
                minHeight="200px"
            />

            <ImagePicker
                label="Image URL"
                value={config.image_url || ''}
                onChange={(url) => updateConfig({ image_url: url })}
            />

            {config.image_url && (
                <div className="rounded-lg overflow-hidden border border-border">
                    <img
                        src={config.image_url}
                        alt="Story image preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                    Image Position
                </label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="imagePosition"
                            value="left"
                            checked={config.image_position === 'left'}
                            onChange={() => updateConfig({ image_position: 'left' })}
                            className="text-plume-coral focus:ring-plume-coral"
                        />
                        <span className="text-text-primary">Image on Left</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="imagePosition"
                            value="right"
                            checked={config.image_position === 'right'}
                            onChange={() => updateConfig({ image_position: 'right' })}
                            className="text-plume-coral focus:ring-plume-coral"
                        />
                        <span className="text-text-primary">Image on Right</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
