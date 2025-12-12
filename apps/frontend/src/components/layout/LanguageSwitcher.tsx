"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const currentLocale = useLocale() as Locale;
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const switchLocale = (newLocale: Locale) => {
        router.push(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-plume-charcoal hover:text-plume-rose transition-colors rounded-lg hover:bg-plume-blush/50"
                aria-label="Switch language"
            >
                <span>{localeFlags[currentLocale]}</span>
                <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
                <svg
                    className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-elevated border border-neutral-100 overflow-hidden z-50"
                    >
                        {locales.map((locale) => (
                            <button
                                key={locale}
                                onClick={() => switchLocale(locale)}
                                className={cn(
                                    "flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors",
                                    locale === currentLocale
                                        ? "bg-plume-blush text-plume-rose"
                                        : "text-plume-charcoal hover:bg-neutral-50"
                                )}
                            >
                                <span>{localeFlags[locale]}</span>
                                <span>{localeNames[locale]}</span>
                                {locale === currentLocale && (
                                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
