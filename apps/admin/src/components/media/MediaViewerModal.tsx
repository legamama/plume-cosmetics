import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Copy, Check, Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { MediaAsset } from '../../types/media';
import { useToast } from '../../context/ToastContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

interface MediaViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    assets: MediaAsset[];
    initialIndex: number;
    onDelete?: (id: string) => void;
    onEdit?: (asset: MediaAsset) => void;
}

export function MediaViewerModal({
    isOpen,
    onClose,
    assets,
    initialIndex,
    onDelete,
    onEdit,
}: MediaViewerModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [copied, setCopied] = useState(false);
    const toast = useToast();
    const { confirm } = useConfirmDialog();

    const currentAsset = assets[currentIndex];

    // Reset index when assets change or modal opens
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : assets.length - 1));
    }, [assets.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < assets.length - 1 ? prev + 1 : 0));
    }, [assets.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, goToPrevious, goToNext]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentAsset.bunny_cdn_url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Media',
            message: 'Are you sure you want to delete this media? This action cannot be undone.',
            details: currentAsset.filename,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (confirmed) {
            onDelete?.(currentAsset.id);
            if (assets.length <= 1) {
                onClose();
            } else if (currentIndex >= assets.length - 1) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isOpen || !currentAsset) return null;

    const isVideo = currentAsset.mime_type?.startsWith('video/');

    return (
        <div className="fixed inset-0 z-50 flex bg-black/90 backdrop-blur-sm">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={24} />
            </button>

            {/* Navigation buttons */}
            {assets.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-[340px] top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Media preview */}
            <div className="flex-1 flex items-center justify-center p-8">
                {isVideo ? (
                    <video
                        src={currentAsset.bunny_cdn_url}
                        controls
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                ) : (
                    <img
                        src={currentAsset.bunny_cdn_url}
                        alt={currentAsset.alt_text || currentAsset.filename}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                )}
            </div>

            {/* Details sidebar */}
            <div className="w-[320px] bg-white/5 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-6">Media Details</h3>

                {/* Thumbnail */}
                <div className="aspect-video bg-black/30 rounded-lg overflow-hidden mb-6">
                    <img
                        src={currentAsset.bunny_cdn_url}
                        alt={currentAsset.filename}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider">Filename</label>
                        <p className="text-white font-medium mt-1 break-words">{currentAsset.filename}</p>
                    </div>

                    {currentAsset.alt_text && (
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider">Alt Text</label>
                            <p className="text-white/80 mt-1">{currentAsset.alt_text}</p>
                        </div>
                    )}

                    {currentAsset.credits && (
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider">Credits</label>
                            <p className="text-white/80 mt-1">{currentAsset.credits}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider">Dimensions</label>
                            <p className="text-white/80 mt-1">
                                {currentAsset.width && currentAsset.height
                                    ? `${currentAsset.width} × ${currentAsset.height}`
                                    : 'Unknown'}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-white/50 uppercase tracking-wider">Size</label>
                            <p className="text-white/80 mt-1">{formatFileSize(currentAsset.size_bytes)}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider">Type</label>
                        <p className="text-white/80 mt-1">{currentAsset.mime_type}</p>
                    </div>

                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider">Uploaded</label>
                        <p className="text-white/80 mt-1">{formatDate(currentAsset.created_at)}</p>
                    </div>

                    {/* Direct Link */}
                    <div>
                        <label className="text-xs text-white/50 uppercase tracking-wider">Direct Link</label>
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={currentAsset.bunny_cdn_url}
                                readOnly
                                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white/80 truncate"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <a
                                href={currentAsset.bunny_cdn_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(currentAsset)}
                            className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Pencil size={16} />
                            Edit Details
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                </div>

                {/* Navigation indicator */}
                {assets.length > 1 && (
                    <div className="mt-6 text-center text-white/50 text-sm">
                        {currentIndex + 1} of {assets.length}
                    </div>
                )}
            </div>
        </div>
    );
}
