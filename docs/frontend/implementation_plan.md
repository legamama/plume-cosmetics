# Frontend Implementation Plan

## Hybrid Routing Architecture

The Plumé frontend uses a **hybrid routing approach** where:

1. **Core pages** are hand-coded with React, Framer Motion, and the Plumé design system
2. **Marketing/editorial pages** are composed visually in Plasmic

This architecture provides full control over performance-critical pages while enabling marketing teams to create and update promotional content without developer involvement.

---

## Page Type Classification

### Static-Coded Pages

These routes are implemented as dedicated Next.js pages with hand-coded React components:

| Route | File | Data Source | Description |
|-------|------|-------------|-------------|
| `/` | `[locale]/page.tsx` | Hardcoded + Supabase products | Home page with hero, categories, best sellers |
| `/products` | `[locale]/products/page.tsx` | Supabase `products` | Product listing with filterable grid |
| `/products/[slug]` | `[locale]/products/[slug]/page.tsx` | Supabase `products` | Product detail page |
| `/about` | `[locale]/about/page.tsx` | Supabase `page_sections` | Brand story, mission, team |
| `/blog` | `[locale]/blog/page.tsx` | Supabase `blog_posts` | Blog listing |
| `/blog/[slug]` | `[locale]/blog/[slug]/page.tsx` | Supabase `blog_posts` | Blog article |

### Plasmic-Driven Pages

These routes are handled by the Plasmic catchall and content is managed in Plasmic Studio:

| Route Pattern | Use Case |
|---------------|----------|
| `/campaign/*` | Marketing campaigns, seasonal promotions |
| `/promo/*` | Limited-time offers, landing pages |
| `/story/*` | Editorial content, brand stories |
| `/lp/*` | Generic landing pages |
| Custom routes | Any route created in Plasmic not matching static pages |

---

## Routing Mechanics

### How It Works

Next.js App Router uses **file-system routing** with the following precedence:

1. **Specific routes take priority**: `/products/page.tsx` wins over `[[...catchall]]/page.tsx`
2. **Locale prefix**: All routes are prefixed with locale (`/vi`, `/en`, `/ko`)
3. **Plasmic catchall**: Routes without dedicated pages fall through to Plasmic

```
/[locale]/
├── page.tsx                    # Static: Home page (/)
├── products/
│   ├── page.tsx                # Static: Product listing (/products)
│   └── [slug]/page.tsx         # Static: Product detail (/products/serum-xyz)
├── about/page.tsx              # Static: About page (/about)
├── blog/
│   ├── page.tsx                # Static: Blog listing (/blog)
│   └── [slug]/page.tsx         # Static: Blog article (/blog/skincare-tips)
└── [[...catchall]]/page.tsx    # Plasmic: All other routes
```

### Plasmic Catchall Implementation

The catchall route (`[[...catchall]]/page.tsx`) fetches page data from Plasmic:

```tsx
export default async function CatchallPage({ params }) {
    const { locale, catchall } = await params;
    const plasmicPath = "/" + (catchall?.join("/") ?? "");
    
    // Fetch from Plasmic
    const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
    
    // 404 if no Plasmic page exists
    if (!plasmicData?.entryCompMetas.length) {
        notFound();
    }
    
    return <PlasmicComponent component={plasmicData.entryCompMetas[0].displayName} />;
}
```

---

## Static Home Page Architecture

The home page uses hand-coded React sections with Framer Motion animations:

### Sections

| Section | Component | Animations |
|---------|-----------|------------|
| Hero | `HeroPrimary` | Staggered text fade-in, image scale |
| Categories | `CategoryRow` | Scroll reveal, hover lift |
| Products Hero | `ProductsHero` | Parallax effect, text slide |
| Best Sellers | `BestSellers` | Stagger grid items, card hover swap |
| Brand Story | `BrandStory` | Split reveal animation |
| Testimonials | `Testimonials` | Carousel with swipe gestures |
| FAQ Teaser | `FAQTeaser` | Accordion expand |
| CTA Banner | `CTABanner` | Pulse animation on view |

### Product Card with Dual Image Hover

The `ProductCard` component implements smooth image swap on hover:

```tsx
// Primary Image (always visible)
<motion.div className="absolute inset-0 z-10">
    <Image src={product.primaryImage} />
</motion.div>

// Secondary Image (appears on hover with fade)
<motion.div
    className="absolute inset-0 z-20"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
>
    <Image src={product.secondaryImage} />
</motion.div>
```

