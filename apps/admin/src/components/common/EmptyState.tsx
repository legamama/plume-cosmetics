// Empty state component

import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-plume-rose flex items-center justify-center mb-4">
                {icon || <Inbox size={24} className="text-plume-coral" />}
            </div>
            <h3 className="text-lg font-medium text-text-primary">{title}</h3>
            {description && (
                <p className="mt-2 text-sm text-text-secondary max-w-sm">{description}</p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-6">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
