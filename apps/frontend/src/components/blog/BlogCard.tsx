"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, Text, Badge } from "@/components/ui";
import { formatDate, getLocalizedValue } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import type { Locale } from "@/i18n/config";

interface BlogCardProps {
    post: BlogPost;
    locale: Locale;
}

export function BlogCard({ post, locale }: BlogCardProps) {
    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    const title = getLocalizedValue(post.title, locale);
    const excerpt = getLocalizedValue(post.excerpt, locale);

    const categoryLabels: Record<string, Record<Locale, string>> = {
        skincare: { vi: "Chăm sóc da", en: "Skincare", ko: "스킨케어" },
        tips: { vi: "Mẹo làm đẹp", en: "Beauty Tips", ko: "뷰티 팁" },
        ingredients: { vi: "Thành phần", en: "Ingredients", ko: "성분" },
    };

    return (
        <Link href={getLocalizedHref(`/blog/${post.slug}`)}>
            <Card className="group h-full cursor-pointer overflow-hidden">
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge>{categoryLabels[post.category]?.[locale] || post.category}</Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <span>{formatDate(post.publishedAt, locale)}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                    </div>

                    <h3 className="font-semibold text-lg text-plume-charcoal line-clamp-2 group-hover:text-plume-rose transition-colors">
                        {title}
                    </h3>

                    <Text size="sm" muted className="line-clamp-3">
                        {excerpt}
                    </Text>
                </CardContent>
            </Card>
        </Link>
    );
}
