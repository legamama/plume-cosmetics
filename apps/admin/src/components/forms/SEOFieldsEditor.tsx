// SEO Fields Editor component

import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { slugify } from '../../lib/utils/formatters';
import type { SEOFields } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SEOFieldsEditorProps {
    value: SEOFields;
    onChange: (value: SEOFields) => void;
    titleSource?: string; // Used to auto-generate slug
}

export function SEOFieldsEditor({ value, onChange, titleSource }: SEOFieldsEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (field: keyof SEOFields, newValue: string) => {
        onChange({ ...value, [field]: newValue });
    };

    const handleAutoGenerateSlug = () => {
        if (titleSource) {
            const slug = slugify(titleSource);
            handleChange('slug', slug);
        }
    };

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface-hover hover:bg-border/30 transition-colors"
            >
                <span className="text-sm font-medium text-text-primary">SEO Settings</span>
                {isExpanded ? (
                    <ChevronUp size={18} className="text-text-muted" />
                ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                )}
            </button>

            {isExpanded && (
                <div className="p-4 space-y-4 bg-surface">
                    <Input
                        label="Meta Title"
                        value={value.meta_title}
                        onChange={(e) => handleChange('meta_title', e.target.value)}
                        placeholder="Page title for search engines"
                        hint={`${value.meta_title.length}/60 characters`}
                    />

                    <Textarea
                        label="Meta Description"
                        value={value.meta_description}
                        onChange={(e) => handleChange('meta_description', e.target.value)}
                        placeholder="Brief description for search results"
                        hint={`${value.meta_description.length}/160 characters`}
                        rows={3}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-text-primary">
                            URL Slug
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={value.slug}
                                onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                placeholder="url-friendly-slug"
                                className="flex-1"
                            />
                            {titleSource && (
                                <button
                                    type="button"
                                    onClick={handleAutoGenerateSlug}
                                    className="px-3 py-2 text-sm text-plume-coral hover:text-plume-coral-dark border border-border rounded-lg hover:bg-surface-hover transition-colors whitespace-nowrap"
                                >
                                    Auto-generate
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
