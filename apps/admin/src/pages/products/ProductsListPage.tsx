// Products List Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProducts } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatCurrency } from '../../lib/utils/formatters';
import type { ProductWithDetails } from '../../types';
import { deleteProduct, updateProductOrder } from '../../lib/api/products';

// Sortable Row Component
function SortableProductRow({
    product,
    onEdit,
    onDelete,
}: {
    product: ProductWithDetails;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const viTrans = product.translations.find(t => t.locale === 'vi');
    const locales = product.translations.map(t => t.locale);

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-b border-border hover:bg-surface-hover transition-colors"
        >
            {/* Drag Handle */}
            <td className="px-4 py-3 w-12">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 cursor-grab hover:bg-plume-rose/20 rounded text-text-muted hover:text-text-primary"
                    aria-label="Drag to reorder"
                >
                    <GripVertical size={16} />
                </button>
            </td>
            <td className="px-4 py-3 w-[120px]">
                <span className="font-mono text-sm">{product.sku}</span>
            </td>
            <td className="px-4 py-3">
                <div>
                    <div className="font-medium">{viTrans?.name || '(No Vietnamese name)'}</div>
                    {product.category && (
                        <div className="text-xs text-text-muted">{product.category.name_vi}</div>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 w-[120px]">{formatCurrency(product.base_price)}</td>
            <td className="px-4 py-3 w-[100px]">
                <StatusBadge status={product.status} />
            </td>
            <td className="px-4 py-3 w-[100px]">
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
            </td>
            <td className="px-4 py-3 w-[100px]">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="p-2 text-text-muted hover:text-plume-coral hover:bg-plume-rose/50 rounded-lg transition-colors"
                        aria-label="Edit product"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete product"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export function ProductsListPage() {
    const navigate = useNavigate();
    const { products, isLoading, refetch } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<ProductWithDetails | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Sort products by sort_order for display
    const sortedProducts = [...products].sort((a, b) => {
        const aOrder = (a as any).sort_order ?? 0;
        const bOrder = (b as any).sort_order ?? 0;
        return aOrder - bOrder;
    });

    // Filter products by search query (after sorting)
    const filteredProducts = sortedProducts.filter((product) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const viName = product.translations.find(t => t.locale === 'vi')?.name || '';
        return (
            product.sku.toLowerCase().includes(query) ||
            viName.toLowerCase().includes(query)
        );
    });

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedProducts.findIndex(p => p.id === active.id);
            const newIndex = sortedProducts.findIndex(p => p.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedProducts = arrayMove(sortedProducts, oldIndex, newIndex);

                // Save the new order to the database
                setIsSavingOrder(true);
                try {
                    const orderUpdates = reorderedProducts.map((p, index) => ({
                        id: p.id,
                        sort_order: index,
                    }));
                    await updateProductOrder(orderUpdates);
                    await refetch();
                } catch (error) {
                    console.error('Failed to update product order:', error);
                } finally {
                    setIsSavingOrder(false);
                }
            }
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteProduct(deleteTarget.id);
            await refetch();
            setDeleteTarget(null);
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Manage your product catalog. Drag to reorder products for landing page display.
                    </p>
                </div>
                <Button
                    leftIcon={<Plus size={18} />}
                    onClick={() => navigate('/products/new')}
                >
                    Add Product
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="w-80">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by SKU or name..."
                    />
                </div>
                {isSavingOrder && (
                    <span className="text-sm text-text-muted">Saving order...</span>
                )}
            </div>

            {/* Products Table with DnD */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-text-muted">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">No products found</div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="w-full">
                            <thead className="bg-surface-elevated border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-12"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-[120px]">SKU</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Product Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-[120px]">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-[100px]">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-[100px]">Locales</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase w-[100px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={filteredProducts.map(p => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {filteredProducts.map((product) => (
                                        <SortableProductRow
                                            key={product.id}
                                            product={product}
                                            onEdit={() => navigate(`/products/${product.id}`)}
                                            onDelete={() => setDeleteTarget(product)}
                                        />
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.translations.find(t => t.locale === 'vi')?.name || deleteTarget?.sku}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </div>
    );
}

