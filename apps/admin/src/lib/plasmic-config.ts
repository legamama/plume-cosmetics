// Plasmic Pages configuration
// Static config for MVP - can be replaced with Supabase table or Plasmic API later

export interface PlasmicPageConfig {
    id: string;
    slug: string;
    name: string;
    description?: string;
    locales: ('vi' | 'en' | 'ko')[];
    plasmicPagePath?: string; // Path in Plasmic project
    isPublished: boolean;
    lastUpdated?: string;
}

// Static configuration of Plasmic pages
// In the future, this can be fetched from Supabase or Plasmic API
export const plasmicPagesConfig: PlasmicPageConfig[] = [
    {
        id: 'home',
        slug: '/',
        name: 'Home Page',
        description: 'Main landing page with hero, features, and product highlights',
        locales: ['vi', 'en', 'ko'],
        plasmicPagePath: '/home',
        isPublished: true,
    },
    {
        id: 'about',
        slug: '/about',
        name: 'About Page',
        description: 'Brand story, mission, values, and team',
        locales: ['vi', 'en', 'ko'],
        plasmicPagePath: '/about',
        isPublished: true,
    },
    {
        id: 'contact',
        slug: '/contact',
        name: 'Contact Page',
        description: 'Contact form, location, and social links',
        locales: ['vi', 'en', 'ko'],
        plasmicPagePath: '/contact',
        isPublished: false,
    },
];

// Plasmic project configuration
export const plasmicConfig = {
    projectId: import.meta.env.VITE_PLASMIC_PROJECT_ID || 'YOUR_PROJECT_ID',
    studioBaseUrl: 'https://studio.plasmic.app',

    // Generate Plasmic Studio edit URL
    getEditUrl: (pageConfig: PlasmicPageConfig): string => {
        const projectId = plasmicConfig.projectId;
        if (projectId === 'YOUR_PROJECT_ID') {
            return '#'; // Placeholder if not configured
        }
        return `${plasmicConfig.studioBaseUrl}/projects/${projectId}?page=${encodeURIComponent(pageConfig.plasmicPagePath || pageConfig.slug)}`;
    },
};
