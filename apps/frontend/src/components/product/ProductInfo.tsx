"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Leaf, FlaskConical, HandHeart, Tag } from "lucide-react";
import { Heading, Text, Badge } from "@/components/ui";
import { formatPrice, getLocalizedValue } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface ProductInfoProps {
    product: Product;
    locale: Locale;
}

interface AccordionItemProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-neutral-200 last:border-b-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left hover:bg-neutral-50/50 transition-colors -mx-2 px-2 rounded-lg"
            >
                <div className="flex items-center gap-3">
                    <span className="text-plume-rose">{icon}</span>
                    <span className="font-semibold text-plume-charcoal">{title}</span>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-neutral-400" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 pt-1">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Category display names
const categoryLabels: Record<string, Record<Locale, string>> = {
    serum: { vi: "Serum", en: "Serum", ko: "세럼" },
    cream: { vi: "Kem dưỡng", en: "Cream", ko: "크림" },
    sunscreen: { vi: "Chống nắng", en: "Sunscreen", ko: "선크림" },
};

export function ProductInfo({ product, locale }: ProductInfoProps) {
    const t = useTranslations("productDetail");
    const tProducts = useTranslations("products.card");

    const name = getLocalizedValue(product.name, locale);
    const description = getLocalizedValue(product.description, locale);
    const shortDescription = getLocalizedValue(product.shortDescription, locale);
    const benefits = getLocalizedValue(product.benefits, locale);
    const ingredients = getLocalizedValue(product.ingredients, locale);
    const howToUse = getLocalizedValue(product.howToUse, locale);

    const categoryLabel = categoryLabels[product.category]?.[locale] || product.category;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Category & Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-plume-cream text-plume-charcoal text-xs font-medium rounded-full">
                    <Tag size={12} />
                    {categoryLabel}
                </span>
                {product.isNew && (
                    <Badge variant="new">{tProducts("new")}</Badge>
                )}
                {product.isBestSeller && (
                    <Badge variant="bestseller">{tProducts("bestSeller")}</Badge>
                )}
                {/* Custom Tags */}
                {product.tags?.filter(tag => tag.type === 'custom').map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full"
                        style={{
                            backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                            color: tag.color || '#374151',
                        }}
                    >
                        {tag.label}
                    </span>
                ))}
            </div>

            {/* Title */}
            <Heading as="h1" size="xl" className="!leading-tight">
                {name}
            </Heading>



            {/* Price */}
            {getLocalizedValue(product.price, locale) > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-baseline gap-3"
                >
                    <span className="text-3xl font-bold text-plume-rose">
                        {formatPrice(getLocalizedValue(product.price, locale), product.currency)}
                    </span>
                    {product.compareAtPrice && getLocalizedValue(product.compareAtPrice, locale) > 0 && (
                        <>
                            <span className="text-lg text-neutral-400 line-through">
                                {formatPrice(getLocalizedValue(product.compareAtPrice, locale), product.currency)}
                            </span>
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                {Math.round((1 - getLocalizedValue(product.price, locale) / getLocalizedValue(product.compareAtPrice, locale)) * 100)}% OFF
                            </span>
                        </>
                    )}
                </motion.div>
            )}

            {/* Short Description */}
            {shortDescription && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border-l-4 border-plume-blush pl-4 py-2 bg-plume-cream/30 rounded-r-lg"
                >
                    <Text className="text-plume-charcoal/80 italic">{shortDescription}</Text>
                </motion.div>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-200 pt-2" />

            {/* Accordion Sections */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-0"
            >
                {/* Description Section - Always Visible */}
                {description && (
                    <div className="border-b border-neutral-200 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-plume-rose"><Sparkles size={18} /></span>
                            <span className="font-semibold text-plume-charcoal">{t("description")}</span>
                        </div>
                        <div
                            className="prose prose-neutral prose-sm max-w-none prose-img:rounded-lg prose-img:shadow-md [&>p]:text-neutral-600 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>li]:text-neutral-600"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}

                {/* Benefits Accordion */}
                {benefits.length > 0 && (
                    <AccordionItem
                        title={t("benefits")}
                        icon={<HandHeart size={18} />}
                        defaultOpen={true}
                    >
                        <ul className="space-y-2.5">
                            {benefits.map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-plume-rose/10 flex items-center justify-center mt-0.5">
                                        <span className="text-plume-rose text-xs">✓</span>
                                    </span>
                                    <Text size="sm" className="text-neutral-700">{benefit}</Text>
                                </motion.li>
                            ))}
                        </ul>
                    </AccordionItem>
                )}

                {/* Ingredients Accordion */}
                {ingredients && (
                    <AccordionItem
                        title={t("ingredients")}
                        icon={<FlaskConical size={18} />}
                    >
                        <div
                            className="bg-neutral-50 rounded-lg p-4 prose prose-sm prose-neutral max-w-none [&>p]:text-neutral-600 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>li]:text-neutral-600"
                            dangerouslySetInnerHTML={{ __html: ingredients }}
                        />
                    </AccordionItem>
                )}

                {/* How to Use Accordion */}
                {howToUse && (
                    <AccordionItem
                        title={t("howToUse")}
                        icon={<Leaf size={18} />}
                    >
                        <div
                            className="prose prose-sm prose-neutral max-w-none [&>p]:text-neutral-600 [&>p]:leading-relaxed [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:text-neutral-600"
                            dangerouslySetInnerHTML={{ __html: howToUse }}
                        />
                    </AccordionItem>
                )}
            </motion.div>

            {/* SKU / Product ID (subtle) */}
            <div className="pt-4 border-t border-neutral-100">
                <Text size="sm" muted className="text-xs">
                    SKU: {product.id.slice(0, 8).toUpperCase()}
                </Text>
            </div>
        </motion.div>
    );
}
