// Locale Tab Panel component

import type { ReactNode } from 'react';
import type { Locale } from '../../types';

interface LocaleTabPanelProps {
    locale: Locale;
    children: ReactNode;
    isRequired?: boolean;
}

const localeInfo: Record<Locale, { name: string; flag: string }> = {
    vi: { name: 'Vietnamese', flag: '🇻🇳' },
    en: { name: 'English', flag: '🇬🇧' },
    ko: { name: 'Korean', flag: '🇰🇷' },
};

export function LocaleTabPanel({ locale, children, isRequired = false }: LocaleTabPanelProps) {
    const info = localeInfo[locale];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-xl">{info.flag}</span>
                <span className="font-medium text-text-primary">{info.name}</span>
                {isRequired && (
                    <span className="px-2 py-0.5 text-xs bg-plume-rose text-plume-coral-dark rounded-full">
                        Required
                    </span>
                )}
                {!isRequired && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-text-muted rounded-full">
                        Optional
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}
