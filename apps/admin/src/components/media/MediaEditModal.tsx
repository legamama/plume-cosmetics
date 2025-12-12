import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { MediaAsset } from '../../types/media';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface MediaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: MediaAsset | null;
    onSave: (id: string, data: MediaUpdateData) => Promise<void>;
}

export interface MediaUpdateData {
    filename?: string;
    alt_text?: string;
    credits?: string;
}

export function MediaEditModal({ isOpen, onClose, asset, onSave }: MediaEditModalProps) {
    const [filename, setFilename] = useState('');
    const [altText, setAltText] = useState('');
    const [credits, setCredits] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (asset) {
            setFilename(asset.filename || '');
            setAltText(asset.alt_text || '');
            setCredits(asset.credits || '');
        }
    }, [asset]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!asset) return;

        setIsSaving(true);
        try {
            await onSave(asset.id, {
                filename: filename.trim(),
                alt_text: altText.trim() || null,
                credits: credits.trim() || null,
            } as MediaUpdateData);
            onClose();
        } catch (error) {
            // Error handled in hook
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !asset) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Edit Media Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview */}
                <div className="p-4 bg-gray-50 border-b">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-[200px] mx-auto">
                        <img
                            src={asset.public_url}
                            alt={asset.filename}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <Input
                        label="Filename"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        required
                    />

                    <Textarea
                        label="Alt Text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe the image for accessibility"
                        rows={2}
                    />

                    <Input
                        label="Credits"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="Photo by..."
                    />

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSaving}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
