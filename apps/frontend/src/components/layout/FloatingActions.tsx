"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { SocialIcon, socialIconMap } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Floating Action Button Configuration
 */
export interface FloatingAction {
    id: string;
    iconKey: string;           // Maps to icon component (facebook, tiktok, phone, email, etc.)
    label: string;             // Tooltip/hover text
    href: string;              // Link URL
    backgroundColor: string;   // Hex color or Tailwind class
    hoverColor: string;        // Hover background color
    isEnabled: boolean;
    order: number;
}

interface FloatingActionsProps {
    actions: FloatingAction[];
    className?: string;
}

// Extended icon map including utility icons
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    ...socialIconMap,
    phone: ({ size = 20, className }) => <Phone size={size} className={className} />,
    email: ({ size = 20, className }) => <Mail size={size} className={className} />,
    chat: ({ size = 20, className }) => <MessageCircle size={size} className={className} />,
};

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.5,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        x: 20,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        scale: 0.8,
        transition: { duration: 0.2 },
    },
};

function FloatingActionButton({
    action,
}: {
    action: FloatingAction;
}) {
    const IconComponent = iconMap[action.iconKey.toLowerCase()];

    // Parse background color - support both hex and Tailwind-style values
    const isHexColor = action.backgroundColor?.startsWith('#');
    const isHoverHexColor = action.hoverColor?.startsWith('#');

    return (
        <motion.a
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            variants={itemVariants}
            whileHover={{
                scale: 1.1,
                boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative group flex items-center justify-center",
                "w-12 h-12 rounded-full",
                "text-white shadow-lg",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            )}
            style={{
                backgroundColor: isHexColor ? action.backgroundColor : undefined,
                ...(isHexColor && isHoverHexColor ? {} : {}),
            }}
            aria-label={action.label}
            title={action.label}
        >
            {/* Hover background overlay */}
            <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                    backgroundColor: isHoverHexColor ? action.hoverColor : undefined,
                }}
            />

            {/* Icon */}
            <span className="relative z-10">
                {IconComponent ? (
                    <IconComponent size={22} />
                ) : (
                    <SocialIcon type={action.iconKey} size={22} />
                )}
            </span>

            {/* Tooltip - slides in from right on hover */}
            <motion.span
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                className={cn(
                    "absolute right-full mr-3 px-3 py-1.5",
                    "bg-plume-charcoal text-white text-sm font-medium",
                    "rounded-lg whitespace-nowrap",
                    "pointer-events-none",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-200"
                )}
            >
                {action.label}
                {/* Tooltip arrow */}
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-plume-charcoal rotate-45" />
            </motion.span>
        </motion.a>
    );
}

/**
 * Floating Action Buttons Component
 * 
 * A vertically-stacked group of floating action buttons positioned at the bottom-right
 * of the screen. Hidden on mobile devices (< 768px) to avoid UI conflicts.
 * 
 * Features:
 * - Framer Motion stagger animations on mount
 * - Hover scale and shadow effects
 * - Tooltip labels on hover
 * - Configurable icons, colors, and links
 */
export function FloatingActions({ actions, className }: FloatingActionsProps) {
    // Filter to only enabled actions and sort by order
    const enabledActions = actions
        .filter(action => action.isEnabled)
        .sort((a, b) => a.order - b.order);

    if (enabledActions.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                    // Positioning - bottom-24 to clear the sticky buy bar on product pages
                    "fixed bottom-24 right-6 z-40",
                    // Layout
                    "flex flex-col gap-3",
                    // Hide on mobile
                    "hidden md:flex",
                    className
                )}
                role="navigation"
                aria-label="Quick actions"
            >
                {enabledActions.map((action) => (
                    <FloatingActionButton
                        key={action.id}
                        action={action}
                    />
                ))}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Default floating actions for initial setup
 * These will be replaced by settings from Supabase
 */
export const defaultFloatingActions: FloatingAction[] = [
    {
        id: '1',
        iconKey: 'facebook',
        label: 'Follow on Facebook',
        href: 'https://www.facebook.com/giadinhlegamamaouc/',
        backgroundColor: '#E8A598',
        hoverColor: '#D4847A',
        isEnabled: true,
        order: 1,
    },
    {
        id: '2',
        iconKey: 'tiktok',
        label: 'Follow on TikTok',
        href: 'https://www.tiktok.com/@legamama',
        backgroundColor: '#E8A598',
        hoverColor: '#D4847A',
        isEnabled: true,
        order: 2,
    },
    {
        id: '3',
        iconKey: 'instagram',
        label: 'Follow on Instagram',
        href: 'https://www.instagram.com/legamama.official',
        backgroundColor: '#E8A598',
        hoverColor: '#D4847A',
        isEnabled: true,
        order: 3,
    },
];
