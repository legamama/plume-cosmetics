import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { staticContentService, type StaticPage } from '../../services/staticContentService';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function StaticPagesListPage() {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    async function loadPages() {
        try {
            const data = await staticContentService.getPages();
            setPages(data);
        } catch (error) {
            console.error('Failed to load pages:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Static Pages Content</h1>
                    <p className="text-sm text-gray-500">Manage content for hard-coded pages</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {pages.map((page) => (
                        <Link
                            key={page.id}
                            to={`/static-pages/${page.id}`}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{page.name}</h3>
                                    <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        /{page.slug}
                                    </code>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    ))}
                    {pages.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No static pages found. Please run the migration script.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
