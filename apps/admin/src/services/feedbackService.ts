// Feedback service for admin CRUD operations

import { supabase } from '../lib/supabase';
import type { ProductFeedbackWithTranslations, FeedbackFormData, Locale } from '../types';

export const feedbackService = {
    /**
     * List all feedbacks for a product
     */
    async list(productId: string): Promise<ProductFeedbackWithTranslations[]> {
        try {
            // First, fetch feedbacks
            const { data: feedbacksData, error: feedbacksError } = await supabase
                .from('product_feedbacks')
                .select('*')
                .eq('product_id', productId)
                .order('sort_order', { ascending: true });

            if (feedbacksError) {
                // Table might not exist - log warning but don't fail
                console.warn('Feedbacks query failed:', feedbacksError.message);
                return [];
            }

            if (!feedbacksData || feedbacksData.length === 0) {
                return [];
            }

            // Then fetch translations
            const feedbackIds = feedbacksData.map(f => f.id);
            const { data: translationsData, error: translationsError } = await supabase
                .from('product_feedback_translations')
                .select('*')
                .in('feedback_id', feedbackIds);

            if (translationsError) {
                console.warn('Translations query failed:', translationsError.message);
            }

            // Group translations by feedback_id
            const translationsByFeedbackId = new Map<string, any[]>();
            if (translationsData) {
                for (const t of translationsData) {
                    const existing = translationsByFeedbackId.get(t.feedback_id) || [];
                    existing.push(t);
                    translationsByFeedbackId.set(t.feedback_id, existing);
                }
            }

            return feedbacksData.map(item => ({
                ...item,
                translations: translationsByFeedbackId.get(item.id) || [],
            }));
        } catch (err) {
            console.error('Error in feedbackService.list:', err);
            return [];
        }
    },

    /**
     * Create a new feedback entry
     */
    async create(productId: string, data: FeedbackFormData): Promise<ProductFeedbackWithTranslations> {
        // First, create the feedback record
        const { data: feedback, error: feedbackError } = await supabase
            .from('product_feedbacks')
            .insert({
                product_id: productId,
                image_url: data.image_url || null,
                author_name: data.author_name || null,
                author_context: data.author_context || null,
                sort_order: data.sort_order,
                is_active: data.is_active,
            })
            .select()
            .single();

        if (feedbackError) {
            console.error('Error creating feedback:', feedbackError);
            throw new Error(feedbackError.message);
        }

        // Then, create translations
        const translations = await this.saveTranslations(feedback.id, data.translations);

        return {
            ...feedback,
            translations,
        };
    },

    /**
     * Update an existing feedback entry
     */
    async update(feedbackId: string, data: FeedbackFormData): Promise<ProductFeedbackWithTranslations> {
        // Update the feedback record
        const { data: feedback, error: feedbackError } = await supabase
            .from('product_feedbacks')
            .update({
                image_url: data.image_url || null,
                author_name: data.author_name || null,
                author_context: data.author_context || null,
                sort_order: data.sort_order,
                is_active: data.is_active,
            })
            .eq('id', feedbackId)
            .select()
            .single();

        if (feedbackError) {
            console.error('Error updating feedback:', feedbackError);
            throw new Error(feedbackError.message);
        }

        // Update translations (delete existing and recreate)
        await supabase
            .from('product_feedback_translations')
            .delete()
            .eq('feedback_id', feedbackId);

        const translations = await this.saveTranslations(feedbackId, data.translations);

        return {
            ...feedback,
            translations,
        };
    },

    /**
     * Delete a feedback entry
     */
    async delete(feedbackId: string): Promise<void> {
        const { error } = await supabase
            .from('product_feedbacks')
            .delete()
            .eq('id', feedbackId);

        if (error) {
            console.error('Error deleting feedback:', error);
            throw new Error(error.message);
        }
    },

    /**
     * Reorder feedbacks
     */
    async reorder(feedbackIds: string[]): Promise<void> {
        const updates = feedbackIds.map((id, index) => ({
            id,
            sort_order: index,
        }));

        for (const update of updates) {
            const { error } = await supabase
                .from('product_feedbacks')
                .update({ sort_order: update.sort_order })
                .eq('id', update.id);

            if (error) {
                console.error('Error reordering feedback:', error);
                throw new Error(error.message);
            }
        }
    },

    /**
     * Helper: Save translations for a feedback
     */
    async saveTranslations(
        feedbackId: string,
        translations: FeedbackFormData['translations']
    ) {
        const locales: Locale[] = ['vi', 'en', 'ko'];
        const toInsert = [];

        for (const locale of locales) {
            const trans = translations[locale];
            if (trans && trans.body) {
                toInsert.push({
                    feedback_id: feedbackId,
                    locale,
                    title: trans.title || null,
                    body: trans.body,
                    context: trans.context || null,
                });
            }
        }

        if (toInsert.length === 0) {
            return [];
        }

        const { data, error } = await supabase
            .from('product_feedback_translations')
            .insert(toInsert)
            .select();

        if (error) {
            console.error('Error saving translations:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
};

export default feedbackService;
