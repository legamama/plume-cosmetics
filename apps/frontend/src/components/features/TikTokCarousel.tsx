'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { TikTokVisibilityConfig } from '@/lib/site-settings';
import type { TikTokVideo } from '@/lib/tiktok';

interface TikTokCarouselProps {
    videos: TikTokVideo[];
    visibility: TikTokVisibilityConfig;
}

// Extract TikTok video ID from URL
function extractTikTokVideoId(url: string): string | null {
    // Format: https://www.tiktok.com/@username/video/7055411162212633903
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
}

export function TikTokCarousel({ videos, visibility }: TikTokCarouselProps) {
    const t = useTranslations('home.tiktok');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    // Touch handling refs for reliable mobile swipe
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const isSwiping = useRef(false);

    // Calculate visible items based on screen size
    const [itemsPerView, setItemsPerView] = useState(1);

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerView(2);
            } else {
                setItemsPerView(1);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const maxIndex = Math.max(0, videos.length - itemsPerView);

    // When active video index changes, scroll carousel if needed
    useEffect(() => {
        // If active video is not in view, scroll to it
        if (activeVideoIndex < currentIndex) {
            setCurrentIndex(activeVideoIndex);
        } else if (activeVideoIndex >= currentIndex + itemsPerView) {
            setCurrentIndex(Math.min(activeVideoIndex, maxIndex));
        }
    }, [activeVideoIndex, currentIndex, itemsPerView, maxIndex]);

    // Calculate center video index based on carousel position
    const getCenterVideoIndex = useCallback((carouselIndex: number) => {
        // For itemsPerView=1, center is the current index
        // For itemsPerView=2, center is current + 0 (left) or current + 1 (right) - we'll pick left
        // For itemsPerView=3, center is current + 1 (middle)
        const centerOffset = Math.floor(itemsPerView / 2);
        return Math.min(carouselIndex + centerOffset, videos.length - 1);
    }, [itemsPerView, videos.length]);

    const goNext = useCallback(() => {
        const newIndex = Math.min(currentIndex + 1, maxIndex);
        setCurrentIndex(newIndex);
        // Set center video as active when navigating
        setActiveVideoIndex(getCenterVideoIndex(newIndex));
    }, [currentIndex, maxIndex, getCenterVideoIndex]);

    const goPrev = useCallback(() => {
        const newIndex = Math.max(currentIndex - 1, 0);
        setCurrentIndex(newIndex);
        // Set center video as active when navigating
        setActiveVideoIndex(getCenterVideoIndex(newIndex));
    }, [currentIndex, getCenterVideoIndex]);

    const goToIndex = useCallback((index: number) => {
        setCurrentIndex(index);
        // Set center video as active when navigating via dots
        setActiveVideoIndex(getCenterVideoIndex(index));
    }, [getCenterVideoIndex]);

    // Touch event handlers for reliable mobile swipe
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchEndX.current = e.touches[0].clientX;
        isSwiping.current = false;
        setIsDragging(true);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
        const deltaX = Math.abs(touchEndX.current - touchStartX.current);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);

        // If horizontal movement is greater, prevent vertical scroll and mark as swiping
        if (deltaX > deltaY && deltaX > 10) {
            isSwiping.current = true;
            // Only prevent default if we're primarily swiping horizontally
            if (deltaX > 30) {
                e.preventDefault();
            }
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);

        if (!isSwiping.current) return;

        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (diff > threshold && currentIndex < maxIndex) {
            // Swiped left - go next
            goNext();
        } else if (diff < -threshold && currentIndex > 0) {
            // Swiped right - go prev
            goPrev();
        }

        isSwiping.current = false;
    }, [currentIndex, maxIndex, goNext, goPrev]);

    // Handle video click to play
    const handleVideoClick = useCallback((index: number) => {
        setActiveVideoIndex(index);
    }, []);

    // Listen for postMessage from TikTok iframes for video end detection
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // TikTok player sends messages about video state
            if (event.origin.includes('tiktok.com')) {
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    // Check for video end event
                    if (data.type === 'video_end' || data.event === 'ended' || data.state === 'ended') {
                        // Move to next video
                        setActiveVideoIndex(prev => {
                            const next = prev + 1;
                            return next < videos.length ? next : 0; // Loop back to first video
                        });
                    }
                } catch {
                    // Ignore parse errors
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [videos.length]);

    // Auto-advance fallback timer (TikTok videos are typically under 60 seconds)
    useEffect(() => {
        // Set a fallback timer to advance if we don't receive end event
        const timer = setTimeout(() => {
            setActiveVideoIndex(prev => {
                const next = prev + 1;
                return next < videos.length ? next : 0;
            });
        }, 65000); // 65 seconds fallback

        return () => clearTimeout(timer);
    }, [activeVideoIndex, videos.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isInView) return;
            if (e.key === 'ArrowLeft') {
                goPrev();
            } else if (e.key === 'ArrowRight') {
                goNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isInView, goNext, goPrev]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    // Calculate visibility classes
    const visibilityClasses = `
        ${visibility.mobile ? 'block' : 'hidden'}
        ${visibility.tablet ? 'md:block' : 'md:hidden'}
        ${visibility.desktop ? 'lg:block' : 'lg:hidden'}
    `.trim();

    // If completely hidden on all devices, return null (optimization)
    if (!visibility.mobile && !visibility.tablet && !visibility.desktop) {
        return null;
    }

    if (!videos.length) {
        return null;
    }

    return (
        <section
            ref={containerRef}
            className={`py-16 md:py-24 bg-gradient-to-b from-transparent via-plume-cream/20 to-transparent overflow-hidden w-full ${visibilityClasses}`}
            aria-label={t('title')}
        >
            <div className="container mx-auto px-4 w-full max-w-full overflow-hidden">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                            <Play size={14} className="text-white ml-0.5" fill="white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                            {t('handle')}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative">
                    {/* Navigation buttons */}
                    {currentIndex > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={goPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-plume-rose hover:shadow-xl transition-all -translate-x-1/2 md:-translate-x-6"
                            aria-label={t('prevSlide')}
                        >
                            <ChevronLeft size={24} />
                        </motion.button>
                    )}

                    {currentIndex < maxIndex && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={goNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-plume-rose hover:shadow-xl transition-all translate-x-1/2 md:translate-x-6"
                            aria-label={t('nextSlide')}
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    )}

                    {/* Mute/Unmute button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={toggleMute}
                        className="absolute right-4 top-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </motion.button>

                    {/* Left fade gradient for infinite look - hidden on first slide */}
                    {currentIndex > 0 && (
                        <div
                            className="absolute left-0 top-0 bottom-0 w-12 md:w-20 z-[5] pointer-events-none"
                            style={{
                                background: 'linear-gradient(to right, #FFF8F3, transparent)'
                            }}
                        />
                    )}

                    {/* Right fade gradient for infinite look - hidden on last slide */}
                    {currentIndex < maxIndex && (
                        <div
                            className="absolute right-0 top-0 bottom-0 w-12 md:w-20 z-[5] pointer-events-none"
                            style={{
                                background: 'linear-gradient(to left, #FFF8F3, transparent)'
                            }}
                        />
                    )}

                    {/* Video container with swipe support - using native touch handlers for reliable mobile swipe */}
                    <div
                        ref={carouselRef}
                        className="overflow-hidden mx-4 md:mx-8 touch-pan-y"
                        style={{ touchAction: 'pan-y' }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <motion.div
                            className="flex gap-4 md:gap-6"
                            animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {videos.map((video, index) => {
                                const videoId = extractTikTokVideoId(video.url);
                                const isActive = index === activeVideoIndex;

                                return (
                                    <motion.div
                                        key={video.id}
                                        className="flex-shrink-0"
                                        style={{
                                            width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)`
                                        }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }}
                                    >
                                        {/* No card wrapper - direct video embed */}
                                        <div
                                            className={`
                                                relative overflow-hidden rounded-xl
                                                ${isDragging ? 'pointer-events-none' : ''}
                                                ${isActive ? 'ring-2 ring-plume-rose ring-offset-2' : ''}
                                            `}
                                            onClick={() => handleVideoClick(index)}
                                        >
                                            {videoId ? (
                                                <TikTokPlayerEmbed
                                                    videoId={videoId}
                                                    autoplay={isActive}
                                                    muted={isMuted}
                                                    isActive={isActive}
                                                />
                                            ) : (
                                                <VideoPlaceholder />
                                            )}

                                            {/* Play overlay for inactive videos */}
                                            {!isActive && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
                                                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                        <Play size={24} className="text-gray-800 ml-1" fill="currentColor" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Dots indicator */}
                    {videos.length > itemsPerView && (
                        <div className="flex justify-center gap-2 mt-8" role="tablist">
                            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'w-8 bg-gradient-to-r from-plume-rose to-pink-400'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={t('goToSlide', { number: index + 1 })}
                                    aria-selected={index === currentIndex}
                                    role="tab"
                                />
                            ))}
                        </div>
                    )}


                </div>
            </div>
        </section>
    );
}

// Custom TikTok Player Embed using iframe API
interface TikTokPlayerEmbedProps {
    videoId: string;
    autoplay: boolean;
    muted: boolean;
    isActive: boolean;
}

import { forwardRef } from 'react';

const TikTokPlayerEmbed = forwardRef<HTMLIFrameElement, TikTokPlayerEmbedProps>(
    function TikTokPlayerEmbed({ videoId, autoplay, muted, isActive }, ref) {
        // TikTok Player API URL with parameters:
        // - autoplay: 1 to autoplay, 0 to not
        // - muted: 1 to mute, 0 to unmute (autoplay requires muted=1 on most browsers)
        // - rel: 0 to show only videos from same author (prevents other brand videos)
        // - loop: 0 to not loop (we handle advancement ourselves)
        const playerUrl = `https://www.tiktok.com/player/v1/${videoId}?autoplay=${autoplay && isActive ? 1 : 0}&muted=${muted ? 1 : 0}&rel=0&loop=0&controls=1`;

        return (
            <div className="aspect-[9/16] w-full">
                <iframe
                    ref={ref}
                    src={playerUrl}
                    className="w-full h-full border-0 pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="TikTok Video"
                />
            </div>
        );
    }
);

// Shimmer loading placeholder
function VideoPlaceholder() {
    return (
        <div className="aspect-[9/16] bg-gradient-to-b from-gray-100 to-gray-200 relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                }}
            />

            {/* Content placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <Play size={24} className="text-plume-rose/50 ml-1" />
                    </div>
                    <div className="h-3 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
            </div>
        </div>
    );
}
