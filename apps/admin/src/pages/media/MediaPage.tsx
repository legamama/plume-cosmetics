import { useEffect, useState } from 'react';
import { MediaGrid } from '../../components/media/MediaGrid';
import { MediaUploader } from '../../components/media/MediaUploader';
import { MediaViewerModal } from '../../components/media/MediaViewerModal';
import { MediaEditModal } from '../../components/media/MediaEditModal';
import { useMedia } from '../../hooks/useMedia';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RefreshCw } from 'lucide-react';
import type { MediaAsset } from '../../types/media';
import { StorageUsagePanel } from '../../components/media/StorageUsagePanel';

export function MediaPage() {
    const { media, fetchMedia, isLoading, deleteMedia, updateMedia } = useMedia();
    const toast = useToast();

    // Viewer modal state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const handleView = (_asset: MediaAsset, index: number) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };

    const handleEdit = (asset: MediaAsset) => {
        setEditingAsset(asset);
        setEditModalOpen(true);
    };

    const handleSave = async (id: string, data: { filename?: string; alt_text?: string; credits?: string }) => {
        try {
            await updateMedia(id, data);
            toast.success('Media details updated successfully!');
        } catch {
            toast.error('Failed to update media details');
            throw new Error('Update failed');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMedia(id);
            toast.success('Media deleted successfully');
        } catch {
            toast.error('Failed to delete media');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-text-primary">Media Library</h1>
                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RefreshCw size={16} />}
                    onClick={() => fetchMedia()}
                    isLoading={isLoading}
                >
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card>
                        <div className="p-4 space-y-6">
                            {/* Inline Upload Area */}
                            <MediaUploader
                                compact
                                onUploadComplete={() => {
                                    fetchMedia();
                                }}
                            />

                            {/* Media Grid */}
                            {isLoading && media.length === 0 ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-plume-coral border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : media.length === 0 ? (
                                <div className="text-center py-20 text-text-muted">
                                    <p>No media found. Upload your first file above!</p>
                                </div>
                            ) : (
                                <MediaGrid
                                    assets={media}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <StorageUsagePanel />
                </div>
            </div>

            {/* Viewer Modal */}
            <MediaViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                assets={media}
                initialIndex={viewerIndex}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Edit Modal */}
            <MediaEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingAsset(null);
                }}
                asset={editingAsset}
                onSave={handleSave}
            />
        </div>
    );
}

