"use client";

import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";

// Core UI Components
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Section Components
import { HeroPrimary } from "@/components/sections/HeroPrimary";
import { CategoryRow } from "@/components/sections/CategoryRow";
import { ProductsHero } from "@/components/sections/ProductsHero";
import { BrandStory } from "@/components/sections/BrandStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQTeaser } from "@/components/sections/FAQTeaser";
import { CTABanner } from "@/components/sections/CTABanner";
import { BestSellers } from "@/components/sections/BestSellers";
import { LaunchOffer } from "@/components/sections/LaunchOffer";

// Product Components
import { ProductCard } from "@/components/product/ProductCard";

export const PLASMIC = initPlasmicLoader({
    projects: [
        {
            id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID!,
            token: process.env.NEXT_PUBLIC_PLASMIC_API_TOKEN!,
        },
    ],
    preview: process.env.NODE_ENV === "development",
});

// ============================================================
// UI COMPONENTS
// ============================================================

PLASMIC.registerComponent(Button, {
    name: "Button",
    props: {
        children: "slot",
        variant: {
            type: "choice",
            options: ["primary", "secondary", "ghost", "outline"],
            defaultValue: "primary",
        },
        size: {
            type: "choice",
            options: ["sm", "md", "lg"],
            defaultValue: "md",
        },
        disabled: "boolean",
        className: "string",
    },
});

PLASMIC.registerComponent(Container, {
    name: "Container",
    props: {
        children: "slot",
        size: {
            type: "choice",
            options: ["narrow", "default", "wide"],
            defaultValue: "default",
        },
        className: "string",
    },
});

PLASMIC.registerComponent(GlassPanel, {
    name: "GlassPanel",
    props: {
        children: "slot",
        variant: {
            type: "choice",
            options: ["light", "dark", "nav"],
            defaultValue: "light",
        },
        hoverEffect: {
            type: "boolean",
            defaultValue: false,
        },
        className: "string",
    },
});

PLASMIC.registerComponent(Card, {
    name: "Card",
    props: {
        children: "slot",
        className: "string",
    },
});

PLASMIC.registerComponent(CardContent, {
    name: "CardContent",
    props: {
        children: "slot",
        className: "string",
    },
});

PLASMIC.registerComponent(Badge, {
    name: "Badge",
    props: {
        children: "slot",
        variant: {
            type: "choice",
            options: ["default", "new", "bestseller"],
            defaultValue: "default",
        },
    },
});

// ============================================================
// SECTION COMPONENTS
// ============================================================

PLASMIC.registerComponent(HeroPrimary, {
    name: "HeroPrimary",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Welcome to Plumé",
                subtitle: "Premium K-Beauty skincare",
                ctaLabel: "Shop Now",
                ctaLink: "/products",
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(CategoryRow, {
    name: "CategoryRow",
    props: {
        config: {
            type: "object",
            defaultValue: {
                isEnabled: true,
                categories: [
                    { id: "1", label: "Skincare", href: "/products?category=skincare", image: "" },
                    { id: "2", label: "Body Care", href: "/products?category=bodycare", image: "" },
                ],
            },
        },
    },
});

PLASMIC.registerComponent(ProductsHero, {
    name: "ProductsHero",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Products",
                description: "Discover our curated collection of premium skincare",
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(BrandStory, {
    name: "BrandStory",
    props: {
        config: {
            type: "object",
            defaultValue: {
                heading: "Our Story",
                subtitle: "From Korea with Love",
                body: "Plumé brings the best of K-Beauty to Vietnam...",
                image_position: "right",
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(Testimonials, {
    name: "Testimonials",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "What Our Customers Say",
                items: [],
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(FAQTeaser, {
    name: "FAQTeaser",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Frequently Asked Questions",
                subtitle: "Find answers to common questions",
                items: [],
            },
        },
    },
});

PLASMIC.registerComponent(CTABanner, {
    name: "CTABanner",
    props: {
        config: {
            type: "object",
            defaultValue: {
                heading: "Ready to Start?",
                subheading: "Join thousands of happy customers",
                button_label: "Shop Now",
                button_url: "/products",
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(BestSellers, {
    name: "BestSellers",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Best Sellers",
                subtitle: "Our most loved products",
                max_items: 4,
                isEnabled: true,
            },
        },
    },
});

PLASMIC.registerComponent(LaunchOffer, {
    name: "LaunchOffer",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Special Launch Offer",
                description: "Get 20% off your first order",
                ctaLabel: "Claim Offer",
                ctaLink: "/products",
                isEnabled: true,
            },
        },
    },
});

// ============================================================
// PRODUCT COMPONENTS
// ============================================================

// ProductCard wrapper for Plasmic with locale support
function PlasmiProductCard({
    productId,
    locale = "vi"
}: {
    productId?: string;
    locale?: string;
}) {
    // Mock product for Plasmic preview - in production, fetch from Supabase
    const mockProduct = {
        id: productId || "demo",
        slug: "demo-product",
        name: { vi: "Sản phẩm Demo", en: "Demo Product", ko: "데모 제품" },
        shortDescription: {
            vi: "Mô tả ngắn sản phẩm",
            en: "Short product description",
            ko: "짧은 제품 설명"
        },
        price: 850000,
        currency: "VND",
        primaryImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
        images: [],
        isNew: true,
        isBestSeller: false,
        rating: 4.8,
        reviewCount: 124,
    };

    return <ProductCard product={mockProduct as never} locale={locale as never} />;
}

PLASMIC.registerComponent(PlasmiProductCard, {
    name: "ProductCard",
    props: {
        productId: {
            type: "string",
            description: "Supabase product ID to fetch and display",
        },
        locale: {
            type: "choice",
            options: ["vi", "en", "ko"],
            defaultValue: "vi",
            description: "Locale for translations and data fetching",
        },
    },
});
