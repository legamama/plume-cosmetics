/**
 * Plasmic Loader Initialization (Example Template)
 * 
 * This file initializes the Plasmic loader and registers code components.
 * Replace PROJECT_ID and TOKEN with your actual Plasmic project credentials.
 * 
 * NOTE: This is a template. Enable when Plasmic project is configured.
 */

import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import {
    PlasmicHero,
    PlasmicButton,
    PlasmicGlassPanel,
    PlasmicCTABanner
} from "@/components/plasmic";

// Initialize Plasmic loader
export const PLASMIC = initPlasmicLoader({
    projects: [
        {
            id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID || "YOUR_PROJECT_ID",
            token: process.env.NEXT_PUBLIC_PLASMIC_TOKEN || "YOUR_TOKEN",
        }
    ],
    // Set to false for production
    preview: process.env.NODE_ENV === "development",
});

// ============================================
// Register Code Components
// ============================================

// Hero Section
PLASMIC.registerComponent(PlasmicHero, {
    name: "Hero",
    description: "Full-width hero section with title, subtitle, and CTA",
    props: {
        title: {
            type: "string",
            defaultValue: "Welcome to Plumé",
            description: "Main headline",
        },
        subtitle: {
            type: "string",
            defaultValue: "Premium Korean skincare for radiant skin",
            description: "Supporting text",
        },
        ctaText: {
            type: "string",
            defaultValue: "Shop Now",
            description: "Primary button text",
        },
        ctaHref: {
            type: "string",
            defaultValue: "/products",
            description: "Primary button link",
        },
        secondaryCtaText: {
            type: "string",
            description: "Secondary button text (optional)",
        },
        secondaryCtaHref: {
            type: "string",
            description: "Secondary button link",
        },
        imageUrl: {
            type: "string",
            description: "Hero image URL (Supabase Storage)",
        },
        imageAlt: {
            type: "string",
            defaultValue: "Hero image",
        },
        textAlignment: {
            type: "choice",
            options: ["left", "center", "right"],
            defaultValue: "left",
        },
        showScrollIndicator: {
            type: "boolean",
            defaultValue: true,
        },
        minHeight: {
            type: "choice",
            options: ["screen", "large", "medium"],
            defaultValue: "large",
        },
        theme: {
            type: "choice",
            options: ["light", "gradient", "dark"],
            defaultValue: "gradient",
            description: "Color theme preset",
        },
    },
});

// Button
PLASMIC.registerComponent(PlasmicButton, {
    name: "Button",
    description: "Plumé styled button with motion effects",
    props: {
        children: {
            type: "slot",
            defaultValue: "Click me",
        },
        variant: {
            type: "choice",
            options: ["primary", "secondary", "outline", "ghost"],
            defaultValue: "primary",
        },
        size: {
            type: "choice",
            options: ["sm", "md", "lg"],
            defaultValue: "md",
        },
        href: {
            type: "string",
            description: "Link URL (makes button an anchor)",
        },
        target: {
            type: "choice",
            options: ["_self", "_blank"],
            defaultValue: "_self",
        },
        isLoading: {
            type: "boolean",
            defaultValue: false,
        },
        isDisabled: {
            type: "boolean",
            defaultValue: false,
        },
    },
});

// Glass Panel
PLASMIC.registerComponent(PlasmicGlassPanel, {
    name: "GlassPanel",
    description: "Liquid Glass surface container",
    props: {
        children: {
            type: "slot",
        },
        variant: {
            type: "choice",
            options: ["light", "dark", "subtle", "nav"],
            defaultValue: "light",
            description: "Glass effect style",
        },
        radius: {
            type: "choice",
            options: ["sm", "md", "lg", "xl", "2xl", "full"],
            defaultValue: "xl",
        },
        padding: {
            type: "choice",
            options: ["none", "sm", "md", "lg", "xl"],
            defaultValue: "md",
        },
        hoverEffect: {
            type: "choice",
            options: ["none", "lift", "scale", "glow"],
            defaultValue: "none",
        },
        animateOnScroll: {
            type: "boolean",
            defaultValue: false,
            description: "Animate when scrolling into view",
        },
    },
});

// CTA Banner
PLASMIC.registerComponent(PlasmicCTABanner, {
    name: "CTABanner",
    description: "Call-to-action banner section",
    props: {
        title: {
            type: "string",
            defaultValue: "Ready to transform your skin?",
        },
        body: {
            type: "string",
            defaultValue: "Join thousands of happy customers",
        },
        ctaText: {
            type: "string",
            defaultValue: "Get Started",
        },
        ctaHref: {
            type: "string",
            defaultValue: "/products",
        },
        variant: {
            type: "choice",
            options: ["full", "contained"],
            defaultValue: "full",
        },
        textAlignment: {
            type: "choice",
            options: ["left", "center"],
            defaultValue: "center",
        },
        background: {
            type: "choice",
            options: ["gradient", "solid", "image"],
            defaultValue: "gradient",
        },
        backgroundImageUrl: {
            type: "string",
            description: "Background image URL (for image background)",
        },
        overlayOpacity: {
            type: "choice",
            options: ["light", "medium", "dark"],
            defaultValue: "medium",
        },
    },
});
