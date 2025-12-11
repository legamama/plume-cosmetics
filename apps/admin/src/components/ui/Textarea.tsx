// Textarea component

import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const textareaId = id || props.name;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-text-primary"
                    >
                        {label}
                        {props.required && <span className="text-plume-coral ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`
            w-full px-3 py-2 
            border rounded-lg bg-surface
            text-text-primary placeholder:text-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[100px]
            ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-border focus:border-plume-coral focus:ring-plume-coral/20'
                        }
            ${className}
          `}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-text-muted">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
