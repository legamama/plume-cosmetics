// Product Editor Page

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useProduct, useCategories } from '../../hooks';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Tabs, TabList, Tab, TabPanel } from '../../components/ui/Tabs';
import { LoadingPage } from '../../components/ui/LoadingSpinner';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { SEOFieldsEditor } from '../../components/forms/SEOFieldsEditor';
import { MediaGalleryEditor } from '../../components/forms/MediaGalleryEditor';
import { ExternalLinksEditor } from '../../components/forms/ExternalLinksEditor';
import { LocaleTabPanel } from '../../components/forms/LocaleTabPanel';
import { TagsInput } from '../../components/forms/TagsInput';
import type { ProductFormData, Locale, Status, SEOFields, MediaItem, ExternalLink } from '../../types';
import { getEmptyProductFormData } from '../../types';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
];

export function ProductEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = id === 'new';

    const { product, isLoading: isLoadingProduct, save } = useProduct(isNew ? undefined : id);
    const { categories, isLoading: isLoadingCategories } = useCategories();

    const [formData, setFormData] = useState<ProductFormData>(getEmptyProductFormData());
    const [isSaving, setIsSaving] = useState(false);
    const [activeLocale, setActiveLocale] = useState<Locale>('vi');

    // Populate form when product loads
    useEffect(() => {
        if (product) {
            const viTrans = product.translations.find(t => t.locale === 'vi');
            const enTrans = product.translations.find(t => t.locale === 'en');
            const koTrans = product.translations.find(t => t.locale === 'ko');

            setFormData({
                sku: product.sku,
                category_id: product.category_id,
                base_price: product.base_price,
                status: product.status,
                tags: product.tags || [],
                translations: {
                    vi: {
                        name: viTrans?.name || '',
                        short_description: viTrans?.short_description || '',
                        long_description: viTrans?.long_description || '',
                        seo: viTrans?.seo || { meta_title: '', meta_description: '', slug: '' },
                        price: viTrans?.price,
                    },
                    ...(enTrans && {
                        en: {
                            name: enTrans.name,
                            short_description: enTrans.short_description,
                            long_description: enTrans.long_description,
                            seo: enTrans.seo,
                            price: enTrans.price,
                        },
                    }),
                    ...(koTrans && {
                        ko: {
                            name: koTrans.name,
                            short_description: koTrans.short_description,
                            long_description: koTrans.long_description,
                            seo: koTrans.seo,
                            price: koTrans.price,
                        },
                    }),
                },
                media: product.media,
                external_links: product.external_links,
            });
        }
    }, [product]);

    const { success, error } = useToast();

    // ... (existing code)

    const handleSave = async () => {
        // Validation
        if (!formData.sku) {
            error('SKU is required');
            return;
        }
        if (!formData.translations.vi.name) {
            error('Product name (Vietnamese) is required');
            setActiveLocale('vi'); // Switch to tab to show user
            return;
        }

        setIsSaving(true);
        try {
            await save(formData);
            success('Product saved successfully');
            navigate('/products');
        } catch (err: any) {
            console.error('Failed to save product:', err);
            error(err.message || 'Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    const updateTranslation = (locale: Locale, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [locale]: {
                    ...(prev.translations[locale] || {
                        name: '',
                        short_description: '',
                        long_description: '',
                        seo: { meta_title: '', meta_description: '', slug: '' },
                        price: undefined,
                    }),
                    [field]: value,
                },
            },
        }));
    };

    const updateSEO = (locale: Locale, seo: SEOFields) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [locale]: {
                    ...(prev.translations[locale] || {
                        name: '',
                        short_description: '',
                        long_description: '',
                        seo: { meta_title: '', meta_description: '', slug: '' },
                    }),
                    seo,
                },
            },
        }));
    };

    if (!isNew && isLoadingProduct) {
        return <LoadingPage />;
    }

    const currentTrans = formData.translations[activeLocale] || {
        name: '',
        short_description: '',
        long_description: '',
        seo: { meta_title: '', meta_description: '', slug: '' },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        aria-label="Back to products"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">
                            {isNew ? 'New Product' : 'Edit Product'}
                        </h1>
                        {!isNew && formData.sku && (
                            <p className="text-sm text-text-secondary mt-1">SKU: {formData.sku}</p>
                        )}
                    </div>
                </div>
                <Button
                    leftIcon={<Save size={18} />}
                    onClick={handleSave}
                    isLoading={isSaving}
                >
                    Save Product
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Locale Tabs for Content */}
                    <Card>
                        <Tabs defaultValue="vi" onChange={(v) => setActiveLocale(v as Locale)}>
                            <TabList>
                                <Tab value="vi">🇻🇳 Vietnamese</Tab>
                                <Tab value="en">🇬🇧 English</Tab>
                                <Tab value="ko">🇰🇷 Korean</Tab>
                            </TabList>

                            <TabPanel value="vi">
                                <LocaleTabPanel locale="vi" isRequired>
                                    <div className="space-y-4">
                                        <Input
                                            label="Product Name"
                                            value={currentTrans.name}
                                            onChange={(e) => updateTranslation('vi', 'name', e.target.value)}
                                            placeholder="Enter product name in Vietnamese"
                                            required
                                        />
                                        <Textarea
                                            label="Short Description"
                                            value={currentTrans.short_description}
                                            onChange={(e) => updateTranslation('vi', 'short_description', e.target.value)}
                                            placeholder="Brief description for product cards"
                                            rows={2}
                                        />
                                        <RichTextEditor
                                            label="Long Description"
                                            value={currentTrans.long_description}
                                            onChange={(html) => updateTranslation('vi', 'long_description', html)}
                                            placeholder="Detailed product description..."
                                            minHeight="250px"
                                        />
                                        <SEOFieldsEditor
                                            value={currentTrans.seo}
                                            onChange={(seo) => updateSEO('vi', seo)}
                                            titleSource={currentTrans.name}
                                        />
                                        <Input
                                            label="Price (Optional Override)"
                                            type="number"
                                            value={currentTrans.price || ''}
                                            onChange={(e) => updateTranslation('vi', 'price', e.target.value ? Number(e.target.value) : undefined as any)}
                                            placeholder="Leave empty to use Base Price"
                                            min={0}
                                        />
                                    </div>
                                </LocaleTabPanel>
                            </TabPanel>

                            <TabPanel value="en">
                                <LocaleTabPanel locale="en">
                                    <div className="space-y-4">
                                        <Input
                                            label="Product Name"
                                            value={formData.translations.en?.name || ''}
                                            onChange={(e) => updateTranslation('en', 'name', e.target.value)}
                                            placeholder="Enter product name in English"
                                        />
                                        <Textarea
                                            label="Short Description"
                                            value={formData.translations.en?.short_description || ''}
                                            onChange={(e) => updateTranslation('en', 'short_description', e.target.value)}
                                            placeholder="Brief description for product cards"
                                            rows={2}
                                        />
                                        <RichTextEditor
                                            label="Long Description"
                                            value={formData.translations.en?.long_description || ''}
                                            onChange={(html) => updateTranslation('en', 'long_description', html)}
                                            placeholder="Detailed product description..."
                                            minHeight="250px"
                                        />
                                        <SEOFieldsEditor
                                            value={formData.translations.en?.seo || { meta_title: '', meta_description: '', slug: '' }}
                                            onChange={(seo) => updateSEO('en', seo)}
                                            titleSource={formData.translations.en?.name}
                                        />
                                        <Input
                                            label="Price (Optional Override)"
                                            type="number"
                                            value={formData.translations.en?.price || ''}
                                            onChange={(e) => updateTranslation('en', 'price', e.target.value ? Number(e.target.value) : undefined as any)}
                                            placeholder="Leave empty to use Base Price"
                                            min={0}
                                        />
                                    </div>
                                </LocaleTabPanel>
                            </TabPanel>

                            <TabPanel value="ko">
                                <LocaleTabPanel locale="ko">
                                    <div className="space-y-4">
                                        <Input
                                            label="Product Name"
                                            value={formData.translations.ko?.name || ''}
                                            onChange={(e) => updateTranslation('ko', 'name', e.target.value)}
                                            placeholder="Enter product name in Korean"
                                        />
                                        <Textarea
                                            label="Short Description"
                                            value={formData.translations.ko?.short_description || ''}
                                            onChange={(e) => updateTranslation('ko', 'short_description', e.target.value)}
                                            placeholder="Brief description for product cards"
                                            rows={2}
                                        />
                                        <RichTextEditor
                                            label="Long Description"
                                            value={formData.translations.ko?.long_description || ''}
                                            onChange={(html) => updateTranslation('ko', 'long_description', html)}
                                            placeholder="Detailed product description..."
                                            minHeight="250px"
                                        />
                                        <SEOFieldsEditor
                                            value={formData.translations.ko?.seo || { meta_title: '', meta_description: '', slug: '' }}
                                            onChange={(seo) => updateSEO('ko', seo)}
                                            titleSource={formData.translations.ko?.name}
                                        />
                                        <Input
                                            label="Price (Optional Override)"
                                            type="number"
                                            value={formData.translations.ko?.price || ''}
                                            onChange={(e) => updateTranslation('ko', 'price', e.target.value ? Number(e.target.value) : undefined as any)}
                                            placeholder="Leave empty to use Base Price"
                                            min={0}
                                        />
                                    </div>
                                </LocaleTabPanel>
                            </TabPanel>
                        </Tabs>
                    </Card>

                    {/* Media Gallery */}
                    <Card>
                        <MediaGalleryEditor
                            value={formData.media as MediaItem[]}
                            onChange={(media) => setFormData(prev => ({ ...prev, media }))}
                        />
                    </Card>

                    {/* External Links */}
                    <Card>
                        <ExternalLinksEditor
                            value={formData.external_links as ExternalLink[]}
                            onChange={(external_links) => setFormData(prev => ({ ...prev, external_links }))}
                        />
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Base Product Info */}
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Product Details
                        </h3>
                        <div className="space-y-4">
                            <Input
                                label="SKU"
                                value={formData.sku}
                                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                placeholder="PLUME-001"
                                required
                            />
                            <Select
                                label="Category"
                                value={formData.category_id || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value || null }))}
                                options={categories.map(c => ({ value: c.id, label: c.name_vi }))}
                                placeholder="Select category"
                                disabled={isLoadingCategories}
                            />
                            <TagsInput
                                tags={formData.tags}
                                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                            />
                            <Input
                                label="Base Price (VND)"
                                type="number"
                                value={formData.base_price}
                                onChange={(e) => setFormData(prev => ({ ...prev, base_price: Number(e.target.value) }))}
                                placeholder="0"
                                min={0}
                                step={1000}
                            />
                            <Select
                                label="Status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                                options={STATUS_OPTIONS}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
