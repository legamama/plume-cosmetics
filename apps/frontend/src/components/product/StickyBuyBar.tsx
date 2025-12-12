"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";
import { formatPrice, getLocalizedValue } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface StickyBuyBarProps {
    product: Product;
    locale: Locale;
}

// Platform-specific styling
const platformStyles: Record<string, { icon: string; gradient: string; hoverGradient: string }> = {
    tiktok: {
        icon: "🎵",
        gradient: "from-[#ff0050] to-[#00f2ea]",
        hoverGradient: "hover:from-[#ff0050]/90 hover:to-[#00f2ea]/90"
    },
    shopee: {
        icon: "🛒",
        gradient: "from-[#ee4d2d] to-[#f96a2a]",
        hoverGradient: "hover:from-[#ee4d2d]/90 hover:to-[#f96a2a]/90"
    },
    lazada: {
        icon: "🛍️",
        gradient: "from-[#0f146d] to-[#f57224]",
        hoverGradient: "hover:from-[#0f146d]/90 hover:to-[#f57224]/90"
    },
    tiki: {
        icon: "📦",
        gradient: "from-[#1a94ff] to-[#0d5bb5]",
        hoverGradient: "hover:from-[#1a94ff]/90 hover:to-[#0d5bb5]/90"
    },
    sendo: {
        icon: "🏪",
        gradient: "from-[#ee2624] to-[#c41e1d]",
        hoverGradient: "hover:from-[#ee2624]/90 hover:to-[#c41e1d]/90"
    },
    website: {
        icon: "🌐",
        gradient: "from-plume-rose to-plume-blush",
        hoverGradient: "hover:from-plume-rose/90 hover:to-plume-blush/90"
    },
};

const buyNowLabels: Record<Locale, string> = {
    vi: "Mua ngay",
    en: "Buy Now",
    ko: "지금 구매",
};

export function StickyBuyBar({ product, locale }: StickyBuyBarProps) {
    const price = getLocalizedValue(product.price, locale);
    const hasPrice = price > 0;
    const name = getLocalizedValue(product.name, locale);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        const footer = document.querySelector('footer');
        if (footer) {
            observer.observe(footer);
        }

        return () => {
            if (footer) {
                observer.unobserve(footer);
            }
        };
    }, []);

    if (product.buyLinks.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: isVisible ? 0 : 100,
                opacity: isVisible ? 1 : 0
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
            <div className="pointer-events-auto">
                {/* Glass background with gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-plume-rose/10 via-white/95 to-plume-blush/10 backdrop-blur-xl" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-plume-rose/30 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        {/* Product info (desktop only) */}
                        <div className="hidden md:flex items-center gap-4 flex-shrink-0 min-w-0">
                            {/* Product thumbnail */}
                            {product.thumbnail && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-plume-cream flex-shrink-0 ring-2 ring-white shadow-md">
                                    <img
                                        src={product.thumbnail}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold text-plume-charcoal truncate text-sm">
                                    {name}
                                </h3>
                                {hasPrice && (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-plume-rose">
                                            {formatPrice(price, product.currency)}
                                        </span>
                                        {product.compareAtPrice && getLocalizedValue(product.compareAtPrice, locale) > 0 && (
                                            <span className="text-xs text-neutral-400 line-through">
                                                {formatPrice(getLocalizedValue(product.compareAtPrice, locale), product.currency)}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile: Price only */}
                        {hasPrice && (
                            <div className="md:hidden flex flex-col items-start flex-shrink-0">
                                <span className="text-xs text-neutral-500">{buyNowLabels[locale]}</span>
                                <span className="text-lg font-bold text-plume-rose">
                                    {formatPrice(price, product.currency)}
                                </span>
                            </div>
                        )}

                        {/* Buy buttons */}
                        <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end flex-wrap">
                            {product.buyLinks.map((link, index) => {
                                const label = getLocalizedValue(link.label, locale);
                                const platformKey = link.platform.toLowerCase().replace(' ', '');
                                const defaultStyle = platformStyles[platformKey] || platformStyles.website;

                                const hoverAnimation = link.hoverColor
                                    ? { scale: 1.02, backgroundColor: link.hoverColor }
                                    : { scale: 1.02, filter: 'brightness(1.1)' };

                                return (
                                    <motion.a
                                        key={link.platform + index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={hoverAnimation}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            inline-flex items-center gap-2 px-4 py-2 rounded-full
                                            text-white font-semibold text-sm
                                            shadow-lg shadow-plume-rose/10
                                            transition-shadow duration-200
                                            whitespace-nowrap flex-shrink-0
                                            ${!link.color ? (
                                                `bg-gradient-to-r ${defaultStyle.gradient} ${defaultStyle.hoverGradient}`
                                            ) : ''}
                                        `}
                                        style={link.color ? { backgroundColor: link.color } : undefined}
                                    >
                                        <span className="text-base">
                                            {link.icon || defaultStyle.icon}
                                        </span>
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{link.platform}</span>
                                        <ExternalLink size={12} className="opacity-70" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
