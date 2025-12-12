import { setRequestLocale, getTranslations } from "next-intl/server";

export const revalidate = 60;

// Section Components with Framer Motion animations
import { HeroPrimary } from "@/components/sections/HeroPrimary";
import { CategoryRow } from "@/components/sections/CategoryRow";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { BestSellers } from "@/components/sections/BestSellers";
import { BrandStory } from "@/components/sections/BrandStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQTeaser } from "@/components/sections/FAQTeaser";
import { CTABanner } from "@/components/sections/CTABanner";
import { TikTokCarousel } from "@/components/features/TikTokCarousel";

// Types
import type { Locale } from "@/i18n/config";
import type {
    HeroPrimaryConfig,
    CategoryRowConfig,
    LaunchOfferConfig,
    BestSellersConfig,
    StoryConfig,
    TestimonialsConfig,
    FAQConfig,
    CTABannerConfig,
} from "@/types/page-builder";

interface Props {
    params: Promise<{ locale: string }>;
}

// ============================================================
// STATIC HOME PAGE CONFIGURATION
// ============================================================
// This page is hand-coded with Framer Motion animations.
// Content can be customized here or made dynamic via Supabase if needed.
// All section components accept config props and are also registered
// as Plasmic code components for use in Plasmic-driven pages.
// ============================================================

