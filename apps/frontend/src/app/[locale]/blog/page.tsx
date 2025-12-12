import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Heading, Text } from "@/components/ui";
import { BlogCard } from "@/components/blog/BlogCard";
import { placeholderBlogPosts } from "@/types/blog";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/common/AnimatedSection";
import type { Locale } from "@/i18n/config";

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.blog" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: "blog" });

    // Placeholder: Replace with Supabase fetch
    const posts = placeholderBlogPosts;

    return (
        <section className="py-24 bg-plume-cream min-h-screen">
            <Container size="wide">
                {/* Header */}
                <AnimatedSection className="text-center mb-16">
                    <Heading as="h1" className="mb-4">
                        {t("title")}
                    </Heading>
                    <Text size="lg" muted className="max-w-2xl mx-auto">
                        {t("subtitle")}
                    </Text>
                </AnimatedSection>

                {/* Blog Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <StaggerItem key={post.id}>
                            <BlogCard post={post} locale={locale as Locale} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
}
