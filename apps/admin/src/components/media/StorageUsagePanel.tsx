import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import type { StorageUsage } from '../../types/media';
import { HardDrive } from 'lucide-react';

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function StorageUsagePanel() {
    // Component to display storage usage metrics
    const [usage, setUsage] = useState<StorageUsage | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUsage = async () => {
        try {
            const { data, error } = await supabase.rpc('get_storage_usage');
            if (error) throw error;
            setUsage(data);
        } catch (err) {
            console.error('Failed to fetch storage usage:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();

        // Listen for storage changes to update in real-time-ish
        // Note: storage.objects changes might not trigger this immediately depending on realtime config, 
        // passing a refresh trigger from parent might be better, but this is a self-contained start.
        // For now, we'll just fetch on mount. 
        // Ideally the parent (MediaPage) would trigger a refresh when uploads happen.
        // We can expose a refresh method if needed, but standard React pattern is props.
    }, []);

    if (loading) {
        return (
            <Card className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
            </Card>
        );
    }

    if (!usage) return null;

    const percentUsed = Math.min(100, Math.max(0, (usage.total_bytes / usage.limit_bytes) * 100));
    const isHigh = percentUsed > 80;
    const isCritical = percentUsed > 95;

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4 text-text-primary">
                <HardDrive size={20} />
                <h3 className="font-semibold">Storage Usage</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-text-secondary">
                            {formatBytes(usage.total_bytes)} of {formatBytes(usage.limit_bytes)} used
                        </span>
                        <span className={`font-medium ${isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-text-primary'}`}>
                            {percentUsed.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-plume-coral'
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                </div>

                {usage.buckets.length > 0 && (
                    <div className="pt-4 border-t border-border-light">
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Breakdown</p>
                        <div className="space-y-2">
                            {usage.buckets.map((bucket) => (
                                <div key={bucket.name} className="flex justify-between text-sm">
                                    <span className="text-text-secondary capitalize">{bucket.name}</span>
                                    <span className="font-medium text-text-primary">{formatBytes(bucket.size_bytes)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
