"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Container, Heading, Card } from "@/components/ui";
import { getLocalizedValue } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface RelatedProductsProps {
    products: Product[];
    currentProductId: string;
    locale: Locale;
}

export function RelatedProducts({ products, currentProductId, locale }: RelatedProductsProps) {
    const t = useTranslations("productDetail");

    // Filter out the current product
    const otherProducts = products.filter((p) => p.id !== currentProductId);

    if (otherProducts.length === 0) {
        return null;
    }

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-plume-cream/30">
            <Container size="wide">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <Heading as="h2" size="lg" className="text-plume-charcoal">
                        {t("relatedProducts")}
                    </Heading>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {otherProducts.map((product, index) => {
                        const name = getLocalizedValue(product.name, locale);
                        const productSlug = product.slug || product.id;
                        const primaryImage = product.primaryImage || product.thumbnail || product.images[0] || "";

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link href={getLocalizedHref(`/products/${productSlug}`)}>
                                    <Card className="group h-full cursor-pointer overflow-hidden">
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/5] overflow-hidden bg-plume-cream rounded-xl">
                                            <Image
                                                src={primaryImage}
                                                alt={name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30">
                                                {product.isNew && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-plume-rose text-white">
                                                        {locale === 'vi' ? 'Mới' : locale === 'ko' ? '신규' : 'New'}
                                                    </span>
                                                )}
                                                {product.isBestSeller && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                                                        {locale === 'vi' ? 'Bán chạy' : locale === 'ko' ? '베스트' : 'Best Seller'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Dark Gradient Overlay with Product Name */}
                                            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                                                <div className="h-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <h3 className="font-semibold text-white text-sm md:text-base line-clamp-2 drop-shadow-lg">
                                                        {name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
