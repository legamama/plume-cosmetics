import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { MediaAsset } from '../types/media';

const FRONTEND_URL = 'http://localhost:3000'; // Adjust for production

export interface MediaUpdateData {
    filename?: string;
    alt_text?: string | null;
    credits?: string | null;
}

export function useMedia() {
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('media_assets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMedia(data || []);
        } catch (err: any) {
            console.error('Error fetching media:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const uploadMedia = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const formData = new FormData();
            formData.append('file', file);

            // Call the Next.js API route
            console.log('Uploading with token:', session.access_token.substring(0, 10) + '...');
            const response = await fetch(`${FRONTEND_URL}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const newAsset = await response.json();

            // Optimistically update list
            setMedia(prev => [newAsset, ...prev]);
            return newAsset;
        } catch (err: any) {
            console.error('Error uploading media:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsUploading(false);
        }
    }, []);

    const updateMedia = useCallback(async (id: string, data: MediaUpdateData) => {
        setError(null);
        try {
            const { data: updatedAsset, error } = await supabase
                .from('media_assets')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Update local state
            setMedia(prev => prev.map(item =>
                item.id === id ? { ...item, ...updatedAsset } : item
            ));

            return updatedAsset;
        } catch (err: any) {
            console.error('Error updating media:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteMedia = useCallback(async (id: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(`${FRONTEND_URL}/api/media/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            setMedia(prev => prev.filter(item => item.id !== id));
        } catch (err: any) {
            console.error('Error deleting media:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        media,
        isLoading,
        isUploading,
        error,
        fetchMedia,
        uploadMedia,
        updateMedia,
        deleteMedia
    };
}

