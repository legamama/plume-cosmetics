"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

export interface CardProps
    extends Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<"div">>,
    Omit<HTMLMotionProps<"div">, "children"> {
    variant?: "default" | "elevated" | "outline";
    hover?: boolean;
    children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", hover = true, children, ...props }, ref) => {
        const baseStyles = "rounded-2xl overflow-hidden transition-all duration-300";

        const variants = {
            default: "bg-white shadow-soft",
            elevated: "bg-white shadow-medium",
            outline: "bg-white border border-neutral-200",
        };

        const hoverStyles = hover
            ? "hover:shadow-elevated hover:-translate-y-1"
            : "";

        return (
            <motion.div
                ref={ref}
                className={cn(baseStyles, variants[variant], hoverStyles, className)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />
    )
);

CardHeader.displayName = "CardHeader";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6", className)} {...props} />
    )
);

CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
