// Products hook for CRUD operations

import { useState, useEffect, useCallback } from 'react';
import type { ProductWithDetails, ProductFormData } from '../types';
import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../lib/api/products';

interface UseProductsReturn {
    products: ProductWithDetails[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
    const [products, setProducts] = useState<ProductWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { products, isLoading, error, refetch };
}

interface UseProductReturn {
    product: ProductWithDetails | null;
    isLoading: boolean;
    error: string | null;
    save: (data: ProductFormData) => Promise<ProductWithDetails>;
    remove: () => Promise<void>;
}

export function useProduct(id?: string): UseProductReturn {
    const [product, setProduct] = useState<ProductWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setProduct(null);
            setIsLoading(false);
            return;
        }

        const loadProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product');
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const save = useCallback(async (data: ProductFormData): Promise<ProductWithDetails> => {
        if (id) {
            const updated = await updateProduct(id, data);
            setProduct(updated);
            return updated;
        } else {
            return await createProduct(data);
        }
    }, [id]);

    const remove = useCallback(async () => {
        if (!id) throw new Error('Cannot delete product without ID');
        await deleteProduct(id);
        setProduct(null);
    }, [id]);

    return { product, isLoading, error, save, remove };
}
