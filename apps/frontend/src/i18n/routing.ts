import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: "as-needed", // Vietnamese at root, others with prefix
});
