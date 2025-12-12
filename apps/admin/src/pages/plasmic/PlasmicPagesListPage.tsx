// Plasmic Pages List Page
// Lists all Plasmic-managed pages with links to edit in Plasmic Studio

import { ExternalLink, Eye, Globe, Search, Info, Palette } from 'lucide-react';
import { usePlasmicPages } from '../../hooks/usePlasmicPages';
import { plasmicConfig, type PlasmicPageConfig } from '../../lib/plasmic-config';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export function PlasmicPagesListPage() {
    const { pages, isLoading, search, searchQuery } = usePlasmicPages();
    const [showInfo, setShowInfo] = useState(false);
    const toast = useToast();

    const handleEditInPlasmic = (page: PlasmicPageConfig) => {
        const url = plasmicConfig.getEditUrl(page);
        if (url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            toast.error('Plasmic project ID not configured. Please set VITE_PLASMIC_PROJECT_ID in your environment.');
        }
    };

    const handleViewPage = (page: PlasmicPageConfig, locale: string = 'vi') => {
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000';
        const url = `${frontendUrl}/${locale}${page.slug === '/' ? '' : page.slug}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const columns = [
        {
            key: 'name',
            header: 'Page Name',
            render: (page: PlasmicPageConfig) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Palette size={20} className="text-purple-600" />
                    </div>
                    <div>
                        <div className="font-medium">{page.name}</div>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <Globe size={12} />
                            {page.slug}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            header: 'Description',
            width: '250px',
            render: (page: PlasmicPageConfig) => (
                <span className="text-sm text-text-secondary line-clamp-2">
                    {page.description || '—'}
                </span>
            ),
        },
        {
            key: 'locales',
            header: 'Locales',
            width: '140px',
            render: (page: PlasmicPageConfig) => (
                <div className="flex gap-1 flex-wrap">
                    {page.locales.includes('vi') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewPage(page, 'vi'); }}
                            className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark hover:bg-plume-sage/40 transition-colors"
                            title="View Vietnamese version"
                        >
                            🇻🇳 VI
                        </button>
                    )}
                    {page.locales.includes('en') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewPage(page, 'en'); }}
                            className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark hover:bg-plume-sage/40 transition-colors"
                            title="View English version"
                        >
                            🇬🇧 EN
                        </button>
                    )}
                    {page.locales.includes('ko') && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewPage(page, 'ko'); }}
                            className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark hover:bg-plume-sage/40 transition-colors"
                            title="View Korean version"
                        >
                            🇰🇷 KO
                        </button>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: '100px',
            render: (page: PlasmicPageConfig) => (
                <Badge variant={page.isPublished ? 'success' : 'default'}>
                    {page.isPublished ? 'Published' : 'Draft'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            width: '180px',
            render: (page: PlasmicPageConfig) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleViewPage(page); }}
                        title="Preview page"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleEditInPlasmic(page); }}
                    >
                        <ExternalLink size={14} className="mr-1" />
                        Edit in Plasmic
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Plasmic Pages</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Visual page builder for marketing content
                    </p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <Info size={18} className="mr-2" />
                    How it works
                </Button>
            </div>

            {/* Info Banner */}
            {showInfo && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 space-y-3">
                    <h3 className="font-medium text-purple-900">🎨 Plasmic Visual Builder</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
                        <div>
                            <p className="font-medium mb-1">Plasmic handles:</p>
                            <ul className="list-disc list-inside space-y-1 text-purple-700">
                                <li>Visual layout and composition</li>
                                <li>Marketing content and copy</li>
                                <li>Per-locale content (vi/en/ko variants)</li>
                                <li>Page-level SEO fields</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium mb-1">Supabase handles:</p>
                            <ul className="list-disc list-inside space-y-1 text-purple-700">
                                <li>Products and pricing</li>
                                <li>Blog posts and articles</li>
                                <li>Media library (Supabase Storage)</li>
                                <li>Redirects and structured data</li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                        <strong>To edit locales:</strong> In Plasmic Studio, use the variant selector to switch between vi/en/ko versions.
                    </p>
                </div>
            )}

            {/* Source Indicator */}
            <div className="bg-surface-base rounded-lg p-3 flex items-center gap-3 border border-border">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    <span className="text-sm text-text-secondary">Plasmic (layout/content)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-sm text-text-secondary">Supabase (products/blog/media)</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => search(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-base border border-border rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-plume-rose/30 focus:border-plume-rose
                   text-text-primary placeholder:text-text-muted"
                />
            </div>

            {/* Pages Table */}
            <Table
                columns={columns}
                data={pages}
                keyExtractor={(page) => page.id}
                isLoading={isLoading}
                emptyMessage="No Plasmic pages configured. Add pages in plasmic-config.ts"
                onRowClick={(page) => handleEditInPlasmic(page)}
            />

            {/* Footer note */}
            <div className="text-center text-xs text-text-muted py-4">
                Pages are configured in <code className="bg-surface-hover px-1 py-0.5 rounded">lib/plasmic-config.ts</code>.
                For dynamic page registry, connect to Supabase or Plasmic API.
            </div>
        </div>
    );
}
