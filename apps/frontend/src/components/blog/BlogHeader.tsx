"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container, Heading, Text, Badge } from "@/components/ui";
import { formatDate, getLocalizedValue } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import type { Locale } from "@/i18n/config";

interface BlogHeaderProps {
    post: BlogPost;
    locale: Locale;
}

export function BlogHeader({ post, locale }: BlogHeaderProps) {
    const title = getLocalizedValue(post.title, locale);

    const categoryLabels: Record<string, Record<Locale, string>> = {
        skincare: { vi: "Chăm sóc da", en: "Skincare", ko: "스킨케어" },
        tips: { vi: "Mẹo làm đẹp", en: "Beauty Tips", ko: "뷰티 팁" },
        ingredients: { vi: "Thành phần", en: "Ingredients", ko: "성분" },
    };

    return (
        <header className="relative">
            {/* Cover Image */}
            <div className="relative h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden">
                <Image
                    src={post.coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Content Overlay */}
            <Container size="narrow" className="relative -mt-32 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-elevated p-8 md:p-12"
                >
                    {/* Category */}
                    <div className="mb-4">
                        <Badge>{categoryLabels[post.category]?.[locale] || post.category}</Badge>
                    </div>

                    {/* Title */}
                    <Heading as="h1" size="2xl" className="mb-6">
                        {title}
                    </Heading>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-neutral-500">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-plume-blush flex items-center justify-center text-sm font-medium text-plume-rose">
                                {post.author.name.charAt(0)}
                            </div>
                            <span className="font-medium text-plume-charcoal">
                                {post.author.name}
                            </span>
                        </div>

                        <span>•</span>

                        {/* Date */}
                        <span>{formatDate(post.publishedAt, locale)}</span>

                        <span>•</span>

                        {/* Reading time */}
                        <span>{post.readingTime} min read</span>
                    </div>
                </motion.div>
            </Container>
        </header>
    );
}
