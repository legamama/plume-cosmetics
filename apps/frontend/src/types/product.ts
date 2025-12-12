import { Locale } from "@/i18n/config";

export interface LocalizedContent {
    vi: string;
    en: string;
    ko: string;
}

export type LocalizedField<T> = Record<Locale, T>;

export interface BuyLink {
    platform: string;
    url: string;
    label: LocalizedContent;
    // Custom styling options
    icon?: string; // Lucide icon name or emoji
    color?: string; // Background color (hex or CSS color)
    hoverColor?: string; // Hover background color
}

export interface Product {
    id: string;
    slug: string;
    name: LocalizedContent;
    description: LocalizedContent;
    shortDescription: LocalizedContent;
    price: LocalizedField<number>;
    compareAtPrice?: LocalizedField<number>;
    currency: string;
    images: string[]; // Bunny CDN URLs
    thumbnail: string;
    primaryImage?: string; // Explicit primary image
    secondaryImage?: string; // Explicit hover image
    category: ProductCategory;
    benefits: LocalizedField<string[]>;
    ingredients: LocalizedContent;
    howToUse: LocalizedContent;
    buyLinks: BuyLink[];
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    tags?: ProductTag[]; // Optional for now to avoid breaking existing code immediately
    createdAt: string;
    updatedAt: string;
}

export interface ProductTag {
    id: string;
    label: string;
    color?: string;
    type: 'system' | 'custom';
}

export type ProductCategory = "serum" | "cream" | "sunscreen";

export interface ProductCardProps {
    product: Product;
    locale: Locale;
}

