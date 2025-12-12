export const SITE_CONFIG = {
    name: "Plumé Cosmetics",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://plumecosmetics.com",
    email: "hello@plumecosmetics.com",
    social: {
        tiktok: "https://www.tiktok.com/@legamama",
        instagram: "https://instagram.com/plumecosmetics",
        facebook: "https://facebook.com/plumecosmetics",
    },
} as const;

export const ANIMATION_VARIANTS = {
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
} as const;

export const TRANSITION_PRESETS = {
    fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    normal: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    slow: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

export const STAGGER_CHILDREN = {
    container: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
} as const;
