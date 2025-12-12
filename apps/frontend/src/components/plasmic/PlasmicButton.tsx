'use client';

/**
 * Plasmic Code Component: Button
 * 
 * Exposes the Plumé Button with controlled props.
 * Ensures consistent styling and animation.
 */

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface PlasmicButtonProps
    extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;

    // Controlled variants only
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';

    // States
    isLoading?: boolean;
    isDisabled?: boolean;

    // Link behavior (renders as anchor)
    href?: string;
    target?: '_self' | '_blank';

    className?: string;
}

export const PlasmicButton = forwardRef<HTMLButtonElement, PlasmicButtonProps>(
    function PlasmicButton(
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            isDisabled = false,
            href,
            target = '_self',
            className,
            ...props
        },
        ref
    ) {
        // Controlled base styles (cannot be overridden by Plasmic)
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        // Controlled variant styles
        const variantStyles = {
            primary:
                'bg-plume-rose text-white hover:bg-plume-coral focus-visible:ring-plume-rose shadow-soft hover:shadow-medium',
            secondary:
                'bg-plume-blush text-plume-charcoal hover:bg-plume-rose hover:text-white focus-visible:ring-plume-blush',
            ghost:
                'bg-transparent text-plume-charcoal hover:bg-plume-blush focus-visible:ring-plume-rose',
            outline:
                'border-2 border-plume-rose text-plume-rose bg-transparent hover:bg-plume-rose hover:text-white focus-visible:ring-plume-rose',
        };

        // Controlled size styles
        const sizeStyles = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        const disabled = isDisabled || isLoading;

        const content = isLoading ? (
            <span className="flex items-center gap-2">
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                {children}
            </span>
        ) : (
            children
        );

        // If href provided, render as anchor with motion
        if (href) {
            return (
                <motion.a
                    href={href}
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                    className={cn(
                        baseStyles,
                        variantStyles[variant],
                        sizeStyles[size],
                        disabled && 'opacity-50 pointer-events-none',
                        className
                    )}
                    whileHover={{ scale: disabled ? 1 : 1.02 }}
                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                >
                    {content}
                </motion.a>
            );
        }

        return (
            <motion.button
                ref={ref}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                disabled={disabled}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                {...props}
            >
                {content}
            </motion.button>
        );
    }
);

PlasmicButton.displayName = 'PlasmicButton';
