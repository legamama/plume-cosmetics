"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { ProductsHeroConfig } from "@/types/page-builder";
// import { ProductCard } from "@/components/product/ProductCard"; // Will implement later

export function ProductsHero({ config }: { config: ProductsHeroConfig }) {
    if (!config.isEnabled && config.isEnabled !== undefined) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <Container size="wide">
                <div className="flex flex-col gap-16">

                    {/* Header with Giant Typography */}
                    <div className="relative">
                        <motion.h2
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-[15vw] leading-[0.8] font-display font-light text-plume-charcoal tracking-tighter"
                        >
                            {config.title}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="md:absolute top-1/2 right-0 md:-translate-y-1/2 max-w-sm mt-8 md:mt-0"
                        >
                            <GlassPanel className="p-6 md:p-8 backdrop-blur-3xl bg-white/50 border-white/60">
                                <p className="text-lg text-neutral-600 leading-relaxed">
                                    {config.description}
                                </p>
                                <div className="mt-6 flex gap-3 flex-wrap">
                                    {['Body', 'Face', 'Sets'].map(tag => (
                                        <button key={tag} className="px-4 py-2 rounded-full border border-neutral-200 text-sm hover:bg-plume-charcoal hover:text-white transition-colors">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </GlassPanel>
                        </motion.div>
                    </div>

                    {/* Featured Product Large Image (Use Mock/Placeholder if no ID) */}
                    <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2574&auto=format&fit=crop"
                            alt="Featured Product"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                            <h3 className="text-3xl md:text-5xl text-white font-display">Shea Body Scrub</h3>
                            <Link href="/products/shea-scrub" className="mt-4 inline-flex items-center gap-2 text-white hover:underline">
                                View details <span className="text-xl">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Product Grid would go here (using ProductRenderer later) */}

                </div>
            </Container>
        </section>
    );
}
