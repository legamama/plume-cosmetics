import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: "narrow" | "default" | "wide" | "full";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size = "default", ...props }, ref) => {
        const sizes = {
            narrow: "max-w-3xl",
            default: "max-w-6xl",
            wide: "max-w-7xl",
            full: "max-w-full",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "mx-auto px-4 sm:px-6 lg:px-8",
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Container.displayName = "Container";

export { Container };
