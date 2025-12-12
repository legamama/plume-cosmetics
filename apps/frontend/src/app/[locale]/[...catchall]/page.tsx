/**
 * Plasmic Catchall Page Handler
 * 
 * This page handles routes that are NOT implemented as static pages.
 * Due to Next.js App Router routing rules, more specific routes take precedence:
 * 
 * STATIC-CODED PAGES (handled by dedicated page.tsx files):
 *   /                    → [locale]/page.tsx (home)
 *   /products            → [locale]/products/page.tsx
 *   /products/[slug]     → [locale]/products/[slug]/page.tsx
 *   /about               → [locale]/about/page.tsx
 *   /blog                → [locale]/blog/page.tsx
 *   /blog/[slug]         → [locale]/blog/[slug]/page.tsx
 * 
 * PLASMIC-DRIVEN PAGES (handled by this catchall):
 *   /campaign/*          → Marketing campaigns
 *   /promo/*             → Promotional landing pages
 *   /story/*             → Editorial content
 *   /lp/*                → Generic landing pages
 *   Any other route      → Falls through to Plasmic lookup
 * 
 * If a route doesn't match a static page AND doesn't exist in Plasmic,
 * a 404 is returned.
 */

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PlasmicComponent, ComponentRenderData } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";
import type { Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

interface Props {
    params: Promise<{ locale: string; catchall: string[] }>;
}

export default async function CatchallPage({ params }: Props) {
    const { locale, catchall } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering for next-intl
    setRequestLocale(locale);

    // Build the Plasmic path from the catchall segments
    const plasmicPath = "/" + catchall.join("/");

    // Try to fetch Plasmic page data
    let plasmicData: ComponentRenderData | null = null;
    try {
        plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
    } catch (error) {
        console.error("Error fetching Plasmic data:", error);
    }

    // If no Plasmic page exists for this path, return 404
    if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
        notFound();
    }

    const pageMeta = plasmicData.entryCompMetas[0];

    return (
        <PlasmicComponent
            component={pageMeta.displayName}
            componentProps={{
                // Pass locale to all code components for i18n support
                locale,
            }}
        />
    );
}

// Generate static paths for all Plasmic pages and locales
export async function generateStaticParams() {
    // Fetch all published Plasmic pages
    let pages: { path: string }[] = [];
    try {
        pages = await PLASMIC.fetchPages();
    } catch (error) {
        console.error("Error fetching Plasmic pages:", error);
        return [];
    }

    // Generate params for each page and each locale
    const params: { locale: string; catchall: string[] }[] = [];

    for (const page of pages) {
        // Convert path to catchall array (e.g., "/about/team" -> ["about", "team"])
        const catchall = page.path.split("/").filter(Boolean);

        // Generate for each locale
        for (const locale of routing.locales) {
            params.push({ locale, catchall });
        }
    }

    return params;
}

// Revalidate Plasmic pages periodically
export const revalidate = 60;
