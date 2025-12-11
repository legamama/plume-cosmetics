
import { useState } from 'react';
import { Pencil, Trash2, Plus, Globe, Check, X, AlertCircle, ArrowDown } from 'lucide-react';
import { useRedirects } from '../hooks/useRedirects';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { GlassPanel } from '../components/ui/glass/GlassPanel';
import type { Redirect, RedirectInput } from '../lib/api/redirects';
import { useConfirmDialog } from '../context/ConfirmDialogContext';

const statusOptions = [
    { value: '301', label: '301 - Permanent' },
    { value: '302', label: '302 - Temporary' },
    { value: '307', label: '307 - Temporary' },
    { value: '308', label: '308 - Permanent' },
];

export function RedirectsPage() {
    const { redirects, isLoading, error, save, remove, publish, isPublishing } = useRedirects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
    const [formData, setFormData] = useState<Partial<RedirectInput>>({
        from_path: '',
        to_url: '',
        status_code: 301,
        is_enabled: true,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { confirm } = useConfirmDialog();

    const handleOpenModal = (redirect?: Redirect) => {
        if (redirect) {
            setEditingRedirect(redirect);
            setFormData({
                from_path: redirect.from_path,
                to_url: redirect.to_url,
                status_code: redirect.status_code,
                is_enabled: redirect.is_enabled,
            });
        } else {
            setEditingRedirect(null);
            setFormData({
                from_path: '',
                to_url: '',
                status_code: 301,
                is_enabled: true,
            });
        }
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRedirect(null);
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.from_path?.startsWith('/')) {
            setFormError('From path must start with /');
            return;
        }

        if (!formData.to_url) {
            setFormError('Target URL is required');
            return;
        }

        setIsSaving(true);
        try {
            await save({
                id: editingRedirect?.id,
                from_path: formData.from_path,
                to_url: formData.to_url,
                status_code: Number(formData.status_code),
                is_enabled: formData.is_enabled ?? true,
            });
            handleCloseModal();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Failed to save redirect');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, item: Redirect) => {
        e.stopPropagation();
        const confirmed = await confirm({
            title: 'Delete Redirect',
            message: 'Are you sure you want to delete this redirect?',
            details: `${item.from_path} → ${item.to_url}`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });
        if (confirmed) {
            remove(item.id);
        }
    };

    const columns = [
        {
            key: 'from_path',
            header: 'From Path',
            render: (item: Redirect) => <span className="font-mono text-sm">{item.from_path}</span>,
        },
        {
            key: 'to_url',
            header: 'Target URL',
            render: (item: Redirect) => (
                <div className="flex items-center gap-2 max-w-xs truncate" title={item.to_url}>
                    <span className="truncate">{item.to_url}</span>
                </div>
            ),
        },
        {
            key: 'status_code',
            header: 'Status',
            render: (item: Redirect) => <Badge variant={item.status_code >= 300 && item.status_code < 400 ? 'success' : 'warning'}>{item.status_code}</Badge>,
        },
        {
            key: 'is_enabled',
            header: 'Enabled',
            render: (item: Redirect) => (
                item.is_enabled
                    ? <Check size={18} className="text-green-500" />
                    : <X size={18} className="text-red-500" />
            ),
        },
        {
            key: 'updated_at',
            header: 'Last Updated',
            render: (item: Redirect) => item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-',
        },
        {
            key: 'actions',
            header: '',
            render: (item: Redirect) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}>
                        <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={(e) => handleDelete(e, item)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Redirects</h1>
                    <p className="text-text-secondary mt-1">Manage URL redirects (Netlify)</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<Globe size={16} />}
                        onClick={() => publish()}
                        isLoading={isPublishing}
                    >
                        Publish Redirects
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={16} />}
                        onClick={() => handleOpenModal()}
                    >
                        Add Redirect
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <GlassPanel>
                <Table
                    columns={columns}
                    data={redirects}
                    isLoading={isLoading}
                    keyExtractor={(item) => item.id}
                    emptyMessage="No redirects found. Create one to get started."
                />
            </GlassPanel>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingRedirect ? 'Edit Redirect' : 'Add Redirect'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="From Path"
                            value={formData.from_path}
                            onChange={(e) => setFormData({ ...formData, from_path: e.target.value })}
                            placeholder="/old-path"
                            required
                            error={formError && !formData.from_path?.startsWith('/') ? 'Must start with /' : undefined}
                            leftIcon={<span className="text-gray-400">/</span>}
                            hint="The path you want to redirect traffic from. Must start with /"
                        />

                        <div className="flex justify-center -my-2 relative z-10">
                            <div className="bg-surface border rounded-full p-1.5 text-text-muted shadow-sm">
                                <ArrowDown size={14} />
                            </div>
                        </div>

                        <Input
                            label="To URL"
                            value={formData.to_url}
                            onChange={(e) => setFormData({ ...formData, to_url: e.target.value })}
                            placeholder="/new-path or https://example.com"
                            required
                            leftIcon={<Globe size={16} />}
                            hint="Where the user should be sent. Can be relative or absolute URL."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Status Code"
                            value={String(formData.status_code)}
                            onChange={(e) => setFormData({ ...formData, status_code: Number(e.target.value) })}
                            options={statusOptions}
                        />

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-text-primary">
                                Status
                            </label>
                            <label className="flex items-center gap-3 p-2.5 border rounded-lg bg-surface cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.is_enabled}
                                        onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-plume-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-plume-coral"></div>
                                </div>
                                <span className={`text-sm font-medium ${formData.is_enabled ? 'text-text-primary' : 'text-text-muted'}`}>
                                    {formData.is_enabled ? 'Active' : 'Disabled'}
                                </span>
                            </label>
                            <p className="text-xs text-text-muted">Turn this redirect on or off.</p>
                        </div>
                    </div>


                    {formError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            <AlertCircle size={16} />
                            {formError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Check size={16} />}>
                            {editingRedirect ? 'Save Changes' : 'Create Redirect'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
