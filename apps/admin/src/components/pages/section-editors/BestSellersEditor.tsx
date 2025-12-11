import { Input } from '../../ui/Input';
import type { BestSellersConfig } from '../../../types/pages';

interface BestSellersEditorProps {
    config: BestSellersConfig;
    onChange: (config: BestSellersConfig) => void;
}

export function BestSellersEditor({ config, onChange }: BestSellersEditorProps) {
    const updateConfig = (updates: Partial<BestSellersConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-plume-rose/30 rounded-lg p-4 text-sm text-text-secondary">
                <strong>Best Sellers:</strong> Automatically displays top selling products. You can customize the section title and limit the number of items.
            </div>

            <Input
                label="Title"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                placeholder="Ex: Best Sellers"
            />

            <Input
                label="Subtitle"
                value={config.subtitle || ''}
                onChange={(e) => updateConfig({ subtitle: e.target.value })}
                placeholder="Ex: Our most loved products"
            />

            <Input
                label="Max Items"
                type="number"
                value={config.max_items?.toString()}
                onChange={(e) => updateConfig({ max_items: parseInt(e.target.value) || 4 })}
                placeholder="4"
            />
        </div>
    );
}
