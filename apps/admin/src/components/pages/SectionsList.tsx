// Sections List - Draggable list of section cards

import { useState } from 'react';
import { SectionCard } from './SectionCard';
import { EmptyState } from '../common/EmptyState';
import { Layers } from 'lucide-react';
import type { PageSection } from '../../types';

interface SectionsListProps {
    sections: PageSection[];
    onEdit: (section: PageSection) => void;
    onToggleEnabled: (id: string) => void;
    onDelete: (id: string) => void;
    onReorder: (orderedIds: string[]) => void;
}

export function SectionsList({
    sections,
    onEdit,
    onToggleEnabled,
    onDelete,
    onReorder,
}: SectionsListProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    if (sections.length === 0) {
        return (
            <EmptyState
                icon={<Layers size={24} className="text-plume-coral" />}
                title="No sections yet"
                description="Add sections to build your page layout. Each section can be configured with content specific to this locale."
            />
        );
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        // Add a drag image
        const target = e.target as HTMLElement;
        target.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
        setDraggedId(null);
        setDragOverId(null);
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (id !== draggedId) {
            setDragOverId(id);
        }
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;

        const currentIds = sections.map(s => s.id);
        const draggedIndex = currentIds.indexOf(draggedId);
        const targetIndex = currentIds.indexOf(targetId);

        // Reorder the array
        const newIds = [...currentIds];
        newIds.splice(draggedIndex, 1);
        newIds.splice(targetIndex, 0, draggedId);

        onReorder(newIds);
        setDraggedId(null);
        setDragOverId(null);
    };

    return (
        <div className="space-y-3">
            {sections.map((section, index) => (
                <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDrop={(e) => handleDrop(e, section.id)}
                    className={`
            transition-all duration-200
            ${draggedId === section.id ? 'opacity-50' : ''}
            ${dragOverId === section.id ? 'border-t-2 border-plume-coral pt-2' : ''}
          `}
                >
                    <SectionCard
                        section={section}
                        position={index + 1}
                        onEdit={() => onEdit(section)}
                        onToggleEnabled={() => onToggleEnabled(section.id)}
                        onDelete={() => onDelete(section.id)}
                    />
                </div>
            ))}
        </div>
    );
}
