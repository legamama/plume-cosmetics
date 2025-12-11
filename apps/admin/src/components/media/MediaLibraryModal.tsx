import { useEffect } from 'react';
import { X } from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { MediaUploader } from './MediaUploader';
import { useMedia } from '../../hooks/useMedia';
import type { MediaAsset } from '../../types/media';

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (asset: MediaAsset) => void;
    allowMultiple?: boolean; // Future proofing
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
    const { media, fetchMedia, isLoading, deleteMedia } = useMedia();

    // Load media when opened
    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen, fetchMedia]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Media Library</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-4">
                    {/* Inline Upload */}
                    <MediaUploader
                        compact
                        onUploadComplete={() => {
                            fetchMedia();
                        }}
                    />

                    {/* Media Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : media.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No media found.</p>
                            <p className="text-sm mt-1 text-gray-400">
                                Upload your first image using the dropzone above.
                            </p>
                        </div>
                    ) : (
                        <MediaGrid
                            assets={media}
                            onSelect={(asset) => {
                                onSelect?.(asset);
                                onClose();
                            }}
                            onDelete={deleteMedia}
                        />
                    )}
                </div>

                {/* Footer hint */}
                <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                    Click an image to select it
                </div>
            </div>
        </div>
    );
}

