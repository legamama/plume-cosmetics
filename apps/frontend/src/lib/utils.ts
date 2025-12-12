import { Locale } from "@/i18n/config";

export function formatPrice(price: number, currency: string = "VND"): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function formatDate(dateString: string, locale: Locale): string {
    const date = new Date(dateString);
    const localeMap: Record<Locale, string> = {
        vi: "vi-VN",
        en: "en-US",
        ko: "ko-KR",
    };

    return new Intl.DateTimeFormat(localeMap[locale], {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

export function getLocalizedValue<T>(
    localizedField: Record<Locale, T>,
    locale: Locale
): T {
    return localizedField[locale];
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

