// Media Gallery Editor component

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

import { MediaLibraryModal } from '../media/MediaLibraryModal';
import { ImagePicker } from '../inputs/ImagePicker';
import type { MediaItem } from '../../types';

interface MediaGalleryEditorProps {
    value: MediaItem[];
    onChange: (value: MediaItem[]) => void;
}

export function MediaGalleryEditor({ value, onChange }: MediaGalleryEditorProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    const handleAddImage = (asset: any) => {
        const newItem: MediaItem = {
            id: crypto.randomUUID(),
            url: asset.bunny_cdn_url,
            alt_text_vi: asset.alt_text || '',
            sort_order: value.length,
            is_carousel: false,
        };

        onChange([...value, newItem]);
        setIsAddModalOpen(false);
    };

    const handleRemoveImage = (id: string) => {
        onChange(value.filter((item) => item.id !== id));
    };

    const handleUpdateImage = (id: string, updates: Partial<MediaItem>) => {
        onChange(
            value.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    const handleMoveImage = (index: number, direction: 'up' | 'down') => {
        const newValue = [...value];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newValue.length) return;

        [newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]];

        // Update sort_order
        newValue.forEach((item, i) => {
            item.sort_order = i;
        });

        onChange(newValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">Media Gallery</h4>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Image
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <ImageIcon size={32} className="mx-auto text-text-muted mb-2" />
                    <p className="text-sm text-text-muted">No images added yet</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-2"
                    >
                        Add your first image
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {value.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 border border-border rounded-lg bg-surface"
                        >
                            {/* Drag handle */}
                            <div className="flex flex-col gap-1 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-surface-hover rounded disabled:opacity-30"
                                    aria-label="Move up"
                                >
                                    <GripVertical size={16} className="text-text-muted" />
                                </button>
                            </div>

                            {/* Image preview */}
                            <div className="w-20 h-20 rounded-lg bg-surface-hover overflow-hidden flex-shrink-0">
                                {item.url ? (
                                    <img
                                        src={item.url}
                                        alt={item.alt_text_vi}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f5f5f5" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10">No image</text></svg>';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={24} className="text-text-muted" />
                                    </div>
                                )}
                            </div>

                            {/* Image details */}
                            <div className="flex-1 space-y-2">
                                <div className="min-w-0 flex-1">
                                    <ImagePicker
                                        value={item.url}
                                        onChange={(url) => handleUpdateImage(item.id, { url })}
                                    />
                                </div>
                                <Input
                                    value={item.alt_text_vi}
                                    onChange={(e) => handleUpdateImage(item.id, { alt_text_vi: e.target.value })}
                                    placeholder="Alt text (Vietnamese)"
                                    className="text-sm"
                                />
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={item.is_carousel}
                                            onChange={(e) => handleUpdateImage(item.id, { is_carousel: e.target.checked })}
                                            className="rounded border-border text-plume-coral focus:ring-plume-coral"
                                        />
                                        Show in carousel
                                    </label>
                                </div>
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(item.id)}
                                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove image"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Image Modal */}
            <MediaLibraryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSelect={handleAddImage}
            />
        </div>
    );
}
