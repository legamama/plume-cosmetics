// Section Card - Individual section in the list

import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { SECTION_TYPE_LABELS, SECTION_TYPE_ICONS } from '../../types/pages';
import type { PageSection } from '../../types';

interface SectionCardProps {
    section: PageSection;
    position: number;
    onEdit: () => void;
    onToggleEnabled: () => void;
    onDelete: () => void;
}

export function SectionCard({
    section,
    position,
    onEdit,
    onToggleEnabled,
    onDelete,
}: SectionCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const icon = SECTION_TYPE_ICONS[section.section_type];
    const label = SECTION_TYPE_LABELS[section.section_type];

    const handleDelete = () => {
        onDelete();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                className={`
          flex items-center gap-4 p-4 bg-surface border border-border rounded-lg
          transition-all duration-200 hover:shadow-soft
          ${!section.is_enabled ? 'opacity-60' : ''}
        `}
            >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-secondary">
                    <GripVertical size={20} />
                </div>

                {/* Position Number */}
                <div className="w-8 h-8 rounded-full bg-plume-rose flex items-center justify-center text-sm font-medium text-plume-coral-dark">
                    {position}
                </div>

                {/* Section Icon & Type */}
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <div className="font-medium text-text-primary">{label}</div>
                        {!section.is_enabled && (
                            <span className="text-xs text-text-muted">Disabled</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggleEnabled}
                        className={`
              p-2 rounded-lg transition-colors
              ${section.is_enabled
                                ? 'text-plume-sage hover:bg-plume-sage/10'
                                : 'text-text-muted hover:bg-surface-hover'
                            }
            `}
                        title={section.is_enabled ? 'Disable section' : 'Enable section'}
                    >
                        {section.is_enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    <button
                        onClick={onEdit}
                        className="p-2 text-text-muted hover:text-plume-coral hover:bg-plume-rose/50 rounded-lg transition-colors"
                        title="Edit section"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete section"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Section"
                message={`Are you sure you want to delete this ${label} section? This action cannot be undone.`}
                confirmText="Delete"
            />
        </>
    );
}
