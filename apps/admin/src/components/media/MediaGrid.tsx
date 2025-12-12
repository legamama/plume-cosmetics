import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { MediaAsset } from '../../types/media';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

interface MediaGridProps {
    assets: MediaAsset[];
    onSelect?: (asset: MediaAsset) => void;
    selectedIds?: string[];
    onDelete?: (id: string) => void;
    onView?: (asset: MediaAsset, index: number) => void;
    onEdit?: (asset: MediaAsset) => void;
}

export function MediaGrid({
    assets,
    onSelect,
    selectedIds = [],
    onDelete,
    onView,
    onEdit
}: MediaGridProps) {
    const { confirm } = useConfirmDialog();

    const handleDelete = async (e: React.MouseEvent, asset: MediaAsset) => {
        e.stopPropagation();
        const confirmed = await confirm({
            title: 'Delete Asset',
            message: 'Are you sure you want to delete this asset? This action cannot be undone.',
            details: asset.filename,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });
        if (confirmed && onDelete) {
            onDelete(asset.id);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((asset, index) => {
                const isSelected = selectedIds.includes(asset.id);

                return (
                    <div
                        key={asset.id}
                        className={`
                            relative group aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all
                            ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200 hover:border-gray-300'}
                        `}
                        onClick={() => {
                            if (onSelect) {
                                onSelect(asset);
                            } else if (onView) {
                                onView(asset, index);
                            }
                        }}
                    >
                        <img
                            src={asset.public_url}
                            alt={asset.alt_text || asset.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Overlay for actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {onView && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(asset, index);
                                    }}
                                    className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                                    title="View"
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(asset);
                                    }}
                                    className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => handleDelete(e, asset)}
                                    className="p-2.5 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filename Badge */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs truncate">{asset.filename}</p>
                            <p className="text-white/60 text-[10px]">
                                {asset.width && asset.height ? `${asset.width}×${asset.height}` : 'IMG'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

