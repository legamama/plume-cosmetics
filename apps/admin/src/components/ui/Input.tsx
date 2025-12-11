// Input component

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-primary"
                    >
                        {label}
                        {props.required && <span className="text-plume-coral ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
            w-full py-2 
            border rounded-lg bg-surface
            text-text-primary placeholder:text-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'px-3'}
            ${rightIcon ? 'pr-10' : 'px-3'}
            ${error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-border focus:border-plume-coral focus:ring-plume-coral/20'
                            }
            ${className}
          `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {rightIcon}
                        </div>
                    )}
                </div>
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

Input.displayName = 'Input';
