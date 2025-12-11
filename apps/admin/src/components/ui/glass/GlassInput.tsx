import { cn } from '@/lib/utils/cn';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    ref={ref}
                    className={cn(
                        'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5',
                        'placeholder:text-gray-400 text-gray-900',
                        'focus:outline-none focus:ring-2 focus:ring-plume-rose/20 focus:border-plume-rose/30',
                        'transition-all duration-200 backdrop-blur-sm',
                        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>
                )}
            </div>
        );
    }
);

GlassInput.displayName = 'GlassInput';
