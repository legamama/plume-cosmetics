"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui";
import { SiteSettings } from "@/lib/site-settings";
import { SITE_CONFIG } from "@/lib/constants";
import { SocialLink, SocialPlatform, SocialLinks } from "@/components/ui/SocialIcons";

const navItems = [
    { key: "home", href: "/" },
    { key: "products", href: "/products" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
] as const;

interface FooterProps {
    settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
    const t = useTranslations("footer");
    const tNav = useTranslations("navigation");
    const locale = useLocale();

    const getLocalizedHref = (href: string) => {
        if (locale === "vi") return href;
        return `/${locale}${href}`;
    };

    const currentYear = new Date().getFullYear();

    // Use settings socials if available, fallback to SITE_CONFIG
    const socials = settings?.socials ?? {
        facebook: SITE_CONFIG.social.facebook,
        tiktok: SITE_CONFIG.social.tiktok,
        instagram: SITE_CONFIG.social.instagram,
    };

    // Define platforms in display order
    const socialPlatforms: SocialPlatform[] = ['tiktok', 'instagram', 'facebook'];

    return (
        <footer className="bg-plume-charcoal text-white">
            <Container size="wide">
                <div className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-4">
                                <Image
                                    src="/images/logo.png"
                                    alt="Plumé Cosmetics"
                                    width={160}
                                    height={50}
                                    className="h-10 w-auto object-contain brightness-0 invert"
                                />
                            </Link>
                            <p className="text-neutral-300 max-w-md mb-6">
                                {t("description")}
                            </p>
                            <SocialLinks
                                items={settings?.socials}
                                size={20}
                                iconClassName="text-neutral-400 hover:text-white hover:bg-white/10"
                            />
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
                            <nav className="flex flex-col gap-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={getLocalizedHref(item.href)}
                                        className="text-neutral-300 hover:text-white transition-colors"
                                    >
                                        {tNav(item.key)}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold mb-4">{t("contact")}</h4>
                            <div className="flex flex-col gap-3 text-neutral-300">
                                <a
                                    href={`mailto:${SITE_CONFIG.email}`}
                                    className="hover:text-white transition-colors"
                                >
                                    {t("email")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6">
                    <p className="text-center text-sm text-neutral-400">
                        {t("copyright", { year: currentYear })}
                    </p>
                </div>
            </Container>
        </footer>
    );
}
