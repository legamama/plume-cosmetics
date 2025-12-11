import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { type ReactNode } from 'react';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'nav' | 'sidebar';
    hoverEffect?: boolean;
}

export function GlassPanel({
    children,
    className,
    variant = 'light',
    hoverEffect = false,
    ...props
}: GlassPanelProps) {
    const baseStyles = "backdrop-blur-xl border border-white/20 shadow-sm transition-all duration-300";

    const variants = {
        light: "bg-white/70 text-gray-900 border-white/40",
        dark: "bg-black/60 text-white border-white/10",
        nav: "bg-white/80 border-b border-white/20 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/60",
        sidebar: "bg-white/60 border-r border-white/20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl",
    };

    const hoverAnimation = hoverEffect ? {
        hover: {
            y: -4,
            scale: 1.01,
            boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.5) inset"
        },
        tap: { scale: 0.99 }
    } : undefined;

    return (
        <motion.div
            className={cn(
                baseStyles,
                variants[variant],
                "rounded-2xl",
                (variant === 'nav' || variant === 'sidebar') && "rounded-none",
                className
            )}
            initial={false}
            whileHover={hoverEffect ? "hover" : undefined}
            whileTap={hoverEffect ? "tap" : undefined}
            variants={hoverAnimation}
            {...props}
        >
            {children}
        </motion.div>
    );
}
