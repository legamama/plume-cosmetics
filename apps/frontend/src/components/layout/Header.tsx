"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { SocialLinks, SocialPlatform } from "@/components/ui/SocialIcons";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import { SiteSettings } from "@/lib/site-settings";

interface HeaderProps {
    settings?: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = useTranslations("common");



    return (
        <>
            <GlassPanel
                variant="nav"
                className="fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0"
            >
                <Container size="wide">
                    <div className="flex items-center justify-between h-16 md:h-20 gap-4">

                        {/* LEFT: Navigation (Desktop) */}
                        <div className="hidden md:block flex-1">
                            <Navigation />
                        </div>

                        {/* CENTER: Logo - Increased sizing: Mobile +50% (48px from 32px), Desktop +20% (48-56px from 40px) */}
                        <div className="flex-none flex justify-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt={t("brand")}
                                    width={180}
                                    height={52}
                                    className="h-12 md:h-12 lg:h-14 w-auto object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* RIGHT: Actions + Socials */}
                        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
                            {/* Social Icons - Hidden on mobile, visible on large screens */}
                            <div className="hidden lg:block">
                                <SocialLinks
                                    items={settings?.socials}
                                    size={18}
                                />
                            </div>

                            <div className="w-px h-6 bg-neutral-200 hidden md:block" />

                            <LanguageSwitcher />

                            {/* Mobile Menu Button - Using unified icon system */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-plume-charcoal hover:text-plume-rose transition-colors"
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                {isMobileMenuOpen ? (
                                    <CloseIcon size={24} strokeWidth={1.5} />
                                ) : (
                                    <MenuIcon size={24} strokeWidth={1.5} />
                                )}
                            </button>
                        </div>
                    </div>
                </Container>
            </GlassPanel>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
                )}
            </AnimatePresence>

            {/* Spacer - Matches header height */}
            <div className="h-16 md:h-20" />
        </>
    );
}
