"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { CategoryRowConfig } from "@/types/page-builder";

export function CategoryRow({ config }: { config: CategoryRowConfig }) {
    if (!config.isEnabled && config.isEnabled !== undefined) return null;

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-20 bg-neutral-50/50">
            <Container size="wide">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {config.categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link href={category.href}>
                                <GlassPanel
                                    className="block relative aspect-[4/5] overflow-hidden group"
                                    hoverEffect
                                >
                                    {/* Image */}
                                    {category.image && (
                                        <div className="absolute inset-0 bg-neutral-100">
                                            <Image
                                                src={category.image}
                                                alt={category.label}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    {/* Label Overlay */}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                                    {/* Label Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium uppercase tracking-wider text-plume-charcoal">
                                            {category.label}
                                        </span>
                                    </div>

                                    {/* Arrow Button */}
                                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white text-plume-charcoal flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>

                                </GlassPanel>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}
