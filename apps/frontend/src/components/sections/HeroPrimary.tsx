"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { HeroPrimaryConfig } from "@/types/page-builder";
import { cn } from "@/lib/cn";

export function HeroPrimary({ config }: { config: HeroPrimaryConfig }) {
    if (!config.isEnabled && config.isEnabled !== undefined) return null;

    return (
        <section
            className="relative w-full min-h-[90vh] flex items-center overflow-hidden pt-20"
            style={{ backgroundColor: config.backgroundColor || "#f5f5f5" }}
        >
            <Container size="wide" className="relative z-10 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-12">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 max-w-xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-display font-light leading-tight text-plume-charcoal">
                            {config.title}
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed">
                            {config.subtitle}
                        </p>

                        {config.ctaLabel && config.ctaLink && (
                            <Link
                                href={config.ctaLink}
                                className="inline-block px-8 py-4 bg-plume-charcoal text-white rounded-full font-medium hover:bg-plume-rose transition-colors duration-300"
                            >
                                {config.ctaLabel}
                            </Link>
                        )}
                    </motion.div>

                    {/* Right: Image & Overlay */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden"
                    >
                        {/* Main Hero Image */}
                        {config.image && (
                            <Image
                                src={config.image}
                                alt={config.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}

                        {/* Liquid Glass Overlay Card */}
                        {config.overlayCard && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="absolute bottom-8 right-8 z-20 max-w-xs w-full"
                            >
                                <GlassPanel
                                    className="p-6 flex items-center justify-between gap-4"
                                    hoverEffect
                                >
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Featured</p>
                                        <h3 className="text-lg font-medium text-plume-charcoal">{config.overlayCard.title}</h3>
                                        <p className="text-sm text-neutral-600 mt-1">{config.overlayCard.description}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-plume-charcoal text-white flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </GlassPanel>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </Container>

            {/* Background Blob/Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-plume-rose/10 rounded-full blur-[100px] -z-0 pointer-events-none" />
        </section>
    );
}
