// Table component

import type { ReactNode } from 'react';

interface Column<T> {
    key: string;
    header: string;
    width?: string;
    render?: (item: T) => ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export function Table<T extends object>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    emptyMessage = 'No data available',
    onRowClick,
}: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-surface-hover border-b border-border" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 border-b border-border last:border-0">
                            <div className="h-full flex items-center px-6 gap-4">
                                <div className="h-4 bg-surface-hover rounded w-1/4" />
                                <div className="h-4 bg-surface-hover rounded w-1/3" />
                                <div className="h-4 bg-surface-hover rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-surface rounded-xl border border-border p-12 text-center">
                <p className="text-text-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-surface-hover border-b border-border">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                                className={`
                  transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-surface-hover' : ''}
                `}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 text-sm text-text-primary"
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : String((item as Record<string, unknown>)[column.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
