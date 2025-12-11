import { cn } from '@/lib/utils/cn';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-white/20 hover:bg-white/30 text-gray-900 border border-white/30 backdrop-blur-md shadow-lg',
            secondary: 'bg-black/5 hover:bg-black/10 text-gray-800 border border-black/5 backdrop-blur-sm',
            ghost: 'hover:bg-white/10 text-gray-600 hover:text-gray-900',
            danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg'
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl transition-all duration-200 font-medium',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

GlassButton.displayName = 'GlassButton';
