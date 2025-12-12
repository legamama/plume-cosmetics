import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { staticContentService, type StaticPage, type StaticPageContent } from '../../services/staticContentService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Forms
import { HomePageForm } from './forms/HomePageForm';
import { AboutPageForm } from './forms/AboutPageForm';

type Locale = 'vi' | 'en' | 'ko';

export function StaticPageEditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [page, setPage] = useState<StaticPage | null>(null);
    const [activeLocale, setActiveLocale] = useState<Locale>('vi');

    // Content State
    const [content, setContent] = useState<StaticPageContent>({
        seo_title: '',
        seo_description: '',
        seo_og_image_url: '',
        slots: {}
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            loadPage(id);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadContent(id, activeLocale);
        }
    }, [id, activeLocale]);

    async function loadPage(pageId: string) {
        try {
            const data = await staticContentService.getPage(pageId);
            setPage(data);
        } catch (error) {
            console.error('Failed to load page:', error);
        }
    }

    async function loadContent(pageId: string, locale: string) {
        setIsLoading(true);
        try {
            const data = await staticContentService.getPageContent(pageId, locale);
            setContent(data);
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const { success, error: toastError } = useToast();

    async function handleSave() {
        if (!id || !page) return;

        setIsSaving(true);
        try {
            await staticContentService.savePageContent(id, activeLocale, content);
            success('Saved successfully!');
        } catch (error: any) {
            console.error('Failed to save:', error);
            const msg = error.details || error.message || 'Failed to save changes.';
            toastError(msg);
        } finally {
            setIsSaving(false);
        }
    }

    const handleSlotChange = (key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            slots: {
                ...prev.slots,
                [key]: value
            }
        }));
    };

    if (!page) return <LoadingSpinner />;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50 z-10 py-4 border-b border-gray-200 -mx-8 px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/static-pages')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">{page.name}</h1>
                        <p className="text-xs text-gray-500">Editing content for /{page.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        {(['vi', 'en', 'ko'] as Locale[]).map((loc) => (
                            <button
                                key={loc}
                                onClick={() => setActiveLocale(loc)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeLocale === loc
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {loc.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 flex justify-center"><LoadingSpinner /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {page.slug === 'home' && (
                            <HomePageForm
                                slots={content.slots}
                                onChange={handleSlotChange}
                            />
                        )}
                        {page.slug === 'about' && (
                            <AboutPageForm
                                slots={content.slots}
                                onChange={handleSlotChange}
                            />
                        )}
                    </div>

                    {/* SEO Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                SEO Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SEO Title
                                    </label>
                                    <input
                                        type="text"
                                        value={content.seo_title}
                                        onChange={e => setContent(prev => ({ ...prev, seo_title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Page Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        value={content.seo_description}
                                        onChange={e => setContent(prev => ({ ...prev, seo_description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Description for search engines..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        OG Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={content.seo_og_image_url}
                                        onChange={e => setContent(prev => ({ ...prev, seo_og_image_url: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
