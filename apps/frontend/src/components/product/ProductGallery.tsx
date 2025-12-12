"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-square bg-plume-cream rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📷</span>
            </div>
        );
    }

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe Left -> Next
                setSelectedIndex((prev) => (prev + 1) % images.length);
            } else {
                // Swipe Right -> Prev
                setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-square bg-plume-cream rounded-2xl overflow-hidden touch-pan-y"
                style={{ touchAction: 'pan-y' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${productName} - Image ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={selectedIndex === 0}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                                selectedIndex === index
                                    ? "border-plume-rose"
                                    : "border-transparent hover:border-plume-blush"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
