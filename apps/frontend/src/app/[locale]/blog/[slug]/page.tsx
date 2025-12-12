import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";
import { placeholderBlogPosts } from "@/types/blog";
import { getLocalizedValue } from "@/lib/utils";
import type { Locale } from "@/i18n/config";

interface Props {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const post = placeholderBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    const title = getLocalizedValue(post.title, locale as Locale);
    const excerpt = getLocalizedValue(post.excerpt, locale as Locale);

    return {
        title: `${title} - Plumé Cosmetics`,
        description: excerpt,
        openGraph: {
            title,
            description: excerpt,
            type: "article",
            images: [post.coverImage],
            publishedTime: post.publishedAt,
            authors: [post.author.name],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    // Find post by slug (replace with Supabase fetch)
    const post = placeholderBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const content = getLocalizedValue(post.content, locale as Locale);

    return (
        <article className="min-h-screen bg-white">
            <BlogHeader post={post} locale={locale as Locale} />

            <Container size="narrow" className="py-12 md:py-16">
                <BlogContent content={content} />
            </Container>
        </article>
    );
}

export async function generateStaticParams() {
    return placeholderBlogPosts.map((post) => ({
        slug: post.slug,
    }));
}
