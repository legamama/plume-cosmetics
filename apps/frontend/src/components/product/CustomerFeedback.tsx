"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Quote } from "lucide-react";
import { Container, Heading, Text } from "@/components/ui";
import type { Locale } from "@/i18n/config";

interface ProductFeedback {
    id: string;
    title: string;
    body: string;
    authorName?: string;
    authorContext?: string;
    imageUrl?: string;
}

interface CustomerFeedbackProps {
    productId: string;
    locale: Locale;
}

// Fetch function to get feedbacks from Supabase
async function fetchProductFeedbacks(productId: string, locale: string): Promise<ProductFeedback[]> {
    try {
        const { supabase } = await import("@/lib/supabase");

        // First, fetch feedbacks
        const { data: feedbacksData, error: feedbacksError } = await supabase
            .from("product_feedbacks")
            .select("id, image_url, author_name, author_context, sort_order")
            .eq("product_id", productId)
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (feedbacksError) {
            // Table might not exist yet - this is expected for fresh installs
            console.warn("Feedbacks table query failed (may not exist):", feedbacksError.message);
            return [];
        }

        if (!feedbacksData || feedbacksData.length === 0) {
            return [];
        }

        // Then fetch translations for these feedbacks
        const feedbackIds = feedbacksData.map(f => f.id);
        const { data: translationsData, error: translationsError } = await supabase
            .from("product_feedback_translations")
            .select("feedback_id, title, body, context")
            .in("feedback_id", feedbackIds)
            .eq("locale", locale);

        if (translationsError) {
            console.warn("Translations query failed:", translationsError.message);
        }

        // Create a map of translations by feedback_id
        const translationsMap = new Map<string, { title?: string; body: string; context?: string }>();
        if (translationsData) {
            for (const t of translationsData) {
                translationsMap.set(t.feedback_id, {
                    title: t.title,
                    body: t.body,
                    context: t.context,
                });
            }
        }

        // Combine feedbacks with their translations
        const results: ProductFeedback[] = [];
        for (const item of feedbacksData) {
            const translation = translationsMap.get(item.id);
            // Skip feedbacks without translations for this locale
            if (!translation?.body) continue;

            results.push({
                id: item.id,
                title: translation.title || "",
                body: translation.body,
                authorName: item.author_name,
                authorContext: translation.context || item.author_context,
                imageUrl: item.image_url,
            });
        }
        return results;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

export function CustomerFeedback({ productId, locale }: CustomerFeedbackProps) {
    const t = useTranslations("productDetail");
    const [feedbacks, setFeedbacks] = useState<ProductFeedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProductFeedbacks(productId, locale).then((data) => {
            setFeedbacks(data);
            setIsLoading(false);
        });
    }, [productId, locale]);

    // Don't render if no feedbacks and not loading
    if (!isLoading && feedbacks.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-plume-cream/30">
            <Container size="wide">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-plume-rose/10 rounded-full mb-4">
                        <MessageCircle size={18} className="text-plume-rose" />
                        <span className="text-sm font-medium text-plume-rose">
                            {t("customerFeedback")}
                        </span>
                    </div>
                    <Heading as="h2" size="lg" className="text-plume-charcoal">
                        {t("customerFeedback")}
                    </Heading>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4" />
                                <div className="h-20 bg-neutral-200 rounded mb-4" />
                                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Feedback Cards */}
                {!isLoading && feedbacks.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {feedbacks.map((feedback) => (
                            <motion.article
                                key={feedback.id}
                                variants={cardVariants}
                                whileHover={{
                                    y: -4,
                                    boxShadow: "0 12px 40px rgba(0,0,0,0.1)"
                                }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:border-plume-rose/20 transition-colors"
                            >
                                {/* Optional Image */}
                                {feedback.imageUrl && (
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <Image
                                            src={feedback.imageUrl}
                                            alt={feedback.title || "Customer feedback"}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Quote Icon */}
                                    <Quote
                                        size={24}
                                        className="text-plume-rose/30 mb-3 rotate-180"
                                    />

                                    {/* Title */}
                                    {feedback.title && (
                                        <h3 className="font-semibold text-plume-charcoal mb-2">
                                            {feedback.title}
                                        </h3>
                                    )}

                                    {/* Body - crawlable text content for SEO */}
                                    <Text className="text-neutral-600 leading-relaxed mb-4">
                                        {feedback.body}
                                    </Text>

                                    {/* Author Info */}
                                    {(feedback.authorName || feedback.authorContext) && (
                                        <div className="pt-4 border-t border-neutral-100">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar Placeholder */}
                                                <div className="w-10 h-10 rounded-full bg-plume-rose/10 flex items-center justify-center">
                                                    <span className="text-plume-rose font-medium text-sm">
                                                        {feedback.authorName?.charAt(0)?.toUpperCase() || "K"}
                                                    </span>
                                                </div>
                                                <div>
                                                    {feedback.authorName && (
                                                        <p className="font-medium text-plume-charcoal text-sm">
                                                            {feedback.authorName}
                                                        </p>
                                                    )}
                                                    {feedback.authorContext && (
                                                        <p className="text-xs text-neutral-500">
                                                            {feedback.authorContext}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}
            </Container>
        </section>
    );
}
