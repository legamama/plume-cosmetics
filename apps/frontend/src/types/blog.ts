import { LocalizedContent } from "./product";

export interface Author {
    id: string;
    name: string;
    avatar?: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: LocalizedContent;
    excerpt: LocalizedContent;
    content: LocalizedContent; // HTML from TipTap
    coverImage: string; // Storage URL
    author: Author;
    publishedAt: string;
    category: BlogCategory;
    tags: string[];
    readingTime: number; // in minutes
    createdAt: string;
    updatedAt: string;
}

export type BlogCategory = "skincare" | "tips" | "ingredients";

// Placeholder blog posts for development
export const placeholderBlogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "huong-dan-cham-soc-da-mua-dong",
        title: {
            vi: "Hướng dẫn chăm sóc da mùa đông hiệu quả",
            en: "Effective Winter Skincare Guide",
            ko: "효과적인 겨울 스킨케어 가이드",
        },
        excerpt: {
            vi: "Mùa đông với không khí lạnh và khô có thể khiến da bạn trở nên nhạy cảm và mất nước. Cùng tìm hiểu cách bảo vệ làn da trong mùa lạnh.",
            en: "Winter's cold and dry air can make your skin sensitive and dehydrated. Learn how to protect your skin during the cold season.",
            ko: "겨울의 차갑고 건조한 공기는 피부를 민감하고 탈수 상태로 만들 수 있습니다. 추운 계절에 피부를 보호하는 방법을 알아보세요.",
        },
        content: {
            vi: "<p>Mùa đông mang đến nhiều thách thức cho làn da của chúng ta...</p>",
            en: "<p>Winter brings many challenges to our skin...</p>",
            ko: "<p>겨울은 우리 피부에 많은 도전을 가져옵니다...</p>",
        },
        coverImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
        author: {
            id: "1",
            name: "Plumé Beauty Team",
        },
        publishedAt: "2024-11-15",
        category: "skincare",
        tags: ["mùa đông", "dưỡng ẩm", "da khô"],
        readingTime: 5,
        createdAt: "2024-11-10",
        updatedAt: "2024-11-15",
    },
    {
        id: "2",
        slug: "niacinamide-thanh-phan-than-ky",
        title: {
            vi: "Niacinamide - Thành phần thần kỳ cho làn da sáng khỏe",
            en: "Niacinamide - The Miracle Ingredient for Bright, Healthy Skin",
            ko: "나이아신아마이드 - 밝고 건강한 피부를 위한 기적의 성분",
        },
        excerpt: {
            vi: "Tìm hiểu về Niacinamide (Vitamin B3) - một trong những thành phần được yêu thích nhất trong chăm sóc da hiện đại.",
            en: "Learn about Niacinamide (Vitamin B3) - one of the most beloved ingredients in modern skincare.",
            ko: "현대 스킨케어에서 가장 사랑받는 성분 중 하나인 나이아신아마이드(비타민 B3)에 대해 알아보세요.",
        },
        content: {
            vi: "<p>Niacinamide, hay còn gọi là Vitamin B3, là một trong những hoạt chất được nghiên cứu nhiều nhất...</p>",
            en: "<p>Niacinamide, also known as Vitamin B3, is one of the most researched active ingredients...</p>",
            ko: "<p>비타민 B3로도 알려진 나이아신아마이드는 가장 많이 연구된 활성 성분 중 하나입니다...</p>",
        },
        coverImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
        author: {
            id: "1",
            name: "Plumé Beauty Team",
        },
        publishedAt: "2024-10-20",
        category: "ingredients",
        tags: ["niacinamide", "vitamin B3", "thành phần"],
        readingTime: 7,
        createdAt: "2024-10-15",
        updatedAt: "2024-10-20",
    },
    {
        id: "3",
        slug: "5-buoc-duong-da-co-ban",
        title: {
            vi: "5 bước dưỡng da cơ bản cho người mới bắt đầu",
            en: "5 Basic Skincare Steps for Beginners",
            ko: "초보자를 위한 5가지 기본 스킨케어 단계",
        },
        excerpt: {
            vi: "Bạn mới bắt đầu quan tâm đến chăm sóc da? Đây là 5 bước cơ bản nhất mà bạn cần biết.",
            en: "New to skincare? Here are the 5 most basic steps you need to know.",
            ko: "스킨케어를 처음 시작하시나요? 알아야 할 5가지 기본 단계입니다.",
        },
        content: {
            vi: "<p>Việc xây dựng một routine chăm sóc da có thể gây bối rối cho người mới...</p>",
            en: "<p>Building a skincare routine can be confusing for beginners...</p>",
            ko: "<p>스킨케어 루틴을 만드는 것은 초보자에게 혼란스러울 수 있습니다...</p>",
        },
        coverImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800",
        author: {
            id: "1",
            name: "Plumé Beauty Team",
        },
        publishedAt: "2024-09-05",
        category: "tips",
        tags: ["cơ bản", "người mới", "routine"],
        readingTime: 4,
        createdAt: "2024-09-01",
        updatedAt: "2024-09-05",
    },
];
