"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container, Button, Heading, Text } from "@/components/ui";

export function Hero() {
    const t = useTranslations("home.hero");
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-plume-cream to-white">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-plume-blush/30 blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-plume-rose/10 blur-3xl" />
            </div>

            <Container size="wide" className="relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block mb-6"
                        >
                            <span className="text-6xl">🌸</span>
                        </motion.div>

                        <Heading as="h1" className="mb-6">
                            {t("title")}
                        </Heading>

                        <Text size="lg" muted className="mb-8 max-w-xl mx-auto lg:mx-0">
                            {t("subtitle")}
                        </Text>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link href={getLocalizedHref("/products")}>
                                <Button size="lg">{t("cta")}</Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square max-w-lg mx-auto">
                            {/* Decorative circles */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-plume-blush to-plume-rose/20" />
                            <div className="absolute inset-8 rounded-full bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center">
                                <div className="text-center p-8">
                                    <span className="text-8xl block mb-4">✨</span>
                                    <Text muted className="text-sm">
                                        Premium Korean Skincare
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-6 h-10 rounded-full border-2 border-plume-rose/30 flex items-start justify-center p-2"
                >
                    <div className="w-1.5 h-3 rounded-full bg-plume-rose/50" />
                </motion.div>
            </motion.div>
        </section>
    );
}
