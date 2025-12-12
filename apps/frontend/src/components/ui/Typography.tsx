import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, as: Component = "h2", size, children, ...props }, ref) => {
        // Default size based on heading level if not specified
        const defaultSizes: Record<HeadingLevel, string> = {
            h1: "text-4xl sm:text-5xl lg:text-6xl",
            h2: "text-3xl sm:text-4xl lg:text-5xl",
            h3: "text-2xl sm:text-3xl",
            h4: "text-xl sm:text-2xl",
            h5: "text-lg sm:text-xl",
            h6: "text-base sm:text-lg",
        };

        const customSizes: Record<string, string> = {
            xs: "text-sm sm:text-base",
            sm: "text-base sm:text-lg",
            md: "text-lg sm:text-xl",
            lg: "text-xl sm:text-2xl lg:text-3xl",
            xl: "text-2xl sm:text-3xl lg:text-4xl",
            "2xl": "text-3xl sm:text-4xl lg:text-5xl",
            "3xl": "text-4xl sm:text-5xl lg:text-6xl",
        };

        const sizeClass = size ? customSizes[size] : defaultSizes[Component];

        return (
            <Component
                ref={ref}
                className={cn(
                    "font-display font-semibold text-plume-charcoal tracking-tight text-balance",
                    sizeClass,
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Heading.displayName = "Heading";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
    size?: "sm" | "base" | "lg" | "xl";
    muted?: boolean;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, size = "base", muted = false, ...props }, ref) => {
        const sizes: Record<string, string> = {
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
        };

        return (
            <p
                ref={ref}
                className={cn(
                    "leading-relaxed",
                    sizes[size],
                    muted ? "text-neutral-600" : "text-plume-charcoal",
                    className
                )}
                {...props}
            />
        );
    }
);

Text.displayName = "Text";

export { Heading, Text };