---

## Shared Design System

Both static and Plasmic pages share the same design tokens and layout:

### Global Layout

All pages are wrapped by `[locale]/layout.tsx`:

- `Header` component with navigation
- `Footer` component with links and newsletter
- `NextIntlClientProvider` for i18n support

### Design Tokens

Defined in `globals.css`:

```css
:root {
    /* Brand Colors */
    --plume-rose: #e8b4b8;
    --plume-cream: #f8f5f0;
    --plume-charcoal: #2d2d2d;
    --plume-lavender: #d4c4e8;
    
    /* Liquid Glass */
    --glass-blur: 20px;
    --glass-opacity-light: 0.8;
    --glass-opacity-dark: 0.6;
    --glass-border: rgba(255, 255, 255, 0.2);
    
    /* Motion */
    --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
    --motion-duration-fast: 200ms;
    --motion-duration-normal: 400ms;
    --motion-duration-slow: 800ms;
}
```

### Motion Variants

Shared motion presets for consistency:

```tsx
export const motionVariants = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    },
    staggerContainer: {
        animate: { transition: { staggerChildren: 0.1 } }
    },
    scaleOnHover: {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.3 }
    }
};
```

---

## Plasmic Code Components

All static section components are registered with Plasmic, allowing them to be used within Plasmic-composed pages:

### Registered Components

| Component | Plasmic Name | Props |
|-----------|--------------|-------|
| `HeroPrimary` | Hero | title, subtitle, ctaLabel, ctaLink, image |
| `CategoryRow` | CategoryRow | categories array |
| `ProductsHero` | ProductsHero | title, description |
| `BrandStory` | BrandStory | heading, subtitle, body, image_position |
| `BestSellers` | BestSellers | title, subtitle, max_items |
| `CTABanner` | CTABanner | heading, subheading, button_label, button_url |
| `ProductCard` | ProductCard | productId, locale |
| `Button` | Button | variant, size, children |
| `GlassPanel` | GlassPanel | variant, hoverEffect, children |

### Registration Example

```tsx
// plasmic-init.tsx
PLASMIC.registerComponent(HeroPrimary, {
    name: "HeroPrimary",
    props: {
        config: {
            type: "object",
            defaultValue: {
                title: "Welcome to Plumé",
                subtitle: "Premium K-Beauty skincare",
                isEnabled: true,
            }
        }
    }
});
```

---

## Data Sources

### Supabase (Structured Data)

- `products`: Product catalog with translations
- `blog_posts`: Blog articles with translations
- `page_sections`: Dynamic sections for About and other pages
- `media_assets`: Media library for Supabase Storage URLs
- `redirects`: URL redirect rules

### Plasmic (Visual Content)

- Page layouts and compositions
- Marketing copy and imagery
- Per-locale content variants (if using Plasmic localization)
- Per-page SEO metadata

---

## Icon System

### Unified Icons

Located in `src/components/ui/icons.tsx`, providing consistent line-weight icons for UI elements:

**Available Icons:**
- `MenuIcon`, `CloseIcon` - Navigation toggle
- `ChevronDownIcon`, `ChevronRightIcon`, `ChevronUpIcon` - Direction indicators
- `SearchIcon`, `UserIcon`, `HeartIcon`, `ShoppingBagIcon` - E-commerce
- `MessageIcon`, `PhoneIcon`, `MailIcon` - Contact
- `ExternalLinkIcon`, `PlusIcon`, `GlobeIcon` - Actions

**Icon Registry:**
```tsx
import { Icon, IconKey, iconRegistry } from "@/components/ui/icons";

// Dynamic icon by key
<Icon name="message" size={24} />

// Direct component
<MenuIcon size={24} strokeWidth={1.5} />
```

**Properties:**
- All icons use 24x24 viewBox with 1.5px stroke weight
- Colors inherited from `currentColor` for easy theming
- Consistent sizing via `size` prop

### Social Icons

Located in `src/components/ui/SocialIcons.tsx`, providing official SVG icons for social platforms:

| Component | Platform | SVG Source |
|-----------|----------|------------|
| `FacebookIcon` | Facebook | Official brand path |
| `TikTokIcon` | TikTok | Official brand path |
| `YouTubeIcon` | YouTube | Official brand path |
| `InstagramIcon` | Instagram | Official brand path |

