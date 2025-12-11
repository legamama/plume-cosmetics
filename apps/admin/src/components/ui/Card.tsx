// Card component

import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
    return (
        <div
            className={`
        bg-surface rounded-xl border border-border shadow-soft
        ${paddingStyles[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                {description && (
                    <p className="mt-1 text-sm text-text-secondary">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`mt-6 pt-6 border-t border-border ${className}`}>
            {children}
        </div>
    );
}
