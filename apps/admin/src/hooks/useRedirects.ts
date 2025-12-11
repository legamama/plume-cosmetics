
import { useState, useEffect, useCallback } from 'react';
import {
    listRedirects,
    upsertRedirect,
    deleteRedirect,
    publishRedirects,
    type Redirect,
    type RedirectInput
} from '../lib/api/redirects';

interface UseRedirectsReturn {
    redirects: Redirect[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    save: (data: RedirectInput) => Promise<Redirect>;
    remove: (id: string) => Promise<void>;
    publish: () => Promise<void>;
    isPublishing: boolean;
}

export function useRedirects(): UseRedirectsReturn {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listRedirects();
            setRedirects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch redirects');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const save = useCallback(async (data: RedirectInput) => {
        try {
            const result = await upsertRedirect(data);
            await refetch(); // Refresh list after save
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save redirect';
            setError(message);
            throw new Error(message);
        }
    }, [refetch]);

    const remove = useCallback(async (id: string) => {
        try {
            await deleteRedirect(id);
            await refetch(); // Refresh list after delete
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete redirect';
            setError(message);
            throw new Error(message);
        }
    }, [refetch]);

    const publish = useCallback(async () => {
        setIsPublishing(true);
        try {
            await publishRedirects();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to publish redirects';
            setError(message);
            throw new Error(message);
        } finally {
            setIsPublishing(false);
        }
    }, []);

    return {
        redirects,
        isLoading,
        error,
        refetch,
        save,
        remove,
        publish,
        isPublishing
    };
}
