import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Plus, Palette } from 'lucide-react';
import type { ProductTag } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TagsInputProps {
    tags: ProductTag[];
    onChange: (tags: ProductTag[]) => void;
}

const PREDEFINED_TAGS: { label: string; type: 'system' }[] = [
    { label: 'Best Seller', type: 'system' },
    { label: 'New Product', type: 'system' },
    { label: 'Sale', type: 'system' },
];

const COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#F43F5E', // Rose
    '#64748B', // Slate
];

export function TagsInput({ tags, onChange }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[6]); // Default blue
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleAddSystemTag = (label: string) => {
        if (!tags.some(t => t.label === label)) {
            onChange([
                ...tags,
                {
                    id: crypto.randomUUID(),
                    label,
                    type: 'system' as const,
                },
            ]);
        }
    };

    const handleAddCustomTag = () => {
        if (inputValue.trim()) {
            onChange([
                ...tags,
                {
                    id: crypto.randomUUID(),
                    label: inputValue.trim(),
                    color: selectedColor,
                    type: 'custom' as const,
                },
            ]);
            setInputValue('');
            setShowColorPicker(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCustomTag();
        }
    };

    const removeTag = (id: string) => {
        onChange(tags.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Tags</h3>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white transition-all shadow-sm"
                        style={{
                            backgroundColor: tag.type === 'system'
                                ? '#1F2937' // Dark gray for system tags
                                : tag.color || '#3B82F6'
                        }}
                    >
                        {tag.label}
                        <button
                            type="button"
                            onClick={() => removeTag(tag.id)}
                            className="ml-1.5 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                {tags.length === 0 && (
                    <span className="text-sm text-text-muted italic">No tags selected</span>
                )}
            </div>

            {/* Controls */}
            <div className="space-y-3">
                {/* System Tags Quick Add */}
                <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TAGS.map((pt) => {
                        const isSelected = tags.some(t => t.label === pt.label);
                        return (
                            <button
                                key={pt.label}
                                type="button"
                                onClick={() => !isSelected && handleAddSystemTag(pt.label)}
                                disabled={isSelected}
                                className={`
                                    px-3 py-1.5 text-xs font-medium rounded-md border transition-colors
                                    ${isSelected
                                        ? 'bg-surface-active border-border-default text-text-disabled cursor-default'
                                        : 'bg-surface-card border-border-default text-text-primary hover:border-brand-primary hover:text-brand-primary'}
                                `}
                            >
                                + {pt.label}
                            </button>
                        );
                    })}
                </div>

                {/* Custom Tag Input */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Add custom tag..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
                            title="Choose Color"
                        >
                            <Palette size={16} style={{ color: selectedColor }} />
                        </button>

                        {/* Color Picker Popover */}
                        {showColorPicker && (
                            <div className="absolute right-0 top-full mt-2 p-3 bg-white border border-border-default rounded-lg shadow-lg z-10 grid grid-cols-4 gap-2 w-48">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-brand-primary' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setShowColorPicker(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleAddCustomTag}
                        disabled={!inputValue.trim()}
                        leftIcon={<Plus size={16} />}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
