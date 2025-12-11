// Section Editor - Modal that renders appropriate section-type editor

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SECTION_TYPE_LABELS } from '../../types/pages';
import { HeroEditor } from './section-editors/HeroEditor';
import { FAQEditor } from './section-editors/FAQEditor';
import { StoryEditor } from './section-editors/StoryEditor';
import { CTABannerEditor } from './section-editors/CTABannerEditor';
import { CustomContentEditor } from './section-editors/CustomContentEditor';
import { LaunchOfferEditor } from './section-editors/LaunchOfferEditor';
import { BestSellersEditor } from './section-editors/BestSellersEditor';
import type { PageSection, SectionConfig, HeroConfig, FAQConfig, StoryConfig, CTABannerConfig, CustomContentConfig, LaunchOfferConfig, BestSellersConfig } from '../../types';

interface SectionEditorProps {
    section: PageSection;
    onSave: (config: SectionConfig) => void;
    onClose: () => void;
}

export function SectionEditor({ section, onSave, onClose }: SectionEditorProps) {
    const [config, setConfig] = useState<SectionConfig>(section.config_json);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setConfig(section.config_json);
    }, [section]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(config);
        } finally {
            setIsSaving(false);
        }
    };

    const renderEditor = () => {
        switch (section.section_type) {
            case 'hero':
                return (
                    <HeroEditor
                        config={config as HeroConfig}
                        onChange={(c: HeroConfig) => setConfig(c)}
                    />
                );
            case 'faq':
                return (
                    <FAQEditor
                        config={config as FAQConfig}
                        onChange={(c: FAQConfig) => setConfig(c)}
                    />
                );
            case 'story':
                return (
                    <StoryEditor
                        config={config as StoryConfig}
                        onChange={(c: StoryConfig) => setConfig(c)}
                    />
                );
            case 'cta_banner':
                return (
                    <CTABannerEditor
                        config={config as CTABannerConfig}
                        onChange={(c: CTABannerConfig) => setConfig(c)}
                    />
                );
            case 'launch_offer':
                return (
                    <LaunchOfferEditor
                        config={config as LaunchOfferConfig}
                        onChange={(c: LaunchOfferConfig) => setConfig(c)}
                    />
                );
            case 'best_sellers':
                return (
                    <BestSellersEditor
                        config={config as BestSellersConfig}
                        onChange={(c: BestSellersConfig) => setConfig(c)}
                    />
                );
            case 'custom_content':
                return (
                    <CustomContentEditor
                        config={config as CustomContentConfig}
                        onChange={(c: CustomContentConfig) => setConfig(c)}
                    />
                );
            default:
                return (
                    <div className="p-6 text-center text-text-muted">
                        <p>Editor for "{SECTION_TYPE_LABELS[section.section_type]}" is coming soon.</p>
                        <p className="text-sm mt-2">
                            This section type is supported but the editor hasn't been implemented yet.
                        </p>
                    </div>
                );
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Edit ${SECTION_TYPE_LABELS[section.section_type]}`}
            size="lg"
        >
            <div className="max-h-[70vh] overflow-y-auto">
                {renderEditor()}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSave} isLoading={isSaving}>
                    Save Changes
                </Button>
            </div>
        </Modal>
    );
}
