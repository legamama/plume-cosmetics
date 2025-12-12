import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Outfit } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { getSiteSettings, getFloatingActions } from "@/lib/site-settings";
import type { Locale } from "@/i18n/config";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "vietnamese"],
    display: "swap",
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    display: "swap",
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata.home" });

    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            title: t("title"),
            description: t("description"),
            locale: locale === "vi" ? "vi_VN" : locale === "ko" ? "ko_KR" : "en_US",
            type: "website",
        },
        alternates: {
            canonical: locale === "vi" ? "/" : `/${locale}`,
            languages: {
                vi: "/",
                en: "/en",
                ko: "/ko",
            },
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages and settings for the locale
    const messages = await getMessages();
    const siteSettings = await getSiteSettings(locale);
    const floatingActions = await getFloatingActions();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <div className="flex min-h-screen flex-col">
                        <Header settings={siteSettings} />
                        <main className="flex-1">{children}</main>
                        <Footer settings={siteSettings} />

                        {/* Floating Action Buttons */}
                        <FloatingActions actions={floatingActions} />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

