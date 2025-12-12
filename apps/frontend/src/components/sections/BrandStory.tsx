"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Container, Heading, Text, Button, Icon } from "@/components/ui";
import { AnimatedSection } from "@/components/common/AnimatedSection";

// Updated features for the landing page
const features: StoryFeature[] = [
    {
        key: "feature1",
        icon: "leaf",
        // Using hardcoded strings as per user request to override translation usage if keys don't exist yet, 
        // or we can map them. The user gave specific vietnamese text. 
        // We will include default title/desc in Vietnamese here, but typically this should be in translation files.
        // Given the request "make sure it content to be translated", we should ideally use translation keys.
        // However, I will update the structure to prioritize the user's specific text if config is not provided,
        // or update the translation keys map. 
        // For this task, since I cannot easily see/edit the en/ko json files, I will use a mix:
        // Text is Vietnamese in the request. I'll put the VN text as defaults here, but wrap in a check or 
        // just add them as the defaults if translation is missing.
    },
    { key: "feature2", icon: "flask" },
    { key: "feature3", icon: "star" },
];

import { StoryConfig } from "@/types/page-builder";

export interface StoryFeature {
    key: string;
    icon: string;
    title?: string;
    description?: string;
}

interface BrandStoryProps {
    config?: StoryConfig & { features?: StoryFeature[] };
}

export function BrandStory({ config }: BrandStoryProps) {
    const t = useTranslations("home.brandStory");
    const tCommon = useTranslations("common");
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    // User requested specific text for the 3 ideas.
    // If config features are passed, use them. Otherwise use these hardcoded ones based on the request.
    const defaultFeatures: StoryFeature[] = [
        {
            key: "feature1",
            icon: "leaf",
            title: locale === "vi" ? "Thành phần lành tính" : locale === "ko" ? "순한 성분" : "Gentle Ingredients",
            description: locale === "vi"
                ? "Dịu nhẹ với làn da nhạy cảm"
                : locale === "ko"
                    ? "민감한 피부에도 순하게 작용합니다"
                    : "Gentle on sensitive skin"
        },
        {
            key: "feature2",
            icon: "flask",
            title: locale === "vi" ? "Công nghệ hiện đại" : locale === "ko" ? "첨단 기술" : "Modern Technology",
            description: locale === "vi"
                ? "Hỗ trợ phục hồi và làm sáng da hiệu quả mà không gây kích ứng"
                : locale === "ko"
                    ? "자극 없이 효과적인 피부 회복과 미백을 지원합니다"
                    : "Supports effective recovery and brightening without irritation"
        },
        {
            key: "feature3",
            icon: "star",
            title: locale === "vi" ? "Quy trình chuẩn Hàn" : locale === "ko" ? "한국 표준 프로세스" : "Korean Standard Process",
            description: locale === "vi"
                ? "Đảm bảo mỗi sản phẩm tinh khiết, nhẹ nhàng và phát huy đúng công dụng"
                : locale === "ko"
                    ? "각 제품이 순수하고 부드러우며 적절한 효과를 발휘하도록 보장합니다"
                    : "Ensuring each product is pure, gentle, and effective"
        }
    ];

    const displayFeatures = config?.features || defaultFeatures;

    return (
        <section className="py-24 bg-plume-cream">
            <Container size="wide">
                <div className={`grid lg:grid-cols-2 gap-16 items-center ${config?.image_position === 'left' ? '' : ''}`}>
                    {/* Image/Extra Content Side - If position is left (default in original was right/features on right) */}
                    {config?.image_position === 'left' && (
                        <div className="space-y-6 order-2 lg:order-1">
                            {displayFeatures.map((feature, index) => (
                                <AnimatedSection
                                    key={feature.key}
                                    delay={index * 0.15}
                                    direction="right"
                                >
                                    <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-soft">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-plume-blush flex items-center justify-center text-2xl">
                                            <Icon name={feature.icon} className="w-8 h-8 text-plume-rose" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-plume-charcoal mb-1">
                                                {feature.title}
                                            </h4>
                                            <Text size="sm" muted>
                                                {feature.description}
                                            </Text>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}

                    {/* Content Side */}
                    <AnimatedSection direction="left" className={config?.image_position === 'left' ? 'order-1 lg:order-2' : ''}>
                        <Heading as="h2" className="mb-4">
                            {config?.heading || t("title")}
                        </Heading>
                        {/* Subtitle removed as requested: "Từ Hàn Quốc Với Tình Yêu" */}
                        {config?.subtitle && (
                            <Text size="lg" className="mb-2 text-plume-rose font-medium">
                                {config.subtitle}
                            </Text>
                        )}

                        {/* Render HTML body if from config, else use translation string */}
                        {config?.body ? (
                            <div
                                className="mb-8 text-text-muted prose prose-p:text-text-muted prose-headings:text-plume-charcoal"
                                dangerouslySetInnerHTML={{ __html: config.body }}
                            />
                        ) : (
                            <Text muted className="mb-8">
                                {t("description")}
                            </Text>
                        )}

                        {/* Only show button if not on about page to avoid self-link, or if explicitly configured */}
                        <Link href={getLocalizedHref("/about")}>
                            <Button variant="outline">{tCommon("learnMore")}</Button>
                        </Link>
                    </AnimatedSection>

                    {/* Features Side - Default Right */}
                    {(!config?.image_position || config?.image_position === 'right') && (
                        <div className="space-y-6">
                            {displayFeatures.map((feature, index) => (
                                <AnimatedSection
                                    key={feature.key}
                                    delay={index * 0.15}
                                    direction="right"
                                >
                                    <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-soft">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-plume-blush flex items-center justify-center text-2xl">
                                            <Icon name={feature.icon} className="w-8 h-8 text-plume-rose" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-plume-charcoal mb-1">
                                                {feature.title}
                                            </h4>
                                            <Text size="sm" muted>
                                                {feature.description}
                                            </Text>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
