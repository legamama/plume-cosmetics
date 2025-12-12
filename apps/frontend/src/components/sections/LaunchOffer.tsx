"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container, Button, Heading, Text, Icon } from "@/components/ui";

import { LaunchOfferConfig } from "@/types/page-builder";
import Link from "next/link"; // Ensure Link is imported

interface LaunchOfferProps {
    config?: LaunchOfferConfig;
}

export function LaunchOffer({ config }: LaunchOfferProps) {
    const t = useTranslations("home.launchOffer");

    // Using defaults from config or fallback to translations
    const title = config?.title || t("title");
    const description = config?.description || t("description");
    const ctaLabel = config?.ctaLabel || t("cta");
    const ctaLink = config?.ctaLink || "/products"; // Fallback link? Or use what user had? no fallback in t, assumed static.

    return (
        <section className="py-16 bg-gradient-to-r from-plume-rose to-plume-coral overflow-hidden">
            <Container size="wide">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-white"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <Icon name="gift" className="w-10 h-10 text-white/90" />
                    </motion.div>

                    <Heading as="h2" size="xl" className="mb-4 !text-white">
                        {title}
                    </Heading>

                    <Text size="lg" className="mb-8 max-w-2xl mx-auto !text-white/90">
                        {description}
                    </Text>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href={ctaLink}>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white text-plume-rose hover:bg-plume-cream"
                            >
                                {ctaLabel}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