**Usage:**
```tsx
import { SocialIcon, SocialLink, SocialLinks } from "@/components/ui/SocialIcons";

// Dynamic by platform key
<SocialIcon platform="tiktok" size={20} />

// Link with hover effects
<SocialLink platform="facebook" href="https://facebook.com/page" size={20} />

// Group of social links
<SocialLinks links={{ facebook: "url", tiktok: "url" }} size={18} />
```

**Styling:**
- All icons use `currentColor` for fill
- Size prop controls width/height
- SocialLink includes hover states (text-plume-rose, bg-plume-blush/30)
- className passed through for additional styling

---

## Logo Sizing

The logo uses responsive sizing to achieve:
- **Mobile:** 48px height (~50% increase from original 32px)
- **Desktop:** 48px height (~20% increase from original 40px)

**Implementation:**
```tsx
<Image
    src="/images/logo.png"
    alt="Plumé"
    width={180}
    height={60}
    className="h-12 w-auto object-contain"
/>
```

The unified `h-12` class provides consistent sizing across breakpoints while maintaining aspect ratio.

---

## Floating Actions Component

### Overview

`FloatingActions` is a fixed-position button group that appears on the right side of the screen on desktop/tablet devices.

**Location:** `src/components/layout/FloatingActions.tsx`

### Props

```tsx
interface FloatingAction {
    id: string;
    iconKey: string;        // Maps to icon component
    label: string;          // Tooltip text
    href: string;           // Link URL
    backgroundColor: string; // Hex color
    hoverColor: string;      // Hover hex color
    isEnabled: boolean;
    order: number;
}

interface FloatingActionsProps {
    actions: FloatingAction[];
    className?: string;
}
```

### Behavior

| Viewport | Behavior |
|----------|----------|
| Desktop (768px+) | Fixed bottom-right, vertical stack |
| Mobile (<768px) | Hidden to avoid UI conflicts |

### Animations (Framer Motion)

- **Container:** Stagger fade-in on mount (0.1s delay between items)
- **Items:** Scale 1.1 on hover, spring animation
- **Tooltip:** Slides in from right on hover

### Supported Icons

| iconKey | Maps To |
|---------|---------|
| `facebook` | FacebookIcon |
| `tiktok` | TikTokIcon |
| `youtube` | YouTubeIcon |
| `instagram` | InstagramIcon |
| `phone` | Phone (Lucide) |
| `email` | Mail (Lucide) |
| `chat` | MessageCircle (Lucide) |

---

## Settings Integration

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐
│  Admin Settings │────▶│  site_settings   │
│     Page        │     │  (Supabase)      │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
┌─────────────────┐     ┌──────────────────┐
│   Frontend      │◀────│ getSiteSettings()│
│   Layout        │     └──────────────────┘
└─────────────────┘
```

### Fetching Settings

Settings are loaded server-side in the layout:

```tsx
// app/[locale]/layout.tsx
const siteSettings = await getSiteSettings(locale);
const floatingActions = await getFloatingActions();

return (
    <>
        <Header settings={siteSettings} />
        <main>{children}</main>
        <Footer settings={siteSettings} />
        <FloatingActions actions={floatingActions} />
    </>
);
```

### Settings API

```tsx
// lib/site-settings.ts

// Fetch all settings (with fallback to defaults)
getSiteSettings(locale?: string): Promise<SiteSettings>

// Fetch only floating actions
getFloatingActions(): Promise<FloatingAction[]>

// Fetch only social links
getSocialLinks(): Promise<SocialLinks>
```

### Database Schema

```sql
CREATE TABLE site_settings (
    id UUID PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ
);

