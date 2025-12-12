
import { useState, useEffect } from 'react';
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, ExternalLink, Video, ToggleLeft, ToggleRight, Play, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { GlassPanel } from '@/components/ui/glass/GlassPanel';
import { GlassButton } from '@/components/ui/glass/GlassButton';
import { GlassInput } from '@/components/ui/glass/GlassInput';
import { useToast } from '@/context/ToastContext';
import { useConfirmDialog } from '@/context/ConfirmDialogContext';
import { tiktokService, type TikTokVideo, type TikTokVisibilityConfig } from '@/services/tiktok';

// Extract video ID and username from TikTok URL
function parseTikTokUrl(url: string): { videoId: string | null; username: string | null } {
    try {
        // Match patterns like: tiktok.com/@username/video/1234567890
        const match = url.match(/@([^/]+)\/video\/(\d+)/);
        if (match) {
            return { username: match[1], videoId: match[2] };
        }
        // Match short URLs like vm.tiktok.com/XXXXX
        const shortMatch = url.match(/vm\.tiktok\.com\/([^/?]+)/);
        if (shortMatch) {
            return { username: null, videoId: shortMatch[1] };
        }
    } catch {
        // Ignore parsing errors
    }
    return { username: null, videoId: null };
}



export function TikTokFeedPage() {
    const [videos, setVideos] = useState<TikTokVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [visibilityConfig, setVisibilityConfig] = useState<TikTokVisibilityConfig>({
        mobile: true,
        tablet: true,
        desktop: true
    });
    const [isTogglingSection, setIsTogglingSection] = useState(false);
    const toast = useToast();
    const { confirm } = useConfirmDialog();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ url: string }>();

    useEffect(() => {
        loadVideos();
        loadSectionVisibility();
    }, []);

    async function loadVideos() {
        try {
            setIsLoading(true);
            const data = await tiktokService.getAll();
            setVideos(data);
        } catch (error) {
            console.error('Failed to load videos:', error);
            toast.error('Failed to load TikTok videos');
        } finally {
            setIsLoading(false);
        }
    }

    async function loadSectionVisibility() {
        try {
            const config = await tiktokService.getSectionVisibility();
            setVisibilityConfig(config);
        } catch (error) {
            console.error('Failed to load section visibility:', error);
        }
    }

    async function handleToggleVisibility(device: keyof TikTokVisibilityConfig) {
        try {
            setIsTogglingSection(true);
            const newConfig = { ...visibilityConfig, [device]: !visibilityConfig[device] };
            await tiktokService.setSectionVisibility(newConfig);
            setVisibilityConfig(newConfig);
            toast.success(`TikTok feed is now ${newConfig[device] ? 'visible' : 'hidden'} on ${device}`);
        } catch (error) {
            console.error('Failed to toggle visibility:', error);
            toast.error('Failed to update visibility');
        } finally {
            setIsTogglingSection(false);
        }
    }

    const onReorder = (newOrder: TikTokVideo[]) => {
        setVideos(newOrder); // Optimistic update

        // update order in backend
        tiktokService.updateOrder(newOrder).catch((err) => {
            console.error("Reorder failed", err);
            toast.error("Failed to save order");
            loadVideos(); // revert
        });
    };

    const onSubmit = async (data: { url: string }) => {
        if (!data.url.includes('tiktok.com')) {
            toast.error('Please enter a valid TikTok URL');
            return;
        }

        try {
            setIsSaving(true);
            const newVideo = await tiktokService.add(data.url);
            setVideos([...videos, newVideo]);
            setIsAdding(false);
            reset();
            toast.success('Video added successfully');
        } catch (error) {
            console.error('Failed to add video:', error);
            toast.error('Failed to add video');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: 'Delete Video',
            message: 'Are you sure you want to remove this video from the feed?',
            confirmText: 'Delete',
            variant: 'danger',
        });

        if (!isConfirmed) return;

        try {
            await tiktokService.delete(id);
            setVideos(videos.filter(v => v.id !== id));
            toast.success('Video deleted');
        } catch (error) {
            console.error('Failed to delete video:', error);
            toast.error('Failed to delete video');
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            // Optimistic
            setVideos(videos.map(v => v.id === id ? { ...v, is_enabled: newStatus } : v));

            await tiktokService.toggle(id, newStatus);
        } catch (error) {
            console.error("Toggle failed", error);
            toast.error("Failed to update status");
            loadVideos(); // revert
        }
    };

    async function handleBulkToggle(enableAll: boolean) {
        // ... (implementation remains same)
        if (videos.length === 0) return;

        try {
            // Optimistic update
            setVideos(videos.map(v => ({ ...v, is_enabled: enableAll })));

            // Update all videos
            await Promise.all(videos.map(v => tiktokService.toggle(v.id, enableAll)));
            toast.success(enableAll ? 'All videos enabled' : 'All videos disabled');
        } catch (error) {
            console.error("Bulk toggle failed", error);
            toast.error("Failed to update videos");
            loadVideos(); // revert
        }
    };

    const enabledCount = videos.filter(v => v.is_enabled).length;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Section Visibility Toggles */}
            <GlassPanel className="p-5">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                            <Eye size={20} className="text-plume-rose" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">Feed Visibility</h3>
                            <p className="text-sm text-gray-500">
                                Control where the TikTok feed appears on your website.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mobile Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Mobile</span>
                            <button
                                onClick={() => handleToggleVisibility('mobile')}
                                disabled={isTogglingSection}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-plume-rose/50 focus:ring-offset-2
                                    ${visibilityConfig.mobile ? 'bg-green-500' : 'bg-gray-300'}
                                    ${isTogglingSection ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                                        ${visibilityConfig.mobile ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>

                        {/* Tablet Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Tablet</span>
                            <button
                                onClick={() => handleToggleVisibility('tablet')}
                                disabled={isTogglingSection}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-plume-rose/50 focus:ring-offset-2
                                    ${visibilityConfig.tablet ? 'bg-green-500' : 'bg-gray-300'}
                                    ${isTogglingSection ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                                        ${visibilityConfig.tablet ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>

                        {/* Desktop Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Desktop</span>
                            <button
                                onClick={() => handleToggleVisibility('desktop')}
                                disabled={isTogglingSection}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-plume-rose/50 focus:ring-offset-2
                                    ${visibilityConfig.desktop ? 'bg-green-500' : 'bg-gray-300'}
                                    ${isTogglingSection ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                                        ${visibilityConfig.desktop ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </GlassPanel>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-light text-gray-900 mb-2">TikTok Feed</h1>
                    <p className="text-gray-500">
                        Manage videos appearing on the landing page carousel.
                        {videos.length > 0 && (
                            <span className="ml-2 text-sm">
                                ({enabledCount} of {videos.length} active)
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {videos.length > 0 && (
                        <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm overflow-hidden">
                            {/* Enable All Button */}
                            <button
                                onClick={() => handleBulkToggle(true)}
                                disabled={enabledCount === videos.length}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all
                                    ${enabledCount === videos.length
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}
                                `}
                                title="Enable all videos"
                            >
                                <ToggleRight size={18} />
                                <span className="hidden sm:inline">Enable All</span>
                            </button>

                            {/* Divider */}
                            <div className="w-px h-8 bg-gray-200" />

                            {/* Disable All Button */}
                            <button
                                onClick={() => handleBulkToggle(false)}
                                disabled={enabledCount === 0}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all
                                    ${enabledCount === 0
                                        ? 'bg-gray-100 text-gray-500 cursor-default'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
                                `}
                                title="Disable all videos"
                            >
                                <ToggleLeft size={18} />
                                <span className="hidden sm:inline">Disable All</span>
                            </button>
                        </div>
                    )}
                    <GlassButton variant="primary" onClick={() => setIsAdding(true)}>
                        <Plus size={20} className="mr-2" />
                        Add Video
                    </GlassButton>
                </div>
            </div>

            {/* Add Video Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GlassPanel className="p-6 mb-8">
                            <h3 className="text-lg font-medium mb-4">Add New Video</h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <GlassInput
                                        placeholder="https://www.tiktok.com/@user/video/..."
                                        {...register('url', { required: true })}
                                        error={errors.url ? 'URL is required' : undefined}
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        Paste the full URL of the TikTok video.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <GlassButton type="submit" variant="secondary" disabled={isSaving}>
                                        {isSaving ? 'Adding...' : 'Add to Feed'}
                                    </GlassButton>
                                    <GlassButton type="button" variant="ghost" onClick={() => { setIsAdding(false); reset(); }}>
                                        Cancel
                                    </GlassButton>
                                </div>
                            </form>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video List */}
            <GlassPanel>
                {isLoading ? (
                    // Loading Skeleton
                    <div className="space-y-4 p-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-white/40 bg-white/20 animate-pulse">
                                <div className="w-6 h-8 bg-gray-200 rounded" />
                                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                                <div className="w-20 h-8 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : videos.length === 0 ? (
                    // Empty State
                    <div className="p-16 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                            <Video size={40} className="text-plume-rose opacity-60" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos added yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            Add TikTok videos to showcase them in a beautiful carousel on your landing page.
                        </p>
                        <GlassButton variant="primary" onClick={() => setIsAdding(true)}>
                            <Plus size={18} className="mr-2" />
                            Add Your First Video
                        </GlassButton>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={videos} onReorder={onReorder} className="space-y-3 p-4">
                        {videos.map((video) => (
                            <TikTokItem
                                key={video.id}
                                video={video}
                                onDelete={() => handleDelete(video.id)}
                                onToggle={() => handleToggle(video.id, video.is_enabled)}
                            />
                        ))}
                    </Reorder.Group>
                )}
            </GlassPanel>

            {/* Tips Section */}
            {videos.length > 0 && (
                <div className="text-center text-sm text-gray-400">
                    <p>💡 Drag videos to reorder. The order here matches the carousel on your landing page.</p>
                </div>
            )}
        </div>
    );
}

