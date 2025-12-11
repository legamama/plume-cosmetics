// Add Section Modal - Select section type to add

import { Modal } from '../ui/Modal';
import { SECTION_TYPE_LABELS, SECTION_TYPE_ICONS } from '../../types/pages';
import type { SectionType } from '../../types';

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (sectionType: SectionType) => void;
}

const SECTION_CATEGORIES = [
    {
        name: 'Hero & Banners',
        types: ['hero', 'cta_banner'] as SectionType[],
    },
    {
        name: 'Products',
        types: ['featured_products', 'best_sellers', 'categories_grid'] as SectionType[],
    },
    {
        name: 'Content',
        types: ['story', 'faq', 'testimonials'] as SectionType[],
    },
    {
        name: 'Blog & Social',
        types: ['blog_teaser', 'instagram_feed'] as SectionType[],
    },
    {
        name: 'Custom',
        types: ['custom_content'] as SectionType[],
    },
];

export function AddSectionModal({ isOpen, onClose, onAdd }: AddSectionModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Section" size="lg">
            <div className="p-6 space-y-6">
                {SECTION_CATEGORIES.map((category) => (
                    <div key={category.name}>
                        <h3 className="text-sm font-medium text-text-secondary mb-3">
                            {category.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {category.types.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => onAdd(type)}
                                    className="
                    flex items-center gap-3 p-4
                    border border-border rounded-lg bg-surface
                    hover:border-plume-coral hover:bg-plume-rose/30
                    transition-all duration-200
                    text-left
                  "
                                >
                                    <span className="text-2xl">{SECTION_TYPE_ICONS[type]}</span>
                                    <span className="font-medium text-text-primary">
                                        {SECTION_TYPE_LABELS[type]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
