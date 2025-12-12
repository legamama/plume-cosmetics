"use client";

import { cn } from "@/lib/cn";

interface BlogContentProps {
    content: string;
    className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
    return (
        <div
            className={cn(
                "prose prose-neutral prose-lg max-w-none",
                "prose-headings:font-display prose-headings:text-plume-charcoal",
                "prose-a:text-plume-rose prose-a:no-underline hover:prose-a:underline",
                "prose-img:rounded-xl prose-img:shadow-soft",
                "prose-blockquote:border-l-plume-rose prose-blockquote:bg-plume-cream/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