// Placeholder product for development
export const placeholderProducts: Product[] = [
    {
        id: "1",
        slug: "mela-infused-advanced-repair-serum",
        name: {
            vi: "Mela-infused Advanced Repair Serum",
            en: "Mela-infused Advanced Repair Serum",
            ko: "멜라 인퓨즈드 어드밴스드 리페어 세럼",
        },
        description: {
            vi: "Serum phục hồi chuyên sâu giúp làm sáng da, mờ thâm nám và cải thiện tông da không đều. Công thức chứa các hoạt chất tiên tiến từ Hàn Quốc.",
            en: "Advanced repair serum that brightens skin, fades dark spots, and improves uneven skin tone. Formula contains cutting-edge active ingredients from Korea.",
            ko: "피부를 밝게 하고 다크 스팟을 엷게 하며 불균일한 피부 톤을 개선하는 어드밴스드 리페어 세럼. 한국산 첨단 활성 성분 함유.",
        },
        shortDescription: {
            vi: "Serum dưỡng trắng và phục hồi da chuyên sâu",
            en: "Intensive brightening and repair serum",
            ko: "집중 브라이트닝 앤 리페어 세럼",
        },
        price: { vi: 890000, en: 35, ko: 45000 },
        compareAtPrice: { vi: 1190000, en: 45, ko: 60000 },
        currency: "VND",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
        ],
        thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        category: "serum",
        benefits: {
            vi: ["Làm sáng da", "Mờ thâm nám", "Phục hồi da"],
            en: ["Brightens skin", "Fades dark spots", "Repairs skin"],
            ko: ["피부 브라이트닝", "다크 스팟 개선", "피부 회복"],
        },
        ingredients: {
            vi: "Niacinamide, Alpha Arbutin, Tranexamic Acid, Hyaluronic Acid",
            en: "Niacinamide, Alpha Arbutin, Tranexamic Acid, Hyaluronic Acid",
            ko: "나이아신아마이드, 알파 알부틴, 트라넥사믹애씨드, 히알루론산",
        },
        howToUse: {
            vi: "Thoa đều lên da mặt sau bước toner, sáng và tối.",
            en: "Apply evenly on face after toner, morning and night.",
            ko: "토너 후 얼굴에 골고루 바르세요. 아침 저녁 사용.",
        },
        buyLinks: [
            {
                platform: "TikTok Shop",
                url: "https://www.tiktok.com/@legamama",
                label: { vi: "Mua trên TikTok", en: "Buy on TikTok", ko: "TikTok에서 구매" },
            },
        ],
        rating: 5.0,
        reviewCount: 128,
        isNew: false,
        isBestSeller: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-12-01",
    },
    {
        id: "2",
        slug: "mela-infused-advanced-repair-cream",
        name: {
            vi: "Mela-infused Advanced Repair Cream",
            en: "Mela-infused Advanced Repair Cream",
            ko: "멜라 인퓨즈드 어드밴스드 리페어 크림",
        },
        description: {
            vi: "Kem dưỡng đêm phục hồi chuyên sâu, nuôi dưỡng và tái tạo da trong khi bạn ngủ. Giúp da mềm mịn, căng mướt vào mỗi sáng.",
            en: "Intensive night repair cream that nourishes and regenerates skin while you sleep. Leaves skin soft, supple, and glowing every morning.",
            ko: "수면 중 피부를 영양 공급하고 재생시키는 집중 나이트 리페어 크림. 매일 아침 부드럽고 촉촉하고 빛나는 피부로.",
        },
        shortDescription: {
            vi: "Kem dưỡng đêm phục hồi và nuôi dưỡng da",
            en: "Night repair and nourishing cream",
            ko: "나이트 리페어 앤 너리싱 크림",
        },
        price: { vi: 950000, en: 40, ko: 50000 },
        currency: "VND",
        images: [
            "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=600",
        ],
        thumbnail: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400",
        category: "cream",
        benefits: {
            vi: ["Phục hồi da", "Dưỡng ẩm sâu", "Chống lão hóa"],
            en: ["Repairs skin", "Deep hydration", "Anti-aging"],
            ko: ["피부 회복", "딥 하이드레이션", "안티에이징"],
        },
        ingredients: {
            vi: "Retinol, Peptides, Ceramides, Shea Butter",
            en: "Retinol, Peptides, Ceramides, Shea Butter",
            ko: "레티놀, 펩타이드, 세라마이드, 시어버터",
        },
        howToUse: {
            vi: "Thoa đều lên da mặt sau các bước dưỡng buổi tối, trước khi ngủ.",
            en: "Apply evenly on face after evening skincare routine, before sleep.",
            ko: "저녁 스킨케어 루틴 후 얼굴에 골고루 바르세요.",
        },
        buyLinks: [
            {
                platform: "TikTok Shop",
                url: "https://www.tiktok.com/@legamama",
                label: { vi: "Mua trên TikTok", en: "Buy on TikTok", ko: "TikTok에서 구매" },
            },
        ],
        rating: 5.0,
        reviewCount: 89,
        isNew: false,
        isBestSeller: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-12-01",
    },
    {
        id: "3",
        slug: "b3-bright-suncream",
        name: {
            vi: "B3 Bright Suncream",
            en: "B3 Bright Suncream",
            ko: "B3 브라이트 선크림",
        },
        description: {
            vi: "Kem chống nắng nhẹ nhàng với SPF50+ PA++++, bảo vệ da khỏi tia UV đồng thời dưỡng sáng da. Chất kem mỏng nhẹ, không bết dính, phù hợp mọi loại da.",
            en: "Lightweight sunscreen with SPF50+ PA++++ that protects skin from UV rays while brightening. Light, non-sticky formula suitable for all skin types.",
            ko: "SPF50+ PA++++로 자외선으로부터 피부를 보호하면서 브라이트닝하는 가벼운 선크림. 모든 피부 타입에 적합한 가볍고 끈적이지 않는 포뮬러.",
        },
        shortDescription: {
            vi: "Chống nắng dưỡng sáng SPF50+ PA++++",
            en: "Brightening sunscreen SPF50+ PA++++",
            ko: "브라이트닝 선크림 SPF50+ PA++++",
        },
        price: { vi: 650000, en: 25, ko: 35000 },
        currency: "VND",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
        ],
        thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        category: "sunscreen",
        benefits: {
            vi: ["Chống nắng SPF50+", "Dưỡng sáng da", "Không bết dính"],
            en: ["SPF50+ protection", "Brightens skin", "Non-sticky"],
            ko: ["SPF50+ 자외선 차단", "피부 브라이트닝", "끈적임 없음"],
        },
        ingredients: {
            vi: "Niacinamide (B3), Zinc Oxide, Titanium Dioxide, Vitamin E",
            en: "Niacinamide (B3), Zinc Oxide, Titanium Dioxide, Vitamin E",
            ko: "나이아신아마이드 (B3), 징크옥사이드, 티타늄디옥사이드, 비타민 E",
        },
        howToUse: {
            vi: "Thoa đều lên da mặt 15 phút trước khi ra nắng. Thoa lại sau mỗi 2-3 giờ.",
            en: "Apply evenly on face 15 minutes before sun exposure. Reapply every 2-3 hours.",
            ko: "외출 15분 전에 얼굴에 골고루 바르세요. 2-3시간마다 덧바르세요.",
        },
        buyLinks: [
            {
                platform: "TikTok Shop",
                url: "https://www.tiktok.com/@legamama",
                label: { vi: "Mua trên TikTok", en: "Buy on TikTok", ko: "TikTok에서 구매" },
            },
        ],
        rating: 5.0,
        reviewCount: 156,
        isNew: true,
        isBestSeller: true,
        createdAt: "2024-06-01",
        updatedAt: "2024-12-01",
    },
];
