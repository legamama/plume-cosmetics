'use client';

/**
 * Plasmic Code Component: Glass Panel
 * 
 * Liquid Glass surface component with controlled styling.
 * Plasmic can configure content and layout preset but cannot
 * inject arbitrary CSS.
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { MOTION_VARIANTS, TRANSITION_PRESETS, HOVER_EFFECTS } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

export interface PlasmicGlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;

    // Controlled variants only
    variant?: 'light' | 'dark' | 'subtle' | 'nav';

    // Border radius preset
    radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

    // Padding preset
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

    // Animation
    hoverEffect?: 'none' | 'lift' | 'scale' | 'glow';
    animateOnScroll?: boolean;

    className?: string;
}

export function PlasmicGlassPanel({
    children,
    variant = 'light',
    radius = 'xl',
    padding = 'md',
    hoverEffect = 'none',
    animateOnScroll = false,
    className,
    ...props
}: PlasmicGlassPanelProps) {
    // Controlled glass styles (Plasmic cannot inject arbitrary styles)
    const variants = {
        light: 'bg-white/70 backdrop-blur-xl border border-white/40 text-gray-900',
        dark: 'bg-black/60 backdrop-blur-xl border border-white/10 text-white',
        subtle: 'bg-white/40 backdrop-blur-md border border-white/20 text-gray-900',
        nav: 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm text-gray-900',
    };

    const radiusClasses = {
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
        '2xl': 'rounded-[2rem]',
        full: 'rounded-full',
    };

    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
    };

    const hoverEffects = {
        none: {},
        lift: HOVER_EFFECTS.lift,
        scale: HOVER_EFFECTS.scale,
        glow: HOVER_EFFECTS.glow,
    };

    return (
        <motion.div
            className={cn(
                'shadow-glass transition-all duration-300',
                variants[variant],
                radiusClasses[radius],
                paddingClasses[padding],
                className
            )}
            variants={animateOnScroll ? MOTION_VARIANTS.liquidGlass : undefined}
            initial={animateOnScroll ? 'initial' : false}
            whileInView={animateOnScroll ? 'animate' : undefined}
            viewport={{ once: true }}
            {...(hoverEffect !== 'none' ? hoverEffects[hoverEffect] : {})}
            {...props}
        >
            {children}
        </motion.div>
    );
}

PlasmicGlassPanel.displayName = 'PlasmicGlassPanel';
