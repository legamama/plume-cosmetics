"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, Badge, Text } from "@/components/ui";
import { formatPrice, getLocalizedValue } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface ProductCardProps {
    product: Product;
    locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    const name = getLocalizedValue(product.name, locale);
    // Use slug if available, otherwise fallback to product ID
    const productSlug = product.slug || product.id;

    return (
        <Link href={getLocalizedHref(`/products/${productSlug}`)}>
            <Card className="group h-full cursor-pointer overflow-hidden">
                {/* Image Container - taller aspect ratio (4:5 instead of 1:1) */}
                <div className="relative aspect-[4/5] overflow-hidden bg-plume-cream rounded-xl">
                    {/* Primary Image */}
                    <motion.div
                        className="absolute inset-0 z-10"
                        animate={{ opacity: 1 }}
                    >
                        <Image
                            src={product.primaryImage || product.thumbnail || product.images[0] || ""}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>

                    {/* Secondary Image (Hover) */}
                    {(product.secondaryImage || product.images[1]) && (
                        <motion.div
                            className="absolute inset-0 z-20"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Image
                                src={product.secondaryImage || product.images[1] || ""}
                                alt={`${name} (View)`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
                        {product.isNew && <Badge variant="new">New</Badge>}
                        {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
                        {product.tags?.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm"
                                style={{
                                    backgroundColor: tag.type === 'system' ? '#1F2937' : tag.color || '#3B82F6'
                                }}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>

                    {/* Dark Gradient Overlay with Product Name */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                        {/* Gradient background - tall enough to cover product name */}
                        <div className="h-24 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                        {/* Product name positioned at bottom of gradient */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-semibold text-white text-lg line-clamp-2 drop-shadow-lg">
                                {name}
                            </h3>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
