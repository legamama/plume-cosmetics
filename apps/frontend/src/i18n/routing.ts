import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: "always", // Always show locale in URL to avoid redirect issues
});
