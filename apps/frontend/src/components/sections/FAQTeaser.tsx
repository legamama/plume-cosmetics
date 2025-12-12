"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container, Heading, Text, Button } from "@/components/ui";
import { AnimatedSection } from "@/components/common/AnimatedSection";

import { FAQConfig } from "@/types/page-builder";

// Keep faqs as fallback if needed, but we rely on config
const defaultFaqs = [
    {
        id: "1",
        question: "Sản phẩm Plume phù hợp với loại da nào?",
        answer:
            "Các sản phẩm của Plume đều được thiết kế phù hợp với nhiều loại da: da dầu, da khô, da hỗn hợp và đặc biệt là da nhạy cảm.",
    },
    // ...
];

interface FAQTeaserProps {
    config?: FAQConfig;
}

export function FAQTeaser({ config }: FAQTeaserProps) {
    const t = useTranslations("home.faq");

    const items = config?.items?.length ? config.items : []; // If empty config, show nothing? Or default?
    // Let's assume empty config means section is enabled but empty.

    return (
        <section className="py-24 bg-plume-cream">
            <Container size="narrow">
                <AnimatedSection className="text-center mb-12">
                    <Heading as="h2" className="mb-4">
                        {config?.title || t("title")}
                    </Heading>
                    <Text size="lg" muted>
                        {config?.subtitle || t("subtitle")}
                    </Text>
                </AnimatedSection>

                <div className="space-y-4 mb-12">
                    {items.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-soft"
                        >
                            <h4 className="font-semibold text-plume-charcoal mb-2">
                                {faq.question}
                            </h4>
                            <Text size="sm" muted dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </motion.div>
                    ))}
                </div>

                <AnimatedSection className="text-center">
                    <Button variant="ghost">{t("cta")} →</Button>
                </AnimatedSection>
            </Container>
        </section>
    );
}
