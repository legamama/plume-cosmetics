import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "new" | "bestseller" | "sale";
    size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", size = "sm", ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-full";

        const variants = {
            default: "bg-neutral-100 text-neutral-700",
            new: "bg-plume-rose text-white",
            bestseller: "bg-plume-wine text-white",
            sale: "bg-red-500 text-white",
        };

        const sizes = {
            sm: "px-2.5 py-0.5 text-xs",
            md: "px-3 py-1 text-sm",
        };

        return (
            <span
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
