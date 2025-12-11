// Pages List Page

import { useNavigate } from 'react-router-dom';
import { FileText, Globe, Eye, EyeOff } from 'lucide-react';
import { usePages } from '../../hooks';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils/formatters';
import type { PageDefinition } from '../../types';

import { useState } from 'react';
import { CreatePageModal } from '../../components/pages/CreatePageModal';
import { Button } from '../../components/ui/Button';
import { Plus, Loader2 } from 'lucide-react';
import { seedHomeContent } from '../../lib/api/seed';
import { useToast } from '../../context/ToastContext';

export function PagesListPage() {
    const navigate = useNavigate();
    const { pages, isLoading, togglePublished, addPage, refetch } = usePages();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const toast = useToast();

    const handleTogglePublished = async (e: React.MouseEvent, page: PageDefinition) => {
        e.stopPropagation();
        try {
            await togglePublished(page.id);
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
        }
    };

    const handleCreatePage = async (data: { title: string; slug: string }) => {
        await addPage(data);
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedHomeContent();
            await refetch();
            toast.success('Default content seeded successfully!');
        } catch (error) {
            console.error('Seeding failed:', error);
            toast.error('Failed to seed content. Check console for details.');
        } finally {
            setIsSeeding(false);
        }
    };

    const columns = [
        // ... (keep columns as is)
        {
            key: 'name',
            header: 'Page Name',
            render: (page: PageDefinition) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-plume-rose flex items-center justify-center">
                        <FileText size={20} className="text-plume-coral" />
                    </div>
                    <div>
                        <div className="font-medium">{page.name_vi}</div>
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <Globe size={12} />
                            {page.slug}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'locales',
            header: 'Translations',
            width: '140px',
            render: (page: PageDefinition) => (
                <div className="flex gap-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark">
                        🇻🇳 VI
                    </span>
                    {page.name_en && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark">
                            🇬🇧 EN
                        </span>
                    )}
                    {page.name_ko && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-plume-sage/20 text-plume-sage-dark">
                            🇰🇷 KO
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: '100px',
            render: (page: PageDefinition) => (
                <Badge variant={page.is_published ? 'success' : 'default'}>
                    {page.is_published ? 'Published' : 'Draft'}
                </Badge>
            ),
        },
        {
            key: 'updated_at',
            header: 'Last Updated',
            width: '140px',
            render: (page: PageDefinition) => (
                <span className="text-sm text-text-secondary">
                    {formatDate(page.updated_at)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: '',
            width: '80px',
            render: (page: PageDefinition) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => handleTogglePublished(e, page)}
                        className={`
              p-2 rounded-lg transition-colors
              ${page.is_published
                                ? 'text-plume-sage hover:bg-plume-sage/10'
                                : 'text-text-muted hover:bg-surface-hover'
                            }
            `}
                        title={page.is_published ? 'Unpublish' : 'Publish'}
                    >
                        {page.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Pages</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage page layouts and sections
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Page
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-plume-rose/50 border border-plume-coral/20 rounded-lg p-4">
                <p className="text-sm text-text-secondary">
                    <strong>Visual Page Builder:</strong> Click on a page to manage its sections.
                    Each section can be enabled/disabled, reordered, and configured with content
                    specific to each locale (Vietnamese, English, Korean).
                </p>
            </div>

            {/* Pages Table */}
            {pages.length === 0 && !isLoading ? (
                <div className="text-center py-12 bg-surface-base rounded-xl border border-border dashed border-2">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-text-primary mb-2">No pages found</h3>
                        <p className="text-text-secondary mb-6">
                            Get started by creating a new page or seeding the default content.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="secondary" onClick={handleSeed} isLoading={isSeeding}>
                                {isSeeding ? <Loader2 className="animate-spin mr-2" /> : null}
                                Seed Default Content
                            </Button>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                Create New Page
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={pages}
                    keyExtractor={(page) => page.id}
                    isLoading={isLoading}
                    emptyMessage="No pages found. Create one to get started!"
                    onRowClick={(page) => navigate(`/pages/${page.id}`)}
                />
            )}

            {isCreateModalOpen && (
                <CreatePageModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreatePage}
                />
            )}
        </div>
    );
}
