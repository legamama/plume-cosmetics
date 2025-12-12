"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container, Heading, Text, Button, Icon } from "@/components/ui";

import { CTABannerConfig } from "@/types/page-builder";

interface CTABannerProps {
    config?: CTABannerConfig;
}

export function CTABanner({ config }: CTABannerProps) {
    const t = useTranslations("home.cta");
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    return (
        <section className="py-24 bg-plume-charcoal text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-plume-rose/10 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-plume-wine/10 blur-3xl" />
            </div>

            <Container size="narrow" className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-6"
                    >
                        <Icon name="sparkles" className="w-12 h-12 text-plume-rose/80" />
                    </motion.div>

                    <Heading as="h2" size="xl" className="mb-4 !text-white">
                        {config?.heading || t("title")}
                    </Heading>

                    <Text size="lg" className="mb-8 !text-neutral-300 max-w-xl mx-auto opacity-80">
                        {config?.subheading || t("subtitle")}
                    </Text>

                    <Link href={getLocalizedHref(config?.button_url || "/products")}>
                        <Button size="lg" className="bg-plume-rose hover:bg-plume-coral">
                            {config?.button_label || t("button")}
                        </Button>
                    </Link>
                </motion.div>
            </Container>
        </section>
    );
}
