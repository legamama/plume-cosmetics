// Blog Editor Page

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useBlogPost } from '../../hooks';
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
import { LocaleTabPanel } from '../../components/forms/LocaleTabPanel';
import { ImagePicker } from '../../components/inputs/ImagePicker';
import type { BlogFormData, Locale, Status, SEOFields, MediaItem } from '../../types';
import { getEmptyBlogFormData } from '../../types';
import { formatDateForInput } from '../../lib/utils/formatters';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
];

export function BlogEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = id === 'new';

    const { post, isLoading: isLoadingPost, save } = useBlogPost(isNew ? undefined : id);

    const [formData, setFormData] = useState<BlogFormData>(getEmptyBlogFormData());
    const [isSaving, setIsSaving] = useState(false);
    const [activeLocale, setActiveLocale] = useState<Locale>('vi');

    // Populate form when post loads
    useEffect(() => {
        if (post) {
            const viTrans = post.translations.find(t => t.locale === 'vi');
            const enTrans = post.translations.find(t => t.locale === 'en');
            const koTrans = post.translations.find(t => t.locale === 'ko');

            setFormData({
                status: post.status,
                featured_image_url: post.featured_image_url || '',
                published_at: post.published_at || '',
                translations: {
                    vi: {
                        title: viTrans?.title || '',
                        excerpt: viTrans?.excerpt || '',
                        body: viTrans?.body || '',
                        seo: viTrans?.seo || { meta_title: '', meta_description: '', slug: '' },
                    },
                    ...(enTrans && {
                        en: {
                            title: enTrans.title,
                            excerpt: enTrans.excerpt,
                            body: enTrans.body,
                            seo: enTrans.seo,
                        },
                    }),
                    ...(koTrans && {
                        ko: {
                            title: koTrans.title,
                            excerpt: koTrans.excerpt,
                            body: koTrans.body,
                            seo: koTrans.seo,
                        },
                    }),
                },
                media: post.media,
            });
        }
    }, [post]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await save(formData);
            navigate('/blog');
        } catch (error) {
            console.error('Failed to save blog post:', error);
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
                        title: '',
                        excerpt: '',
                        body: '',
                        seo: { meta_title: '', meta_description: '', slug: '' },
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
                        title: '',
                        excerpt: '',
                        body: '',
                        seo: { meta_title: '', meta_description: '', slug: '' },
                    }),
                    seo,
                },
            },
        }));
    };

    if (!isNew && isLoadingPost) {
        return <LoadingPage />;
    }

    const currentTrans = formData.translations[activeLocale] || {
        title: '',
        excerpt: '',
        body: '',
        seo: { meta_title: '', meta_description: '', slug: '' },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/blog')}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                        aria-label="Back to blog"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">
                            {isNew ? 'New Blog Post' : 'Edit Blog Post'}
                        </h1>
                    </div>
                </div>
                <Button
                    leftIcon={<Save size={18} />}
                    onClick={handleSave}
                    isLoading={isSaving}
                >
                    Save Post
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
                                            label="Title"
                                            value={currentTrans.title}
                                            onChange={(e) => updateTranslation('vi', 'title', e.target.value)}
                                            placeholder="Enter post title in Vietnamese"
                                            required
                                        />
                                        <Textarea
                                            label="Excerpt"
                                            value={currentTrans.excerpt}
                                            onChange={(e) => updateTranslation('vi', 'excerpt', e.target.value)}
                                            placeholder="Brief summary for post previews"
                                            rows={3}
                                        />
                                        <RichTextEditor
                                            label="Body Content"
                                            value={currentTrans.body}
                                            onChange={(html) => updateTranslation('vi', 'body', html)}
                                            placeholder="Write your blog post content..."
                                            minHeight="400px"
                                        />
                                        <SEOFieldsEditor
                                            value={currentTrans.seo}
                                            onChange={(seo) => updateSEO('vi', seo)}
                                            titleSource={currentTrans.title}
                                        />
                                    </div>
                                </LocaleTabPanel>
                            </TabPanel>

                            <TabPanel value="en">
                                <LocaleTabPanel locale="en">
                                    <div className="space-y-4">
                                        <Input
                                            label="Title"
                                            value={formData.translations.en?.title || ''}
                                            onChange={(e) => updateTranslation('en', 'title', e.target.value)}
                                            placeholder="Enter post title in English"
                                        />
                                        <Textarea
                                            label="Excerpt"
                                            value={formData.translations.en?.excerpt || ''}
                                            onChange={(e) => updateTranslation('en', 'excerpt', e.target.value)}
                                            placeholder="Brief summary for post previews"
                                            rows={3}
                                        />
                                        <RichTextEditor
                                            label="Body Content"
                                            value={formData.translations.en?.body || ''}
                                            onChange={(html) => updateTranslation('en', 'body', html)}
                                            placeholder="Write your blog post content..."
                                            minHeight="400px"
                                        />
                                        <SEOFieldsEditor
                                            value={formData.translations.en?.seo || { meta_title: '', meta_description: '', slug: '' }}
                                            onChange={(seo) => updateSEO('en', seo)}
                                            titleSource={formData.translations.en?.title}
                                        />
                                    </div>
                                </LocaleTabPanel>
                            </TabPanel>

                            <TabPanel value="ko">
                                <LocaleTabPanel locale="ko">
                                    <div className="space-y-4">
                                        <Input
                                            label="Title"
                                            value={formData.translations.ko?.title || ''}
                                            onChange={(e) => updateTranslation('ko', 'title', e.target.value)}
                                            placeholder="Enter post title in Korean"
                                        />
                                        <Textarea
                                            label="Excerpt"
                                            value={formData.translations.ko?.excerpt || ''}
                                            onChange={(e) => updateTranslation('ko', 'excerpt', e.target.value)}
                                            placeholder="Brief summary for post previews"
                                            rows={3}
                                        />
                                        <RichTextEditor
                                            label="Body Content"
                                            value={formData.translations.ko?.body || ''}
                                            onChange={(html) => updateTranslation('ko', 'body', html)}
                                            placeholder="Write your blog post content..."
                                            minHeight="400px"
                                        />
                                        <SEOFieldsEditor
                                            value={formData.translations.ko?.seo || { meta_title: '', meta_description: '', slug: '' }}
                                            onChange={(seo) => updateSEO('ko', seo)}
                                            titleSource={formData.translations.ko?.title}
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Post Settings */}
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Post Settings
                        </h3>
                        <div className="space-y-4">
                            <Select
                                label="Status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                                options={STATUS_OPTIONS}
                            />
                            <Input
                                label="Publish Date"
                                type="datetime-local"
                                value={formatDateForInput(formData.published_at)}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    published_at: e.target.value ? new Date(e.target.value).toISOString() : ''
                                }))}
                            />
                        </div>
                    </Card>

                    {/* Featured Image */}
                    <Card>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Featured Image
                        </h3>
                        <div className="space-y-4">
                            <ImagePicker
                                label="Featured Image"
                                value={formData.featured_image_url}
                                onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
