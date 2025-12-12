"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const navItems = [
    { key: "home", href: "/" },
    { key: "products", href: "/products" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
] as const;

export function Navigation() {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="flex items-center gap-8">
            {navItems.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                        "relative text-sm font-medium transition-colors",
                        isActive(item.href)
                            ? "text-plume-rose"
                            : "text-plume-charcoal hover:text-plume-rose"
                    )}
                >
                    {t(item.key)}
                    {isActive(item.href) && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-plume-rose rounded-full" />
                    )}
                </Link>
            ))}
        </nav>
    );
}
