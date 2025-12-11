// Badge component

import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-plume-sage/20 text-plume-sage-dark',
    warning: 'bg-plume-amber/20 text-plume-amber-dark',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
