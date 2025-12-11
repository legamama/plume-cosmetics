// Button component

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-plume-coral text-white
    hover:bg-plume-coral-dark
    focus:ring-plume-coral
  `,
    secondary: `
    bg-surface border border-border text-text-primary
    hover:bg-surface-hover
    focus:ring-border
  `,
    ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface-hover hover:text-text-primary
  `,
    danger: `
    bg-red-500 text-white
    hover:bg-red-600
    focus:ring-red-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';
