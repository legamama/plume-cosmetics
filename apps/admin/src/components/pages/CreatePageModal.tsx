import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreatePageModalProps {
    onClose: () => void;
    onSubmit: (data: { title: string; slug: string }) => Promise<void>;
}

export function CreatePageModal({ onClose, onSubmit }: CreatePageModalProps) {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ title, slug });
            onClose();
        } catch (error) {
            console.error('Failed to create page:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Create New Page"
            size="md"
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                    label="Page Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Home, About Us"
                    required
                />
                <Input
                    label="URL Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. /home, /about"
                    hint="Start with a forward slash (/)"
                    required
                />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Create Page
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
