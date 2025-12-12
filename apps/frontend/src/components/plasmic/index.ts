/**
 * Plasmic Code Components - Registry
 * 
 * This file exports all code components for Plasmic registration.
 * These components enforce the Plumé design system while accepting
 * content/config props from Plasmic.
 * 
 * DESIGN PRINCIPLES:
 * 1. Props from Plasmic are limited to content and controlled presets
 * 2. Styling is internally controlled via Tailwind classes
 * 3. Animations use shared Framer Motion variants
 * 4. Plasmic cannot inject arbitrary CSS classes
 */

// Core UI Components
export { PlasmicButton } from './PlasmicButton';
export type { PlasmicButtonProps } from './PlasmicButton';

export { PlasmicGlassPanel } from './PlasmicGlassPanel';
export type { PlasmicGlassPanelProps } from './PlasmicGlassPanel';

// Section Components
export { PlasmicHero } from './PlasmicHero';
export type { PlasmicHeroProps } from './PlasmicHero';

export { PlasmicCTABanner } from './PlasmicCTABanner';
export type { PlasmicCTABannerProps } from './PlasmicCTABanner';

/**
 * USAGE WITH PLASMIC:
 * 
 * In your plasmic-init.ts, register these components:
 * 
 * ```typescript
 * import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
 * import { 
 *   PlasmicHero, 
 *   PlasmicButton, 
 *   PlasmicGlassPanel,
 *   PlasmicCTABanner 
 * } from "@/components/plasmic";
 * 
 * export const PLASMIC = initPlasmicLoader({
 *   projects: [
 *     { id: "YOUR_PROJECT_ID", token: "YOUR_TOKEN" }
 *   ],
 *   preview: false,
 * });
 * 
 * PLASMIC.registerComponent(PlasmicHero, {
 *   name: "Hero",
 *   props: {
 *     title: "string",
 *     subtitle: "string",
 *     ctaText: "string",
 *     ctaHref: "string",
 *     theme: { type: "choice", options: ["light", "gradient", "dark"] },
 *     // ... other props
 *   },
 * });
 * ```
 */