function getHomePageConfig(locale: Locale) {
    // Hero Configuration
    const heroConfig: HeroPrimaryConfig = {
        title: locale === "vi"
            ? "Vẻ Đẹp Tự Nhiên, Rạng Ngời Mỗi Ngày"
            : locale === "ko"
                ? "매일 빛나는 자연스러운 아름다움"
                : "Natural Beauty, Radiant Every Day",
        subtitle: locale === "vi"
            ? "Khám phá bộ sưu tập mỹ phẩm K-Beauty cao cấp được tuyển chọn kỹ lưỡng, mang đến làn da khỏe đẹp rạng rỡ."
            : locale === "ko"
                ? "건강하고 빛나는 피부를 위해 엄선된 프리미엄 K-Beauty 컬렉션을 만나보세요."
                : "Discover our curated collection of premium K-Beauty products for healthy, radiant skin.",
        ctaLabel: locale === "vi" ? "Khám Phá Ngay" : locale === "ko" ? "지금 쇼핑하기" : "Shop Now",
        ctaLink: "/products",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
        backgroundColor: "#f8f5f0",
        isEnabled: true,
        overlayCard: {
            title: locale === "vi" ? "Serum Vitamin C" : locale === "ko" ? "비타민 C 세럼" : "Vitamin C Serum",
            description: locale === "vi" ? "Bestseller #1" : locale === "ko" ? "베스트셀러 #1" : "Bestseller #1",
        },
    };

    // Category Row Configuration
    const categoryConfig: CategoryRowConfig = {
        isEnabled: true,
        categories: [
            {
                id: "skincare",
                label: locale === "vi" ? "Dưỡng Da" : locale === "ko" ? "스킨케어" : "Skincare",
                href: "/products?category=skincare",
                image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80",
            },
            {
                id: "bodycare",
                label: locale === "vi" ? "Chăm Sóc Cơ Thể" : locale === "ko" ? "바디케어" : "Body Care",
                href: "/products?category=bodycare",
                image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80",
            },
            {
                id: "masks",
                label: locale === "vi" ? "Mặt Nạ" : locale === "ko" ? "마스크" : "Masks",
                href: "/products?category=masks",
                image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
            },
            {
                id: "suncare",
                label: locale === "vi" ? "Chống Nắng" : locale === "ko" ? "선케어" : "Sun Care",
                href: "/products?category=suncare",
                image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80",
            },
        ],
    };

    // Launch Offer Configuration
    const launchOfferConfig: LaunchOfferConfig = {
        title: locale === "vi"
            ? "Ưu Đãi Ra Mắt"
            : locale === "ko"
                ? "런칭 특별 혜택"
                : "Launch Special",
        description: locale === "vi"
            ? "Giảm 20% cho đơn hàng đầu tiên với mã PLUME20"
            : locale === "ko"
                ? "첫 주문 시 PLUME20 코드로 20% 할인"
                : "Get 20% off your first order with code PLUME20",
        ctaLabel: locale === "vi" ? "Nhận Ưu Đãi" : locale === "ko" ? "혜택 받기" : "Claim Offer",
        ctaLink: "/products",
        isEnabled: true,
    };

    // Best Sellers Configuration
    const bestSellersConfig: BestSellersConfig = {
        title: locale === "vi" ? "Sản Phẩm Bán Chạy" : locale === "ko" ? "베스트셀러" : "Best Sellers",
        subtitle: locale === "vi"
            ? "Những sản phẩm được yêu thích nhất của chúng tôi"
            : locale === "ko"
                ? "가장 사랑받는 제품들"
                : "Our most loved products",
        max_items: 4,
        isEnabled: true,
    };

    // Brand Story Configuration
    const brandStoryConfig: StoryConfig = {
        heading: locale === "vi" ? "Câu Chuyện Của Chúng Tôi" : locale === "ko" ? "우리의 이야기" : "Our Story",
        // subtitle removed
        body: locale === "vi"
            ? "Plumé được phát triển dành cho những người phụ nữ mong muốn cải thiện làn da rõ ràng và bền vững. Chúng tôi tin rằng: mỗi làn da đều xứng đáng được phục hồi – nuôi dưỡng – và chăm sóc theo cách khoa học."
            : locale === "ko"
                ? "Plumé는 깨끗하고 지속 가능한 피부 개선을 원하는 여성을 위해 개발되었습니다. 우리는 모든 피부가 과학적인 방식으로 회복되고, 영양을 공급받으며, 보살핌을 받을 자격이 있다고 믿습니다."
                : "Plumé is developed for women who desire clear and sustainable skin improvement. We believe that every skin deserves to be restored, nourished, and cared for in a scientific way.",
        image_position: "right",
        isEnabled: true,
    };

    // Testimonials Configuration (items would typically come from Supabase)
    const testimonialsConfig: TestimonialsConfig = {
        title: locale === "vi" ? "Khách Hàng Nói Gì" : locale === "ko" ? "고객 리뷰" : "What Customers Say",
        items: [
            {
                id: "1",
                quote: locale === "vi"
                    ? "Chất kem mỏng nhẹ, thấm nhanh, không gây bết dính. Da tôi thay đổi rõ rệt chỉ sau 2 tuần!"
                    : locale === "ko"
                        ? "가볍고 빠르게 흡수되어 끈적임이 없어요. 2주 만에 피부가 확 달라졌어요!"
                        : "Light texture, absorbs quickly, no stickiness. My skin transformed in just 2 weeks!",
                author_name: "Nguyễn Thị Lan Anh",
                author_title: locale === "vi" ? "28 tuổi, TP.HCM" : "28, Ho Chi Minh City",
            },
            {
                id: "2",
                quote: locale === "vi"
                    ? "Dịch vụ tuyệt vời, sản phẩm authentic 100%. Đây là địa chỉ tin cậy cho K-Beauty chính hãng."
                    : locale === "ko"
                        ? "훌륭한 서비스와 100% 정품 제품. 정품 K-Beauty를 위한 신뢰할 수 있는 곳이에요."
                        : "Excellent service, 100% authentic products. This is my trusted source for genuine K-Beauty.",
                author_name: "Trần Minh Hà",
                author_title: locale === "vi" ? "35 tuổi, Hà Nội" : "35, Hanoi",
            },
            {
                id: "3",
                quote: locale === "vi"
                    ? "Giao hàng siêu nhanh, đóng gói cẩn thận. Serum Vitamin C là must-have của tôi!"
                    : locale === "ko"
                        ? "초고속 배송, 꼼꼼한 포장. 비타민 C 세럼은 제 필수템이에요!"
                        : "Super fast delivery, careful packaging. The Vitamin C Serum is my must-have!",
                author_name: "Lê Hoàng Yến",
                author_title: locale === "vi" ? "24 tuổi, Đà Nẵng" : "24, Da Nang",
            },
        ],
        isEnabled: true,
    };

    // FAQ Configuration
    const faqConfig: FAQConfig = {
        title: locale === "vi" ? "Câu Hỏi Thường Gặp" : locale === "ko" ? "자주 묻는 질문" : "FAQ",
        subtitle: locale === "vi"
            ? "Giải đáp những thắc mắc phổ biến"
            : locale === "ko"
                ? "자주 묻는 질문에 대한 답변"
                : "Answers to common questions",
        items: [
            {
                id: "1",
                question: locale === "vi"
                    ? "Sản phẩm Plumé có phù hợp với da nhạy cảm không?"
                    : locale === "ko"
                        ? "Plumé 제품이 민감한 피부에 적합한가요?"
                        : "Are Plumé products suitable for sensitive skin?",
                answer: locale === "vi"
                    ? "Có, tất cả sản phẩm đều được kiểm nghiệm da nhạy cảm và không chứa paraben, sulfate."
                    : locale === "ko"
                        ? "네, 모든 제품은 민감성 피부 테스트를 거쳤으며 파라벤, 설페이트가 없습니다."
                        : "Yes, all products are tested for sensitive skin and are paraben/sulfate-free.",
            },
            {
                id: "2",
                question: locale === "vi"
                    ? "Thời gian giao hàng là bao lâu?"
                    : locale === "ko"
                        ? "배송 기간은 얼마나 걸리나요?"
                        : "How long does delivery take?",
                answer: locale === "vi"
                    ? "Giao hàng trong 1-3 ngày cho nội thành và 3-5 ngày cho các tỉnh."
                    : locale === "ko"
                        ? "도시 내 1-3일, 지방은 3-5일 소요됩니다."
                        : "1-3 days for urban areas, 3-5 days for provinces.",
            },
        ],
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
            ? "Tham gia cùng hàng nghìn khách hàng hài lòng"
            : locale === "ko"
                ? "수천 명의 만족한 고객과 함께하세요"
                : "Join thousands of satisfied customers",
        button_label: locale === "vi" ? "Mua Ngay" : locale === "ko" ? "지금 쇼핑하기" : "Shop Now",
        button_url: "/products",
        isEnabled: true,
    };

    // Marquee Text
    const marqueeText = locale === "vi"
        ? "Tự tin khoe da xinh, Plumé luôn bên bạn"
        : locale === "ko"
            ? "자신 있게 빛나는 피부, Plumé가 항상 함께합니다"
            : "Confidence to show off beautiful skin, Plumé is always with you";

    return {
        heroConfig,
        categoryConfig,
        bestSellersConfig,
        brandStoryConfig,
        testimonialsConfig,
        faqConfig,
        ctaConfig,
        marqueeText,
    };
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.home" });
    const staticData = await getStaticPageContent('home', locale);

    return {
        title: staticData?.seo_title || t("title"),
        description: staticData?.seo_description || t("description"),
        openGraph: staticData?.seo_og_image_url ? {
            images: [{ url: staticData.seo_og_image_url }]
        } : undefined
    };
}

