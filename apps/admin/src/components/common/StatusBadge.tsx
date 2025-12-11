// Status badge component

import { Badge } from '../ui/Badge';
import type { Status } from '../../types';

interface StatusBadgeProps {
    status: Status;
}

const statusConfig: Record<Status, { label: string; variant: 'success' | 'warning' | 'default' }> = {
    published: { label: 'Published', variant: 'success' },
    draft: { label: 'Draft', variant: 'default' },
    archived: { label: 'Archived', variant: 'warning' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
}
