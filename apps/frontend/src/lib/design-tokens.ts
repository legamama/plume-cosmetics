/**
 * Plumé Design System - Design Tokens
 * 
 * Centralized design tokens for use in Plasmic code components.
 * These ensure visual consistency with the Tailwind-defined design system.
 */

// Color palette - matches Tailwind config
export const COLORS = {
    // Brand colors
    plume: {
        rose: "#E8B4B8",       // Primary rose
        coral: "#F5B895",      // Coral accent
        blush: "#FDE2E2",      // Light blush
        cream: "#FFF5F5",      // Cream background
        sage: "#A8C5A8",       // Sage green
        sageDark: "#6B8E6B",   // Dark sage
        charcoal: "#2D2D2D",   // Text dark
        warmGray: "#F5F0EB",   // Warm gray
    },
    // Semantic colors
    text: {
        primary: "#2D2D2D",
        secondary: "#6B6B6B",
        muted: "#9B9B9B",
    },
    surface: {
        base: "#FFFFFF",
        elevated: "#FAFAFA",
        hover: "#F0F0F0",
    },
    // Status colors
    status: {
        success: "#A8C5A8",
        error: "#E57373",
        warning: "#FFB74D",
        info: "#64B5F6",
    },
} as const;

// Typography scales
export const TYPOGRAPHY = {
    fontFamily: {
        sans: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        heading: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
        xs: "0.75rem",    // 12px
        sm: "0.875rem",   // 14px
        base: "1rem",     // 16px
        lg: "1.125rem",   // 18px
        xl: "1.25rem",    // 20px
        "2xl": "1.5rem",  // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem",  // 36px
        "5xl": "3rem",     // 48px
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

// Spacing scale (matches Tailwind defaults)
export const SPACING = {
    0: "0",
    1: "0.25rem",   // 4px
    2: "0.5rem",    // 8px
    3: "0.75rem",   // 12px
    4: "1rem",      // 16px
    5: "1.25rem",   // 20px
    6: "1.5rem",    // 24px
    8: "2rem",      // 32px
    10: "2.5rem",   // 40px
    12: "3rem",     // 48px
    16: "4rem",     // 64px
    20: "5rem",     // 80px
} as const;

// Border radius
export const RADIUS = {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
} as const;

// Shadow presets
export const SHADOWS = {
    soft: "0 4px 20px -4px rgba(0, 0, 0, 0.08)",
    medium: "0 8px 30px -8px rgba(0, 0, 0, 0.12)",
    large: "0 20px 50px -12px rgba(0, 0, 0, 0.15)",
    glass: "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
} as const;

// Glass effect properties
export const GLASS_EFFECTS = {
    light: {
        background: "rgba(255, 255, 255, 0.7)",
        backdropBlur: "24px",
        border: "1px solid rgba(255, 255, 255, 0.4)",
    },
    dark: {
        background: "rgba(0, 0, 0, 0.6)",
        backdropBlur: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    subtle: {
        background: "rgba(255, 255, 255, 0.4)",
        backdropBlur: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
    },
} as const;
