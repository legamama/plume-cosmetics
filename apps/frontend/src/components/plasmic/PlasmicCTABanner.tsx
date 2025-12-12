'use client';

/**
 * Plasmic Code Component: CTA Banner
 * 
 * Accepts content props from Plasmic but internally applies
 * our design system styles and animations.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container, Button, Heading, Text } from '@/components/ui';
import { MOTION_VARIANTS, TRANSITION_PRESETS } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface PlasmicCTABannerProps {
    // Content
    title: string;
    body?: string;
    ctaText: string;
    ctaHref: string;

    // Layout
    variant?: 'full' | 'contained';
    textAlignment?: 'left' | 'center';

    // Background (controlled presets only)
    background?: 'gradient' | 'solid' | 'image';
    backgroundImageUrl?: string;
    overlayOpacity?: 'light' | 'medium' | 'dark';

    className?: string;
}

export function PlasmicCTABanner({
    title,
    body,
    ctaText,
    ctaHref,
    variant = 'full',
    textAlignment = 'center',
    background = 'gradient',
    backgroundImageUrl,
    overlayOpacity = 'medium',
    className,
}: PlasmicCTABannerProps) {
    const backgroundClasses = {
        gradient: 'bg-gradient-to-r from-plume-rose to-plume-coral',
        solid: 'bg-plume-rose',
        image: 'bg-cover bg-center',
    };

    const overlayClasses = {
        light: 'bg-black/40',
        medium: 'bg-black/60',
        dark: 'bg-black/80',
    };

    const containerClass = variant === 'contained'
        ? 'rounded-3xl overflow-hidden mx-4 md:mx-8'
        : '';

    return (
        <section className={cn('py-16 md:py-24', className)}>
            <motion.div
                className={cn(
                    'relative',
                    containerClass,
                    backgroundClasses[background]
                )}
                style={backgroundImageUrl && background === 'image' ? {
                    backgroundImage: `url(${backgroundImageUrl})`
                } : undefined}
                variants={MOTION_VARIANTS.fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-100px' }}
                transition={TRANSITION_PRESETS.smooth}
            >
                {/* Overlay for image backgrounds */}
                {background === 'image' && (
                    <div className={cn('absolute inset-0', overlayClasses[overlayOpacity])} />
                )}

                <Container size="default" className="relative z-10 py-16 md:py-20">
                    <div className={cn(
                        'max-w-2xl',
                        textAlignment === 'center' ? 'mx-auto text-center' : ''
                    )}>
                        <motion.div
                            variants={MOTION_VARIANTS.fadeInUp}
                            transition={{ delay: 0.1 }}
                        >
                            <Heading as="h2" className="text-white mb-4">
                                {title}
                            </Heading>
                        </motion.div>

                        {body && (
                            <motion.div
                                variants={MOTION_VARIANTS.fadeInUp}
                                transition={{ delay: 0.2 }}
                            >
                                <Text className="text-white/90 mb-8">
                                    {body}
                                </Text>
                            </motion.div>
                        )}

                        <motion.div
                            variants={MOTION_VARIANTS.fadeInUp}
                            transition={{ delay: 0.3 }}
                            className={textAlignment === 'center' ? 'flex justify-center' : ''}
                        >
                            <Link href={ctaHref}>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-plume-rose hover:bg-plume-cream"
                                >
                                    {ctaText}
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </Container>
            </motion.div>
        </section>
    );
}

PlasmicCTABanner.displayName = 'PlasmicCTABanner';
