/**
 * Plumé Design System - Motion Variants for Plasmic Integration
 * 
 * These motion presets ensure consistent animation across hand-coded pages
 * and Plasmic-composed pages. Code components exposed to Plasmic should use
 * these variants instead of defining their own.
 */

// Animation variants for Framer Motion
export const MOTION_VARIANTS = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },
    fadeInDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    // Liquid glass effect - subtle float and glow
    liquidGlass: {
        initial: { opacity: 0, y: 10, scale: 0.98 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] // Custom easing for smooth glass feel
            }
        },
        exit: { opacity: 0, y: 10, scale: 0.98 },
    },
} as const;

// Transition presets
export const TRANSITION_PRESETS = {
    fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    slow: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    smooth: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
    bouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
} as const;

// Stagger animation for lists/grids
export const STAGGER_CONTAINER = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const STAGGER_ITEM = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// Hover effects for interactive elements
export const HOVER_EFFECTS = {
    lift: {
        whileHover: { y: -4, scale: 1.01 },
        whileTap: { scale: 0.98 },
    },
    scale: {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
    },
    glow: {
        whileHover: {
            boxShadow: "0 0 30px rgba(255, 182, 193, 0.4)",
            scale: 1.01,
        },
    },
} as const;

// Type exports for component props
export type MotionVariant = keyof typeof MOTION_VARIANTS;
export type TransitionPreset = keyof typeof TRANSITION_PRESETS;
export type HoverEffect = keyof typeof HOVER_EFFECTS;
