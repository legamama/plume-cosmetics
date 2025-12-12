"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container, Heading, Text, Card, CardContent } from "@/components/ui";
import { AnimatedSection } from "@/components/common/AnimatedSection";

import { TestimonialsConfig } from "@/types/page-builder";

const outputTestimonials = [
    {
        id: "1",
        quote: "Chất kem mỏng nhẹ, thấm nhanh, không gây bết dính hay bí da. Dùng cả ngày mà da vẫn khô thoáng, không bị đổ dầu.",
        author_name: "Nguyễn Thị Lan Anh",
        author_title: "28 tuổi, TP.HCM", // Combined for mapping simplicity if needed
        author_image_url: "",
    },
    // ... others if needed as fallback
];

interface TestimonialsProps {
    config?: TestimonialsConfig;
}

export function Testimonials({ config }: TestimonialsProps) {
    const t = useTranslations("home.testimonials");

    // Use config items if available, otherwise fallback (or empty?)
    // User wants "Remove leftover hard-coded content", so we should prefer config.
    // But initially DB might be empty.
    const items = config?.items?.length ? config.items : [];
    // If we want to keep hardcoded as fallback for now:
    // const items = config?.items && config.items.length > 0 ? config.items : outputTestimonials;
    // But user said "Remove leftover...". So if config is empty, we show empty? 
    // Or we map the old hardcoded ones to the new structure?
    // Let's use config items. If empty, the section renders nothing (or empty list).

    return (
        <section className="py-24 bg-white overflow-hidden">
            <Container size="wide">
                <AnimatedSection className="text-center mb-16">
                    <Heading as="h2" className="mb-4">
                        {config?.title || t("title")}
                    </Heading>
                    {/* TestimonialsConfig doesn't have subtitle in Admin Types? verify? */}
                    {/* Admin types TestimonialsConfig had title, items. No subtitle. */}
                    {/* So we skipped subtitle in config. */}
                    <Text size="lg" muted className="max-w-2xl mx-auto">
                        {t("subtitle")}
                    </Text>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                        >
                            <Card className="h-full">
                                <CardContent className="flex flex-col h-full">
                                    {/* Quote icon */}
                                    <div className="text-4xl text-plume-rose/30 mb-4">"</div>

                                    {/* Content */}
                                    {/* Admin config has 'quote' */}
                                    <Text className="flex-1 mb-6 italic">
                                        {testimonial.quote}
                                    </Text>

                                    {/* Author */}
                                    <div className="border-t border-neutral-100 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-plume-blush flex items-center justify-center text-sm font-medium text-plume-rose">
                                                {(testimonial.author_name || "").charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-plume-charcoal text-sm">
                                                    {testimonial.author_name}
                                                </p>
                                                {testimonial.author_title && (
                                                    <p className="text-xs text-neutral-500">
                                                        {testimonial.author_title}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
