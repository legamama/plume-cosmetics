
import { setRequestLocale, getTranslations } from "next-intl/server";

export const revalidate = 60;
import { HeroPrimary } from "@/components/sections/HeroPrimary";
import { BrandStory, type StoryFeature } from "@/components/sections/BrandStory";
import { CTABanner } from "@/components/sections/CTABanner";
import type { HeroPrimaryConfig, StoryConfig, CTABannerConfig } from "@/types/page-builder";
import type { Locale } from "@/i18n/config";
import { getStaticPageContent } from "@/lib/api";

interface Props {
    params: Promise<{ locale: string }>;
}

function getAboutPageConfig(locale: Locale) {
    // Hero Configuration
    const heroConfig: HeroPrimaryConfig = {
        title: locale === "vi"
            ? "Vẻ đẹp khởi nguồn từ thiên nhiên"
            : locale === "ko"
                ? "자연에서 시작되는 아름다움"
                : "Beauty Originates from Nature",
        subtitle: locale === "vi"
            ? "Hành trình đánh thức vẻ đẹp tiềm ẩn của bạn"
            : locale === "ko"
                ? "당신의 숨겨진 아름다움을 깨우는 여정"
                : "The journey to awaken your hidden beauty",
        ctaLabel: locale === "vi" ? "Khám Phá Ngay" : locale === "ko" ? "지금 확인하기" : "Explore Now",
        ctaLink: "/products",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80", // Reusing same nice image or could update
        backgroundColor: "#f8f5f0",
        isEnabled: true,
        // No overlay card for About page to keep it slightly cleaner/different
    };

    // Mission & Values Configuration
    const missionConfig: StoryConfig & { features: StoryFeature[] } = {
        heading: locale === "vi" ? "Sứ Mệnh Của Chúng Tôi" : locale === "ko" ? "우리의 사명" : "Our Mission",
        subtitle: locale === "vi" ? "Cam kết chất lượng" : locale === "ko" ? "품질에 대한 약속" : "Quality Commitment",
        body: locale === "vi"
            ? "Plumé cam kết mang đến những sản phẩm chăm sóc da tinh khiết nhất, kết hợp giữa bí quyết làm đẹp truyền thống Hàn Quốc và công nghệ hiện đại."
            : locale === "ko"
                ? "Plumé는 한국의 전통적인 미용 비법과 현대 기술을 결합하여 가장 순수한 스킨케어 제품을 제공하기 위해 최선을 다하고 있습니다."
                : "Plumé is committed to delivering the purest skincare products, combining traditional Korean beauty secrets with modern technology.",
        image_position: "left", // Text on right, features on left (or via CSS order) - wait, BrandStory logic: if left, features are shown on left.
        isEnabled: true,
        features: [
            {
                key: "safety",
                icon: "🌿",
                title: locale === "vi" ? "An Toàn Tuyệt Đối" : locale === "ko" ? "절대적인 안전" : "Absolute Safety",
                description: locale === "vi" ? "Không chứa hóa chất độc hại, an toàn cho mọi loại da." : locale === "ko" ? "유해 화학 물질 무첨가, 모든 피부 타입에 안전합니다." : "Free from harmful chemicals, safe for all skin types."
            },
            {
                key: "tech",
                icon: "🔬",
                title: locale === "vi" ? "Công Nghệ Tiên Tiến" : locale === "ko" ? "첨단 기술" : "Advanced Technology",
                description: locale === "vi" ? "Nghiên cứu và phát triển bởi các chuyên gia hàng đầu." : locale === "ko" ? "최고의 전문가들에 의한 연구 및 개발." : "Researched and developed by top experts."
            },
            {
                key: "efficacy",
                icon: "✨",
                title: locale === "vi" ? "Hiệu Quả Cao" : locale === "ko" ? "높은 효능" : "High Efficacy",
                description: locale === "vi" ? "Đã được kiểm chứng lâm sàng về hiệu quả dưỡng da." : locale === "ko" ? "피부 관리 효능에 대해 임상적으로 입증되었습니다." : "Clinically proven for skincare effectiveness."
            }
        ]
    };

    // Origin Configuration
    const originConfig: StoryConfig = {
        heading: locale === "vi" ? "Xuất Xứ Hàn Quốc" : locale === "ko" ? "한국산" : "Korean Origin",
        subtitle: locale === "vi" ? "Cái nôi làm đẹp" : locale === "ko" ? "뷰티의 요람" : "The Cradle of Beauty",
        body: locale === "vi"
            ? "100% nguyên liệu và quy trình sản xuất được thực hiện tại Hàn Quốc, cái nôi của ngành công nghiệp mỹ phẩm Châu Á. Chúng tôi tự hào mang đến chất lượng chuẩn Hàn cho làn da Việt."
            : locale === "ko"
                ? "100% 원료와 생산 공정이 아시아 화장품 산업의 요람인 한국에서 이루어집니다. 베트남 피부를 위해 한국 표준 품질을 제공하게 되어 자랑스럽습니다."
                : "100% of ingredients and production processes are conducted in Korea, the cradle of the Asian cosmetics industry. We are proud to bring Korean standard quality to you.",
        image_position: "right", // Standard layout
        isEnabled: true,
    };

    // CTA Banner Configuration
    const ctaConfig: CTABannerConfig = {
        heading: locale === "vi"
            ? "Sẵn Sàng Cho Làn Da Mơ Ước?"
            : locale === "ko"
                ? "꿈꾸던 피부를 위한 준비가 되셨나요?"
                : "Ready For Your Dream Skin?",
        subheading: locale === "vi"
            ? "Nuôi dưỡng vẻ đẹp tự nhiên bằng sự tinh tế và khoa học."
            : locale === "ko"
                ? "정교함과 과학으로 자연스러운 아름다움을 가꾸세요."
                : "Nurture natural beauty with sophistication and science.",
        button_label: locale === "vi" ? "Mua Ngay" : locale === "ko" ? "지금 쇼핑하기" : "Shop Now",
        button_url: "/products",
        isEnabled: true,
    };

    return { heroConfig, missionConfig, originConfig, ctaConfig };
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.about" });
    const staticData = await getStaticPageContent('about', locale);

    return {
        title: staticData?.seo_title || t("title"),
        description: staticData?.seo_description || t("description"),
        openGraph: staticData?.seo_og_image_url ? {
            images: [{ url: staticData.seo_og_image_url }]
        } : undefined
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const [defaultConfig, staticData] = await Promise.all([
        Promise.resolve(getAboutPageConfig(locale as Locale)),
        getStaticPageContent('about', locale)
    ]);

    const slots = staticData?.slots || {};

    // Merge content
    const heroConfig = {
        ...defaultConfig.heroConfig,
        title: slots['hero.title'] ?? defaultConfig.heroConfig.title,
        subtitle: slots['hero.subtitle'] ?? defaultConfig.heroConfig.subtitle,
        ctaLabel: slots['hero.ctaLabel'] ?? defaultConfig.heroConfig.ctaLabel,
        ctaLink: slots['hero.ctaLink'] ?? defaultConfig.heroConfig.ctaLink,
    };

    const missionConfig = {
        ...defaultConfig.missionConfig,
        heading: slots['mission.heading'] ?? defaultConfig.missionConfig.heading,
        subtitle: slots['mission.subtitle'] ?? defaultConfig.missionConfig.subtitle,
        body: slots['mission.body'] ?? defaultConfig.missionConfig.body,
    };

    const originConfig = {
        ...defaultConfig.originConfig,
        heading: slots['origin.heading'] ?? defaultConfig.originConfig.heading,
        subtitle: slots['origin.subtitle'] ?? defaultConfig.originConfig.subtitle,
        body: slots['origin.body'] ?? defaultConfig.originConfig.body,
    };

    const ctaConfig = {
        ...defaultConfig.ctaConfig,
        heading: slots['ctaBanner.heading'] ?? defaultConfig.ctaConfig.heading,
        subheading: slots['ctaBanner.subheading'] ?? defaultConfig.ctaConfig.subheading,
        button_label: slots['ctaBanner.button_label'] ?? defaultConfig.ctaConfig.button_label,
        button_url: slots['ctaBanner.button_url'] ?? defaultConfig.ctaConfig.button_url,
    };

    return (
        <>
            <HeroPrimary config={heroConfig} />

            {/* Mission & Values Section */}
            <BrandStory config={missionConfig} />

            {/* Origin Section - Reusing BrandStory with different content/layout */}
            <BrandStory config={originConfig} />

            <CTABanner config={ctaConfig} />
        </>
    );
}
