// Blog List Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useBlogPosts } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDate } from '../../lib/utils/formatters';
import type { BlogPostWithDetails } from '../../types';
import { deleteBlogPost } from '../../lib/api/blog';

export function BlogListPage() {
    const navigate = useNavigate();
    const { posts, isLoading, refetch } = useBlogPosts();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<BlogPostWithDetails | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter posts by search query
    const filteredPosts = posts.filter((post) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const viTitle = post.translations.find(t => t.locale === 'vi')?.title || '';
        return viTitle.toLowerCase().includes(query);
    });

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteBlogPost(deleteTarget.id);
            await refetch();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete blog post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (post: BlogPostWithDetails) => {
                const viTrans = post.translations.find(t => t.locale === 'vi');
                return (
                    <div className="flex items-center gap-3">
                        {post.featured_image_url && (
                            <img
                                src={post.featured_image_url}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                        )}
                        <div>
                            <div className="font-medium">{viTrans?.title || '(No Vietnamese title)'}</div>
                            <div className="text-xs text-text-muted line-clamp-1">
                                {viTrans?.excerpt}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: 'Status',
            width: '100px',
            render: (post: BlogPostWithDetails) => <StatusBadge status={post.status} />,
        },
        {
            key: 'published_at',
            header: 'Published',
            width: '120px',
            render: (post: BlogPostWithDetails) =>
                post.published_at ? formatDate(post.published_at) : '—',
        },
        {
            key: 'locales',
            header: 'Locales',
            width: '100px',
            render: (post: BlogPostWithDetails) => {
                const locales = post.translations.map(t => t.locale);
                return (
                    <div className="flex gap-1">
                        {['vi', 'en', 'ko'].map(locale => (
                            <span
                                key={locale}
                                className={`
                  text-xs px-1.5 py-0.5 rounded
                  ${locales.includes(locale as 'vi' | 'en' | 'ko')
                                        ? 'bg-plume-sage/20 text-plume-sage-dark'
                                        : 'bg-gray-100 text-text-muted'
                                    }
                `}
                            >
                                {locale.toUpperCase()}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'actions',
            header: '',
            width: '100px',
            render: (post: BlogPostWithDetails) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blog/${post.id}`);
                        }}
                        className="p-2 text-text-muted hover:text-plume-coral hover:bg-plume-rose/50 rounded-lg transition-colors"
                        aria-label="Edit post"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(post);
                        }}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete post"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Blog Posts</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage your blog content
                    </p>
                </div>
                <Button
                    leftIcon={<Plus size={18} />}
                    onClick={() => navigate('/blog/new')}
                >
                    New Post
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="w-80">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by title..."
                    />
                </div>
            </div>

            {/* Posts Table */}
            <Table
                columns={columns}
                data={filteredPosts}
                keyExtractor={(post) => post.id}
                isLoading={isLoading}
                emptyMessage="No blog posts found"
                onRowClick={(post) => navigate(`/blog/${post.id}`)}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Blog Post"
                message={`Are you sure you want to delete "${deleteTarget?.translations.find(t => t.locale === 'vi')?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div>
    );
}
