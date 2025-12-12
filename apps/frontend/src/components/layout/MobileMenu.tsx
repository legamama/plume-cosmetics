"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const navItems = [
    { key: "home", href: "/" },
    { key: "products", href: "/products" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
] as const;

interface MobileMenuProps {
    onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    const t = useTranslations("navigation");
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed top-16 right-0 bottom-0 z-50 w-64 bg-white shadow-elevated md:hidden"
            >
                <nav className="flex flex-col p-6">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "block py-3 text-lg font-medium border-b border-neutral-100 transition-colors",
                                    isActive(item.href)
                                        ? "text-plume-rose"
                                        : "text-plume-charcoal hover:text-plume-rose"
                                )}
                            >
                                {t(item.key)}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
            </motion.div>
        </>
    );
}
