"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { getLocalizedValue } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/config";

interface BuyButtonsProps {
    product: Product;
    locale: Locale;
}

export function BuyButtons({ product, locale }: BuyButtonsProps) {
    const t = useTranslations("productDetail");

    if (product.buyLinks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {product.buyLinks.map((link, index) => {
                const label = getLocalizedValue(link.label, locale);

                return (
                    <motion.div
                        key={link.platform}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Button
                                variant={index === 0 ? "primary" : "outline"}
                                size="lg"
                                className="w-full"
                            >
                                {label}
                            </Button>
                        </a>
                    </motion.div>
                );
            })}
        </div>
    );
}
