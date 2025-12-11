import { useState } from 'react';
import {
    Settings,
    Share2,
    MousePointerClick,
    Save,
    Plus,
    Trash2,
    GripVertical,
    Eye,
    EyeOff
} from 'lucide-react';
import { useSiteSettings, type FloatingAction, type SocialLinkItem } from '../../hooks/useSiteSettings';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Available icons
const iconOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'chat', label: 'Chat' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'pinterest', label: 'Pinterest' },
];

// Preset colors
const colorPresets = [
    { name: 'Rose', bg: '#E8A598', hover: '#D4847A' },
    { name: 'Wine', bg: '#8B4049', hover: '#6B2F38' },
    { name: 'Coral', bg: '#D4847A', hover: '#C06B60' },
    { name: 'Charcoal', bg: '#2D2D2D', hover: '#404040' },
    { name: 'Green', bg: '#8FB59A', hover: '#7AA087' },
    { name: 'Blue', bg: '#6B8FB5', hover: '#5A7AA0' },
];

type TabId = 'socials' | 'floating';

export function SettingsPage() {
    const {
        settings,
        isLoading,
        error,
        updateSocials,
        updateFloatingActions,
        addFloatingAction,
        deleteFloatingAction,
        addSocialLink,
        deleteSocialLink,
    } = useSiteSettings();

    const [activeTab, setActiveTab] = useState<TabId>('socials');
    const [isSaving, setIsSaving] = useState(false);

    // Local form state
    const [socialForm, setSocialForm] = useState<SocialLinkItem[]>([]);
    const [floatingActionsForm, setFloatingActionsForm] = useState<FloatingAction[]>([]);
    const [isFormDirty, setIsFormDirty] = useState(false);

    // Initialize forms when settings load
    useState(() => {
        if (settings) {
            setSocialForm(settings.socials);
            setFloatingActionsForm(settings.floatingActions);
        }
    });

    // Update form when settings change and form is NOT dirty
    if (settings && !isFormDirty) {
        if (JSON.stringify(socialForm) !== JSON.stringify(settings.socials)) {
            setSocialForm(settings.socials);
        }
        if (JSON.stringify(floatingActionsForm) !== JSON.stringify(settings.floatingActions)) {
            setFloatingActionsForm(settings.floatingActions);
        }
    }

    // --- Social Links Handlers ---

    const handleSocialChange = (id: string, field: keyof SocialLinkItem, value: unknown) => {
        setSocialForm(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
        setIsFormDirty(true);
    };

    const handleAddSocialLink = async () => {
        const newLink: Omit<SocialLinkItem, 'id'> = {
            platform: 'facebook',
            url: 'https://',
            label: 'Facebook',
            icon: 'facebook',
            isEnabled: true,
            order: socialForm.length + 1,
        };
        await addSocialLink(newLink);
        // Hook update triggers re-render with new settings
    };

    const handleDeleteSocialLink = async (id: string) => {
        if (confirm('Are you sure you want to delete this link?')) {
            await deleteSocialLink(id);
        }
    };

    const handleToggleSocialEnabled = (id: string) => {
        setSocialForm(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
            )
        );
        setIsFormDirty(true);
    };

    const handleSaveSocials = async () => {
        try {
            setIsSaving(true);
            await updateSocials(socialForm);
            setIsFormDirty(false);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Floating Actions Handlers ---

    const handleFloatingActionChange = (id: string, field: keyof FloatingAction, value: unknown) => {
        setFloatingActionsForm(prev =>
            prev.map(action =>
                action.id === id ? { ...action, [field]: value } : action
            )
        );
        setIsFormDirty(true);
    };

    const handleAddFloatingAction = async () => {
        const newAction: Omit<FloatingAction, 'id'> = {
            iconKey: 'facebook',
            label: 'New Action',
            href: 'https://',
            backgroundColor: '#E8A598',
            hoverColor: '#D4847A',
            isEnabled: true,
            order: floatingActionsForm.length + 1,
        };
        await addFloatingAction(newAction);
    };

    const handleDeleteFloatingAction = async (id: string) => {
        if (confirm('Are you sure you want to delete this button?')) {
            await deleteFloatingAction(id);
        }
    };

    const handleSaveFloatingActions = async () => {
        try {
            setIsSaving(true);
            await updateFloatingActions(floatingActionsForm);
            setIsFormDirty(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleFloatingEnabled = (id: string) => {
        setFloatingActionsForm(prev =>
            prev.map(action =>
                action.id === id ? { ...action, isEnabled: !action.isEnabled } : action
            )
        );
        setIsFormDirty(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{error}</p>
                <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
                        <p className="text-text-muted">Manage site-wide configuration</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('socials')}
                        className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${activeTab === 'socials'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text-primary'
                            }`}
                    >
                        <Share2 className="w-4 h-4" />
                        Social Links
                    </button>
                    <button
                        onClick={() => setActiveTab('floating')}
                        className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${activeTab === 'floating'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text-primary'
                            }`}
                    >
                        <MousePointerClick className="w-4 h-4" />
                        Floating Actions
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'socials' && (
                <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Social Media Links</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleAddSocialLink}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Link
                            </Button>
                            <Button
                                onClick={handleSaveSocials}
                                disabled={!isFormDirty || isSaving}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {socialForm.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">
                                <Share2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No social links configured</p>
                                <Button
                                    variant="secondary"
                                    onClick={handleAddSocialLink}
                                    className="mt-4"
                                >
                                    Add Your First Link
                                </Button>
                            </div>
                        ) : (
                            socialForm
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className={`border rounded-lg p-4 transition-colors ${item.isEnabled ? 'border-border bg-background' : 'border-border/50 bg-background/50 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Drag handle */}
                                            <div className="pt-2 cursor-move text-text-muted">
                                                <GripVertical className="w-5 h-5" />
                                            </div>

                                            {/* Form fields */}
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                                {/* Label */}
                                                <div className="md:col-span-3 space-y-1.5">
                                                    <label className="text-xs font-medium text-text-muted">Label</label>
                                                    <input
                                                        type="text"
                                                        value={item.label}
                                                        onChange={(e) => handleSocialChange(item.id, 'label', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    />
                                                </div>

                                                {/* Icon */}
                                                <div className="md:col-span-3 space-y-1.5">
                                                    <label className="text-xs font-medium text-text-muted">Icon/Platform</label>
                                                    <select
                                                        value={item.icon}
                                                        onChange={(e) => {
                                                            handleSocialChange(item.id, 'icon', e.target.value);
                                                            // Also update platform/label defaults if new item
                                                            if (item.label === 'New Link' || item.label === item.platform) {
                                                                handleSocialChange(item.id, 'platform', e.target.value);
                                                            }
                                                        }}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    >
                                                        {iconOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* URL */}
                                                <div className="md:col-span-6 space-y-1.5">
                                                    <label className="text-xs font-medium text-text-muted">URL</label>
                                                    <input
                                                        type="url"
                                                        value={item.url}
                                                        onChange={(e) => handleSocialChange(item.id, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleToggleSocialEnabled(item.id)}
                                                    className={`p-2 rounded-lg transition-colors ${item.isEnabled
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-text-muted hover:bg-background'
                                                        }`}
                                                    title={item.isEnabled ? 'Disable' : 'Enable'}
                                                >
                                                    {item.isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSocialLink(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'floating' && (
                <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium">Floating Action Buttons</h2>
                            <p className="text-sm text-text-muted">
                                These buttons appear on the right side of the screen (desktop only)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleAddFloatingAction}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Button
                            </Button>
                            <Button
                                onClick={handleSaveFloatingActions}
                                disabled={!isFormDirty || isSaving}
                                className="flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>

                    {floatingActionsForm.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <MousePointerClick className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No floating action buttons configured</p>
                            <Button
                                variant="secondary"
                                onClick={handleAddFloatingAction}
                                className="mt-4"
                            >
                                Add Your First Button
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {floatingActionsForm
                                .sort((a, b) => a.order - b.order)
                                .map((action) => (
                                    <div
                                        key={action.id}
                                        className={`border rounded-lg p-4 transition-colors ${action.isEnabled ? 'border-border bg-background' : 'border-border/50 bg-background/50 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Drag handle */}
                                            <div className="pt-2 cursor-move text-text-muted">
                                                <GripVertical className="w-5 h-5" />
                                            </div>

                                            {/* Preview */}
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
                                                style={{ backgroundColor: action.backgroundColor }}
                                            >
                                                <span className="text-xs font-medium uppercase">
                                                    {action.iconKey.slice(0, 2)}
                                                </span>
                                            </div>

                                            {/* Form fields */}
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-text-muted">Icon</label>
                                                    <select
                                                        value={action.iconKey}
                                                        onChange={(e) => handleFloatingActionChange(action.id, 'iconKey', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    >
                                                        {iconOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-text-muted">Label</label>
                                                    <input
                                                        type="text"
                                                        value={action.label}
                                                        onChange={(e) => handleFloatingActionChange(action.id, 'label', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-1.5 col-span-2">
                                                    <label className="text-xs font-medium text-text-muted">URL</label>
                                                    <input
                                                        type="url"
                                                        value={action.href}
                                                        onChange={(e) => handleFloatingActionChange(action.id, 'href', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-xs font-medium text-text-muted">Colors</label>

                                                    {/* Color Pickers */}
                                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase text-text-muted">Background</label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={action.backgroundColor}
                                                                    onChange={(e) => handleFloatingActionChange(action.id, 'backgroundColor', e.target.value)}
                                                                    className="h-8 w-12 p-0 border-0 rounded overflow-hidden"
                                                                />
                                                                <span className="text-xs font-mono text-text-muted">{action.backgroundColor}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] uppercase text-text-muted">Hover</label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={action.hoverColor}
                                                                    onChange={(e) => handleFloatingActionChange(action.id, 'hoverColor', e.target.value)}
                                                                    className="h-8 w-12 p-0 border-0 rounded overflow-hidden"
                                                                />
                                                                <span className="text-xs font-mono text-text-muted">{action.hoverColor}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Presets */}
                                                    <div>
                                                        <label className="text-[10px] uppercase text-text-muted mb-1.5 block">Quick Presets</label>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {colorPresets.map((preset) => (
                                                                <button
                                                                    key={preset.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleFloatingActionChange(action.id, 'backgroundColor', preset.bg);
                                                                        handleFloatingActionChange(action.id, 'hoverColor', preset.hover);
                                                                    }}
                                                                    className={`w-6 h-6 rounded-full border-2 transition-all ${action.backgroundColor === preset.bg
                                                                        ? 'border-text-primary scale-110'
                                                                        : 'border-transparent hover:scale-105'
                                                                        }`}
                                                                    style={{ backgroundColor: preset.bg }}
                                                                    title={`${preset.name} (Bg: ${preset.bg}, Hover: ${preset.hover})`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleToggleFloatingEnabled(action.id)}
                                                    className={`p-2 rounded-lg transition-colors ${action.isEnabled
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-text-muted hover:bg-background'
                                                        }`}
                                                    title={action.isEnabled ? 'Disable' : 'Enable'}
                                                >
                                                    {action.isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFloatingAction(action.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
