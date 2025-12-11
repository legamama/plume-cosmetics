// Page Editor Page - Sections management for a page

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { usePageSections } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '../../components/ui/Tabs';
import { LoadingPage } from '../../components/ui/LoadingSpinner';
import { SectionsList } from '../../components/pages/SectionsList';
import { SectionEditor } from '../../components/pages/SectionEditor';
import { AddSectionModal } from '../../components/pages/AddSectionModal';
import type { Locale, PageSection, SectionConfig } from '../../types';

export function PageEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeLocale, setActiveLocale] = useState<Locale>('vi');
    const [editingSection, setEditingSection] = useState<PageSection | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const {
        page,
        sections,
        isLoading,
        addSection,
        updateSectionConfig,
        toggleEnabled,
        removeSection,
        reorder,
    } = usePageSections({ pageId: id ?? '', locale: activeLocale });

    if (isLoading) {
        return <LoadingPage />;
    }

    if (!page) {
        return (
            <div className="text-center py-12">
                <p className="text-text-muted">Page not found</p>
                <Button variant="ghost" onClick={() => navigate('/pages')} className="mt-4">
                    Back to Pages
                </Button>
            </div>
        );
    }

    const handleSaveSection = async (config: SectionConfig) => {
        if (!editingSection) return;
        await updateSectionConfig(editingSection.id, config);
        setEditingSection(null);
    };

    const handleReorder = async (orderedIds: string[]) => {
        await reorder(orderedIds);
    };

    const handleAddSection = async (sectionType: string) => {
        await addSection(sectionType as Parameters<typeof addSection>[0]);
        setIsAddModalOpen(false);
    };

    const handleDelete = async (sectionId: string) => {
        await removeSection(sectionId);
    };

    // Get page name for current locale
    const getPageName = () => {
        switch (activeLocale) {
            case 'en': return page.name_en || page.name_vi;
            case 'ko': return page.name_ko || page.name_vi;
            default: return page.name_vi;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/pages')}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        aria-label="Back to pages"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">
                            {getPageName()}
                        </h1>
                        <p className="text-sm text-text-muted mt-1">
                            {page.slug}
                        </p>
                    </div>
                </div>
                <Button
                    leftIcon={<Plus size={18} />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Section
                </Button>
            </div>

            {/* Locale Tabs */}
            <Card>
                <Tabs defaultValue="vi" onChange={(v) => setActiveLocale(v as Locale)}>
                    <TabList>
                        <Tab value="vi">
                            <span className="flex items-center gap-2">
                                🇻🇳 Vietnamese
                                <span className="text-xs px-1.5 py-0.5 bg-plume-rose rounded">
                                    {sections.length}
                                </span>
                            </span>
                        </Tab>
                        <Tab value="en">
                            <span className="flex items-center gap-2">
                                🇬🇧 English
                            </span>
                        </Tab>
                        <Tab value="ko">
                            <span className="flex items-center gap-2">
                                🇰🇷 Korean
                            </span>
                        </Tab>
                    </TabList>

                    <TabPanel value="vi">
                        <SectionsList
                            sections={sections}
                            onEdit={(section) => setEditingSection(section)}
                            onToggleEnabled={toggleEnabled}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    </TabPanel>

                    <TabPanel value="en">
                        <SectionsList
                            sections={sections}
                            onEdit={(section) => setEditingSection(section)}
                            onToggleEnabled={toggleEnabled}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    </TabPanel>

                    <TabPanel value="ko">
                        <SectionsList
                            sections={sections}
                            onEdit={(section) => setEditingSection(section)}
                            onToggleEnabled={toggleEnabled}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                        />
                    </TabPanel>
                </Tabs>
            </Card>

            {/* Section Editor Modal */}
            {editingSection && (
                <SectionEditor
                    section={editingSection}
                    onSave={handleSaveSection}
                    onClose={() => setEditingSection(null)}
                />
            )}

            {/* Add Section Modal */}
            <AddSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddSection}
            />
        </div>
    );
}
