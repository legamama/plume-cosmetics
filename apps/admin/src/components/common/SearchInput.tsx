// Search input component

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);

    // Debounce the onChange callback
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange, value]);

    // Sync local value with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className="relative">
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="
          w-full pl-10 pr-10 py-2
          border border-border rounded-lg bg-surface
          text-text-primary placeholder:text-text-muted
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          focus:border-plume-coral focus:ring-plume-coral/20
        "
            />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface-hover text-text-muted"
                    aria-label="Clear search"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
