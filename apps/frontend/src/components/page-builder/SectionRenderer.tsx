import { PageSection } from "@/types/page-builder";
import { HeroPrimary } from "@/components/sections/HeroPrimary";
import { CategoryRow } from "@/components/sections/CategoryRow";
import { ProductsHero } from "@/components/sections/ProductsHero";
// Legacy sections
import { BrandStory } from "@/components/sections/BrandStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQTeaser } from "@/components/sections/FAQTeaser";
import { CTABanner } from "@/components/sections/CTABanner";
import { BestSellers } from "@/components/sections/BestSellers";
import { LaunchOffer } from "@/components/sections/LaunchOffer";
import { CustomContent } from "@/components/sections/CustomContent";

interface SectionRendererProps {
    section: PageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
    switch (section.section_type) {
        case 'hero':
            return <HeroPrimary config={section.config_json} />;
        case 'categories_grid':
            return <CategoryRow config={section.config_json} />;
        case 'products_hero':
        case 'featured_products': // Handle both/alias
            return <ProductsHero config={section.config_json} />;
        case 'story':
            return <BrandStory config={section.config_json} />;
        case 'testimonials':
            return <Testimonials config={section.config_json} />;
        case 'faq':
            return <FAQTeaser config={section.config_json} />;
        case 'cta_banner':
            return <CTABanner config={section.config_json} />;
        case 'best_sellers':
            return <BestSellers config={section.config_json} />;
        case 'launch_offer':
            return <LaunchOffer config={section.config_json} />;
        case 'custom_content':
            return <CustomContent config={section.config_json} />;
        default:
            console.warn(`Unknown section type: ${section.section_type}`);
            return null;
    }
}
