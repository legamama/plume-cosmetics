'use client';

/**
 * Plasmic Code Component: Hero Section
 * 
 * Accepts content/config props from Plasmic but internally applies
 * our Tailwind classes and Framer Motion animations for consistency.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container, Button, Heading, Text } from '@/components/ui';
import { MOTION_VARIANTS, TRANSITION_PRESETS, STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface PlasmicHeroProps {
    // Content props from Plasmic
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;

    // Image/media
    imageUrl?: string;
    imageAlt?: string;

    // Layout options
    textAlignment?: 'left' | 'center' | 'right';
    showScrollIndicator?: boolean;
    minHeight?: 'screen' | 'large' | 'medium';

    // Theming (controlled internally, Plasmic can only select presets)
    theme?: 'light' | 'gradient' | 'dark';

    // Accessibility
    className?: string;
}

export function PlasmicHero({
    title,
    subtitle,
    ctaText,
    ctaHref = '/products',
    secondaryCtaText,
    secondaryCtaHref,
    imageUrl,
    imageAlt = 'Hero image',
    textAlignment = 'left',
    showScrollIndicator = true,
    minHeight = 'large',
    theme = 'gradient',
    className,
}: PlasmicHeroProps) {
    // Controlled height classes
    const heightClasses = {
        screen: 'min-h-screen',
        large: 'min-h-[90vh]',
        medium: 'min-h-[70vh]',
    };

    // Controlled theme classes (Plasmic cannot inject arbitrary styles)
    const themeClasses = {
        light: 'bg-white',
        gradient: 'bg-gradient-to-b from-plume-cream to-white',
        dark: 'bg-plume-charcoal text-white',
    };

    const alignmentClasses = {
        left: 'text-left lg:text-left',
        center: 'text-center',
        right: 'text-right lg:text-right',
    };

    return (
        <section
            className={cn(
                'relative flex items-center overflow-hidden',
                heightClasses[minHeight],
                themeClasses[theme],
                className
            )}
        >
            {/* Background decoration - internal, Plasmic cannot modify */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-plume-blush/30 blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-plume-rose/10 blur-3xl" />
            </div>

            <Container size="wide" className="relative z-10">
                <motion.div
                    className="grid lg:grid-cols-2 gap-12 items-center"
                    variants={STAGGER_CONTAINER}
                    initial="initial"
                    animate="animate"
                >
                    {/* Text Content */}
                    <motion.div
                        variants={MOTION_VARIANTS.fadeInUp}
                        transition={TRANSITION_PRESETS.smooth}
                        className={alignmentClasses[textAlignment]}
                    >
                        <motion.div
                            variants={MOTION_VARIANTS.scaleIn}
                            className="inline-block mb-6"
                        >
                            <span className="text-6xl">🌸</span>
                        </motion.div>

                        <Heading as="h1" className="mb-6">
                            {title}
                        </Heading>

                        {subtitle && (
                            <Text size="lg" muted className="mb-8 max-w-xl mx-auto lg:mx-0">
                                {subtitle}
                            </Text>
                        )}

                        <motion.div
                            variants={STAGGER_ITEM}
                            className={cn(
                                'flex flex-col sm:flex-row gap-4',
                                textAlignment === 'center' ? 'justify-center' :
                                    textAlignment === 'left' ? 'justify-start lg:justify-start' :
                                        'justify-end lg:justify-end'
                            )}
                        >
                            {ctaText && (
                                <Link href={ctaHref}>
                                    <Button size="lg">{ctaText}</Button>
                                </Link>
                            )}
                            {secondaryCtaText && secondaryCtaHref && (
                                <Link href={secondaryCtaHref}>
                                    <Button variant="outline" size="lg">{secondaryCtaText}</Button>
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Hero Image */}
                    {imageUrl ? (
                        <motion.div
                            variants={MOTION_VARIANTS.scaleIn}
                            transition={{ ...TRANSITION_PRESETS.smooth, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative aspect-square max-w-lg mx-auto overflow-hidden rounded-3xl shadow-large">
                                <img
                                    src={imageUrl}
                                    alt={imageAlt}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={MOTION_VARIANTS.scaleIn}
                            transition={{ ...TRANSITION_PRESETS.smooth, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            {/* Decorative placeholder */}
                            <div className="relative aspect-square max-w-lg mx-auto">
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
                    )}
                </motion.div>
            </Container>

            {/* Scroll indicator - internal animation */}
            {showScrollIndicator && (
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
            )}
        </section>
    );
}

// Plasmic component metadata
PlasmicHero.displayName = 'PlasmicHero';
