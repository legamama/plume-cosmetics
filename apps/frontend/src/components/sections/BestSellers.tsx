"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Container, Heading, Text, Button } from "@/components/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { placeholderProducts } from "@/types/product";
import {
    AnimatedSection,
    StaggerContainer,
    StaggerItem,
} from "@/components/common/AnimatedSection";
import type { Locale } from "@/i18n/config";

import { BestSellersConfig } from "@/types/page-builder";

import { Product } from "@/types/product";

interface BestSellersProps {
    config?: BestSellersConfig;
    products?: Product[];
}

export function BestSellers({ config, products = [] }: BestSellersProps) {
    const t = useTranslations("home.bestSellers");
    const tCommon = useTranslations("common");
    const locale = useLocale() as Locale;

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    // Filter best sellers
    // Use provided products if available, otherwise fallback to placeholder (for now, or empty)
    const sourceProducts = products.length > 0 ? products : placeholderProducts;

    // Show all products (no tag filter) - sorted by sort_order from API
    let bestSellers = [...sourceProducts];

    // Sort by sort_order if available or just take first N
    if (config?.max_items) {
        bestSellers = bestSellers.slice(0, config.max_items);
    }

    return (
        <section className="py-24 bg-white">
            <Container size="wide">
                <AnimatedSection className="text-center mb-16">
                    <Heading as="h2" className="mb-4">
                        {config?.title || t("title")}
                    </Heading>
                    <Text size="lg" muted className="max-w-2xl mx-auto">
                        {config?.subtitle || t("subtitle")}
                    </Text>
                </AnimatedSection>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {bestSellers.map((product) => (
                        <StaggerItem key={product.id}>
                            <ProductCard product={product} locale={locale} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                <AnimatedSection className="text-center">
                    <Link href={getLocalizedHref("/products")}>
                        <Button variant="outline" size="lg">
                            {tCommon("viewAll")}
                        </Button>
                    </Link>
                </AnimatedSection>
            </Container>
        </section>
    );
}