function TikTokItem({ video, onDelete, onToggle }: { video: TikTokVideo, onDelete: () => void, onToggle: () => void }) {
    const controls = useDragControls();
    const { username, videoId } = parseTikTokUrl(video.url);
    const [showPreview, setShowPreview] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <Reorder.Item value={video} dragListener={false} dragControls={controls}>
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`
                    flex items-center gap-4 p-4 rounded-xl border border-white/40 bg-white/50 backdrop-blur-sm
                    transition-all hover:bg-white/70 hover:shadow-md group
                    ${!video.is_enabled ? 'opacity-60 grayscale' : ''}
                `}
            >
                {/* Drag Handle */}
                <div
                    className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none rounded-lg hover:bg-gray-100 transition-colors"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <GripVertical size={20} />
                </div>

                {/* Thumbnail/Preview - Clickable to show preview modal */}
                <div
                    className="w-20 h-28 rounded-lg bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex-shrink-0 overflow-hidden border border-white/60 cursor-pointer hover:ring-2 hover:ring-plume-rose/50 transition-all relative group/thumb"
                    onClick={() => setShowPreview(true)}
                    title="Click to preview"
                >
                    {videoId && !imageError ? (
                        <>
                            {/* TikTok Player iframe as thumbnail */}
                            <iframe
                                src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=0&muted=1&controls=0&loop=0&rel=0`}
                                className="w-full h-full border-0 pointer-events-none"
                                title="TikTok Preview"
                                onError={() => setImageError(true)}
                            />
                            {/* Hover overlay with play icon */}
                            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 flex items-center justify-center transition-colors">
                                <Play size={20} className="text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" fill="white" />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Play size={20} className="text-plume-rose/70" />
                        </div>
                    )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {username && (
                            <span className="text-sm font-medium text-gray-700">
                                @{username}
                            </span>
                        )}
                        <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-plume-rose transition-colors"
                            title="Open in TikTok"
                        >
                            <ExternalLink size={14} />
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${video.is_enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                            {video.is_enabled ? 'Active' : 'Disabled'}
                        </span>
                        {videoId && (
                            <span className="truncate max-w-[180px]" title={videoId}>
                                ID: {videoId}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onToggle}
                        className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${video.is_enabled
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                        `}
                    >
                        {video.is_enabled ? 'Disable' : 'Enable'}
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete video"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </motion.div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && videoId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                ×
                            </button>

                            {/* Video Player */}
                            <div className="aspect-[9/16]">
                                <iframe
                                    src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=1&muted=0&controls=1&loop=1&rel=0`}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="TikTok Video Preview"
                                />
                            </div>

                            {/* Video info footer */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        {username && (
                                            <p className="font-medium text-gray-900">@{username}</p>
                                        )}
                                        <p className="text-xs text-gray-400">ID: {videoId}</p>
                                    </div>
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-plume-rose hover:underline"
                                    >
                                        Open in TikTok
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
}
