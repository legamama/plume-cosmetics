// Select component

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
        const selectId = id || props.name;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-text-primary"
                    >
                        {label}
                        {props.required && <span className="text-plume-coral ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`
              w-full px-3 py-2 pr-10
              appearance-none
              border rounded-lg bg-surface
              text-text-primary
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-border focus:border-plume-coral focus:ring-plume-coral/20'
                            }
              ${className}
            `}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