-- Rows:
-- 'socials' -> { facebook, tiktok, youtube, instagram }
-- 'floating_actions' -> [{ id, iconKey, label, ... }]
```

---

## Verification Checklist

### Static Pages
- [ ] Home page renders with all sections and animations
- [ ] Products page shows grid with hover image swap
- [ ] Product detail pages load correctly
- [ ] About page displays from Supabase data
- [ ] Blog listing and articles work

### Plasmic Pages
- [ ] Plasmic catchall handles unknown routes
- [ ] Code components render within Plasmic pages
- [ ] Plasmic pages use shared Header/Footer
- [ ] 404 returned for non-existent routes

### Cross-Cutting
- [ ] Locale switching works for all page types
- [ ] Design tokens consistent across pages
- [ ] Motion animations work in both contexts
- [ ] SEO metadata correct for all pages


### Icons & Floating Actions
- [ ] Social icons display correctly in Header
- [ ] Social icons display correctly in Footer
- [ ] TikTok icon renders official logo (not fallback)
- [ ] Floating actions visible on desktop
- [ ] Floating actions hidden on mobile
- [ ] Floating action hover effects work
- [ ] Tooltips appear on hover
- [ ] Admin can edit floating actions
- [ ] Admin can edit social links

---

## TikTok Feed Component

### Overview
A responsive carousel component displaying selected TikTok videos on the landing page.

- **Component**: `src/components/features/TikTokCarousel.tsx`
- **Library**: `react-social-media-embed`
- **Data Source**: filtered `tiktok_videos` table from Supabase

### Implementation Details
- Fetches videos via `src/lib/tiktok.ts` -> `getEnabledTikTokVideos()`
- Renders `TikTokEmbed` for each video url
- Wraps in a carousel with Framer Motion for swipe/slide
- Handles mobile responsiveness (1 slide) vs desktop (3 slides)
- Implements lazy loading for performance

---

## Static Page Content Integration

### Overview
Hard-coded pages now fetch their text content from Supabase, allowing admin updates while preserving layout and animations.

### Implementation
- **API**: `getStaticPageContent(slug, locale)` in `src/lib/api.ts`
- **Logic**:
  1. Fetch static structure (hardcoded config).
  2. Fetch dynamic content (Supabase).
  3. Merge dynamic content over static defaults.
- **Pages Updated**:
  - `src/app/[locale]/page.tsx` (Home)
  - `src/app/[locale]/about/page.tsx` (About)


### SEO
- `generateMetadata` functions lookup SEO fields (stored in `static_page_translations` or similar) via stable keys.


---

## Slot-Based Content Model

> [!IMPORTANT]
> **December 2024**: Hard-coded static pages now use a **slot-based architecture** for content. This decouples content from layout, allowing future AI-driven design changes without breaking content editing.

### Concept
Each static page is treated as a layout with named **content slots**.
- **Slots** are stable, dot-notation keys (e.g., `hero.title`, `usp.row1.body`).
- Content is stored in Supabase keyed by `(page_slug, locale, slot_key)`.
- Frontend maps slots to UI components.

### Schema
**`static_page_slots` Table:**
- `page_id` (UUID)
- `locale` (VARCHAR): `vi`, `en`, `ko`
- `slot_key` (VARCHAR): Unique per page/locale.
- `content_value` (TEXT): Simple text content.
- `rich_content` (JSONB): Rich text or complex data (optional).

### Slot Registry

#### Home Page (`/`)
| Section | Slot Key | Description |
|---------|----------|-------------|
| Hero | `hero.title` | Main headline |
| | `hero.subtitle` | Subhead text |
| | `hero.ctaLabel` | Button text |
| | `hero.ctaLink` | Button URL |
| Marquee | `marquee` | Rolling text |
| Best Sellers | `bestSellers.title` | Section title |
| | `bestSellers.subtitle` | Section subtitle |
| Brand Story | `brandStory.heading` | Story headline |
| | `brandStory.body` | Story text |
| CTA Banner | `ctaBanner.heading` | Banner headline |
| | `ctaBanner.subheading` | Banner subhead |
| | `ctaBanner.button_label` | Button text |
| | `ctaBanner.button_url` | Button URL |

#### About Page (`/about`)
| Section | Slot Key | Description |
|---------|----------|-------------|
| Hero | `hero.title` | Page title |
| | `hero.subtitle` | Page subtitle |
| Mission | `mission.heading` | Section heading |
| | `mission.subtitle` | Small kicker |
| | `mission.body` | Main text |
| Origin | `origin.heading` | Section heading |
| | `origin.subtitle` | Kicker |
| | `origin.body` | Main text |
| CTA Banner | `ctaBanner.heading` | Banner headline |
| | `ctaBanner.subheading` | Banner subhead |
| | `ctaBanner.button_label` | Button text |
| | `ctaBanner.button_url` | Button URL |

### Future-Proofing for AI
When the AI refactors or redesigns a page:
1. **Reuse existing slots** whenever possible (e.g., if moving the hero text, still bind to `hero.title`).
2. **Define new slots** using the `section.element` naming convention for new content areas.
3. **Register new slots** in the `static_page_slots` table so they appear in the Admin UI.

