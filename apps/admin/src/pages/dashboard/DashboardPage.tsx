// Dashboard Page

import { Package, FileText, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProducts, useBlogPosts } from '../../hooks';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    onClick?: () => void;
}

function StatCard({ title, value, icon, description, onClick }: StatCardProps) {
    return (
        <Card
            className={onClick ? 'cursor-pointer hover:shadow-medium transition-shadow' : ''}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-secondary">{title}</p>
                    <p className="text-3xl font-semibold text-text-primary mt-1">{value}</p>
                    {description && (
                        <p className="text-xs text-text-muted mt-2">{description}</p>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-plume-rose">
                    {icon}
                </div>
            </div>
        </Card>
    );
}

export function DashboardPage() {
    const navigate = useNavigate();
    const { products } = useProducts();
    const { posts } = useBlogPosts();

    const publishedProducts = products.filter(p => p.status === 'published').length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary mt-1">
                    Welcome back! Here's what's happening with your store.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={products.length}
                    icon={<Package size={24} className="text-plume-coral" />}
                    description={`${publishedProducts} published`}
                    onClick={() => navigate('/products')}
                />
                <StatCard
                    title="Blog Posts"
                    value={posts.length}
                    icon={<FileText size={24} className="text-plume-coral" />}
                    description={`${publishedPosts} published`}
                    onClick={() => navigate('/blog')}
                />
                <StatCard
                    title="Page Views"
                    value="—"
                    icon={<Eye size={24} className="text-plume-coral" />}
                    description="Analytics coming soon"
                />
                <StatCard
                    title="Growth"
                    value="—"
                    icon={<TrendingUp size={24} className="text-plume-coral" />}
                    description="Reports coming soon"
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => navigate('/products/new')}>
                        Add New Product
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/blog/new')}>
                        Write Blog Post
                    </Button>
                </div>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
                <div className="py-8 text-center text-text-muted">
                    <p>Activity feed coming soon...</p>
                    <p className="text-sm mt-1">Track updates to products, blog posts, and more.</p>
                </div>
            </Card>
        </div>
    );
}
