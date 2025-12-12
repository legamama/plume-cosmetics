// Feedback Editor Component for Product Editor Page

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Image, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '../ui/Tabs';
import { useToast } from '../../context/ToastContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import { feedbackService } from '../../services/feedbackService';
import type { ProductFeedbackWithTranslations, FeedbackFormData, Locale } from '../../types';
import { getEmptyFeedbackFormData } from '../../types';

interface FeedbackEditorProps {
    productId: string | undefined;
}

export function FeedbackEditor({ productId }: FeedbackEditorProps) {
    const { success, error: showError } = useToast();
    const { confirm } = useConfirmDialog();

    const [feedbacks, setFeedbacks] = useState<ProductFeedbackWithTranslations[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState<FeedbackFormData | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Load feedbacks when productId changes
    useEffect(() => {
        if (productId && productId !== 'new') {
            loadFeedbacks();
        }
    }, [productId]);

    const loadFeedbacks = async () => {
        if (!productId || productId === 'new') return;

        setIsLoading(true);
        try {
            const data = await feedbackService.list(productId);
            setFeedbacks(data);
        } catch (err) {
            // Service handles errors gracefully, this shouldn't happen
            console.error('Failed to load feedbacks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingFeedback(getEmptyFeedbackFormData());
        setEditingId(null);
    };

    const handleEdit = (feedback: ProductFeedbackWithTranslations) => {
        const viTrans = feedback.translations.find(t => t.locale === 'vi');
        const enTrans = feedback.translations.find(t => t.locale === 'en');
        const koTrans = feedback.translations.find(t => t.locale === 'ko');

        const formData: FeedbackFormData = {
            id: feedback.id,
            image_url: feedback.image_url || '',
            author_name: feedback.author_name || '',
            author_context: feedback.author_context || '',
            sort_order: feedback.sort_order,
            is_active: feedback.is_active,
            translations: {
                vi: {
                    title: viTrans?.title || '',
                    body: viTrans?.body || '',
                    context: viTrans?.context || '',
                },
                ...(enTrans && {
                    en: {
                        title: enTrans.title || '',
                        body: enTrans.body || '',
                        context: enTrans.context || '',
                    },
                }),
                ...(koTrans && {
                    ko: {
                        title: koTrans.title || '',
                        body: koTrans.body || '',
                        context: koTrans.context || '',
                    },
                }),
            },
        };

        setEditingFeedback(formData);
        setEditingId(feedback.id);
    };

    const handleSave = async () => {
        if (!editingFeedback || !productId || productId === 'new') return;

        // Validate required fields
        if (!editingFeedback.translations.vi.body) {
            showError('Vietnamese feedback body is required');
            return;
        }

        setIsLoading(true);
        try {
            if (editingId) {
                // Update existing
                await feedbackService.update(editingId, editingFeedback);
                success('Feedback updated successfully');
            } else {
                // Create new
                await feedbackService.create(productId, editingFeedback);
                success('Feedback created successfully');
            }

            await loadFeedbacks();
            setEditingFeedback(null);
            setEditingId(null);
        } catch (err: any) {
            console.error('Failed to save feedback:', err);
            showError(err.message || 'Failed to save feedback');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (feedbackId: string) => {
        const confirmed = await confirm({
            title: 'Delete Feedback',
            message: 'Are you sure you want to delete this customer feedback? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
        });

        if (!confirmed) return;

        setIsLoading(true);
        try {
            await feedbackService.delete(feedbackId);
            success('Feedback deleted successfully');
            await loadFeedbacks();
        } catch (err: any) {
            console.error('Failed to delete feedback:', err);
            showError(err.message || 'Failed to delete feedback');
        } finally {
            setIsLoading(false);
        }
    };

    const updateTranslation = (locale: Locale, field: string, value: string) => {
        if (!editingFeedback) return;

        setEditingFeedback(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                translations: {
                    ...prev.translations,
                    [locale]: {
                        ...(prev.translations[locale] || { title: '', body: '', context: '' }),
                        [field]: value,
                    },
                },
            };
        });
    };

    const updateField = (field: keyof FeedbackFormData, value: any) => {
        if (!editingFeedback) return;
        setEditingFeedback(prev => prev ? { ...prev, [field]: value } : prev);
    };

    // Don't show if product is new (not saved yet)
    if (!productId || productId === 'new') {
        return (
            <div className="text-center py-8 text-text-secondary">
                <p>Save the product first to add customer feedbacks.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                    Customer Feedbacks
                </h3>
                {!editingFeedback && (
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus size={16} />}
                        onClick={handleAddNew}
                    >
                        Add Feedback
                    </Button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && !editingFeedback && (
                <div className="text-center py-8 text-text-secondary">
                    Loading feedbacks...
                </div>
            )}

            {/* Edit/Create Form */}
            {editingFeedback && (
                <Card className="border-2 border-primary-500/20">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-text-primary">
                                {editingId ? 'Edit Feedback' : 'New Feedback'}
                            </h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<X size={16} />}
                                onClick={() => {
                                    setEditingFeedback(null);
                                    setEditingId(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>

                        {/* Basic Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Image URL (optional)"
                                value={editingFeedback.image_url || ''}
                                onChange={(e) => updateField('image_url', e.target.value)}
                                placeholder="https://cdn.example.com/feedback.jpg"
                            />
                            <Input
                                label="Author Name"
                                value={editingFeedback.author_name || ''}
                                onChange={(e) => updateField('author_name', e.target.value)}
                                placeholder="Nguyễn Thị Mai"
                            />
                        </div>

                        <Input
                            label="Default Author Context"
                            value={editingFeedback.author_context || ''}
                            onChange={(e) => updateField('author_context', e.target.value)}
                            placeholder="sau 2 tuần sử dụng"
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="feedback-active"
                                checked={editingFeedback.is_active}
                                onChange={(e) => updateField('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="feedback-active" className="text-sm text-text-primary">
                                Active (visible on product page)
                            </label>
                        </div>

                        {/* Locale Tabs for Content */}
                        <Tabs defaultValue="vi">
                            <TabList>
                                <Tab value="vi">🇻🇳 Vietnamese *</Tab>
                                <Tab value="en">🇬🇧 English</Tab>
                                <Tab value="ko">🇰🇷 Korean</Tab>
                            </TabList>

                            {(['vi', 'en', 'ko'] as Locale[]).map((locale) => (
                                <TabPanel key={locale} value={locale}>
                                    <div className="space-y-4 pt-4">
                                        <Input
                                            label="Title/Highlight (optional)"
                                            value={editingFeedback.translations[locale]?.title || ''}
                                            onChange={(e) => updateTranslation(locale, 'title', e.target.value)}
                                            placeholder={locale === 'vi'
                                                ? 'Da mình sáng hơn rõ rệt!'
                                                : locale === 'en'
                                                    ? 'My skin is noticeably brighter!'
                                                    : '피부가 눈에 띄게 밝아졌어요!'}
                                        />
                                        <Textarea
                                            label={`Feedback Body ${locale === 'vi' ? '*' : ''}`}
                                            value={editingFeedback.translations[locale]?.body || ''}
                                            onChange={(e) => updateTranslation(locale, 'body', e.target.value)}
                                            placeholder={locale === 'vi'
                                                ? 'Mình đã dùng sản phẩm được 2 tuần và thấy da sáng hơn rõ rệt...'
                                                : locale === 'en'
                                                    ? 'I have been using this product for 2 weeks and my skin is noticeably brighter...'
                                                    : '이 제품을 2주간 사용했는데 피부가 눈에 띄게 밝아졌어요...'}
                                            rows={4}
                                            required={locale === 'vi'}
                                        />
                                        <Input
                                            label="Context Override (optional)"
                                            value={editingFeedback.translations[locale]?.context || ''}
                                            onChange={(e) => updateTranslation(locale, 'context', e.target.value)}
                                            placeholder={locale === 'vi'
                                                ? 'sau 2 tuần sử dụng'
                                                : locale === 'en'
                                                    ? 'after 2 weeks of use'
                                                    : '2주 사용 후'}
                                        />
                                    </div>
                                </TabPanel>
                            ))}
                        </Tabs>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                leftIcon={<Save size={16} />}
                                onClick={handleSave}
                                isLoading={isLoading}
                            >
                                {editingId ? 'Update Feedback' : 'Create Feedback'}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Feedback List */}
            {!editingFeedback && feedbacks.length > 0 && (
                <div className="space-y-3">
                    {feedbacks.map((feedback) => {
                        const viTrans = feedback.translations.find(t => t.locale === 'vi');
                        const isExpanded = expandedId === feedback.id;

                        return (
                            <div
                                key={feedback.id}
                                className={`border rounded-lg transition-colors ${feedback.is_active
                                    ? 'border-neutral-200 bg-white'
                                    : 'border-neutral-100 bg-neutral-50 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-3 p-4">
                                    <GripVertical size={18} className="text-neutral-400 cursor-grab" />

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text-primary truncate">
                                            {viTrans?.title || viTrans?.body?.slice(0, 50) || 'Untitled feedback'}
                                            {viTrans?.body && viTrans.body.length > 50 ? '...' : ''}
                                        </p>
                                        {feedback.author_name && (
                                            <p className="text-sm text-text-secondary">
                                                — {feedback.author_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${feedback.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-neutral-200 text-neutral-600'
                                            }`}>
                                            {feedback.is_active ? 'Active' : 'Inactive'}
                                        </span>

                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : feedback.id)}
                                            className="p-1.5 hover:bg-neutral-100 rounded transition-colors"
                                            title={isExpanded ? 'Collapse' : 'Expand'}
                                        >
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(feedback)}
                                        >
                                            Edit
                                        </Button>

                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Preview */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-2 border-t space-y-3">
                                        {feedback.image_url && (
                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                <Image size={14} />
                                                <span className="truncate">{feedback.image_url}</span>
                                            </div>
                                        )}

                                        <div className="bg-neutral-50 rounded-lg p-3">
                                            {viTrans?.title && (
                                                <p className="font-medium text-text-primary mb-1">
                                                    "{viTrans.title}"
                                                </p>
                                            )}
                                            <p className="text-sm text-text-secondary">
                                                {viTrans?.body}
                                            </p>
                                            {feedback.author_name && (
                                                <p className="text-xs text-neutral-500 mt-2">
                                                    — {feedback.author_name}
                                                    {(viTrans?.context || feedback.author_context) && (
                                                        <>, {viTrans?.context || feedback.author_context}</>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !editingFeedback && feedbacks.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
                    <p className="text-text-secondary mb-4">
                        No customer feedbacks yet.
                    </p>
                    <Button
                        variant="secondary"
                        leftIcon={<Plus size={16} />}
                        onClick={handleAddNew}
                    >
                        Add First Feedback
                    </Button>
                </div>
            )}
        </div>
    );
}
