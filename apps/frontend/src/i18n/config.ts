export const locales = ["vi", "en", "ko"] as const;
export const defaultLocale = "vi" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
    vi: "Tiếng Việt",
    en: "English",
    ko: "한국어",
};

export const localeFlags: Record<Locale, string> = {
    vi: "🇻🇳",
    en: "🇬🇧",
    ko: "🇰🇷",
};