/**
 * Static Home Page
 * 
 * This is a hand-coded page using React components with Framer Motion animations.
 * It uses the Plumé design system (Liquid Glass, design tokens) for consistent styling.
 * 
 * Content is defined in getHomePageConfig() above. To make content admin-editable,
 * fetch from Supabase page_sections instead of using hardcoded config.
 * 
 * All section components are also registered as Plasmic code components,
 * allowing them to be used in Plasmic-driven pages with the same animations.
 */
import { getProducts, getStaticPageContent } from "@/lib/api";
import { getEnabledTikTokVideos } from "@/lib/tiktok";
import { getTikTokSectionVisibility } from "@/lib/site-settings";

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const [products, tiktokVideos, tiktokVisible, staticData] = await Promise.all([
        getProducts(locale as Locale),
        getEnabledTikTokVideos(),
        getTikTokSectionVisibility(),
        getStaticPageContent('home', locale)
    ]);

    const defaultConfig = getHomePageConfig(locale as Locale);
    const slots = staticData?.slots || {};

    const heroConfig = {
        ...defaultConfig.heroConfig,
        title: slots['hero.title'] ?? defaultConfig.heroConfig.title,
        subtitle: slots['hero.subtitle'] ?? defaultConfig.heroConfig.subtitle,
        ctaLabel: slots['hero.ctaLabel'] ?? defaultConfig.heroConfig.ctaLabel,
        ctaLink: slots['hero.ctaLink'] ?? defaultConfig.heroConfig.ctaLink,
    };

    const bestSellersConfig = {
        ...defaultConfig.bestSellersConfig,
        title: slots['bestSellers.title'] ?? defaultConfig.bestSellersConfig.title,
        subtitle: slots['bestSellers.subtitle'] ?? defaultConfig.bestSellersConfig.subtitle,
    };

    const brandStoryConfig = {
        ...defaultConfig.brandStoryConfig,
        heading: slots['brandStory.heading'] ?? defaultConfig.brandStoryConfig.heading,
        body: slots['brandStory.body'] ?? defaultConfig.brandStoryConfig.body,
    };

    const ctaConfig = {
        ...defaultConfig.ctaConfig,
        heading: slots['ctaBanner.heading'] ?? defaultConfig.ctaConfig.heading,
        subheading: slots['ctaBanner.subheading'] ?? defaultConfig.ctaConfig.subheading,
        button_label: slots['ctaBanner.button_label'] ?? defaultConfig.ctaConfig.button_label,
        button_url: slots['ctaBanner.button_url'] ?? defaultConfig.ctaConfig.button_url,
    };

    const marqueeText = slots['marquee'] ?? defaultConfig.marqueeText;

    // Categories, Testimonials, FAQ are not yet slot-managed in this iteration
    const categoryConfig = defaultConfig.categoryConfig;
    const testimonialsConfig = defaultConfig.testimonialsConfig;
    const faqConfig = defaultConfig.faqConfig;

    return (
        <>
            {/* Hero Section - Primary visual with staggered animations */}
            <HeroPrimary config={heroConfig} />

            {/* Best Sellers - Moved underneath Hero as requested */}
            <BestSellers config={bestSellersConfig} products={products} />

            {/* Marquee Section - Moved underneath Best Sellers */}
            <MarqueeSection text={marqueeText} />

            {/* TikTok Carousel - Admin-managed video feed (respects visibility setting) */}
            {tiktokVisible && tiktokVideos.length > 0 && (
                <TikTokCarousel videos={tiktokVideos} />
            )}

            {/* Category Row */}
            <CategoryRow config={categoryConfig} />

            {/* Brand Story */}
            <BrandStory config={brandStoryConfig} />

            {/* Testimonials - Cards with staggered fade-in */}
            <Testimonials config={testimonialsConfig} />

            {/* FAQ Teaser - Accordion-style with fade-in */}
            <FAQTeaser config={faqConfig} />

            {/* CTA Banner - Dark section with spring animation */}
            <CTABanner config={ctaConfig} />
        </>
    );
}

