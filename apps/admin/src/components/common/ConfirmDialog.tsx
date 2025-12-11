// Confirm Dialog component

import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className={`
              p-2 rounded-full
              ${variant === 'danger' ? 'bg-red-100' : 'bg-plume-amber/20'}
            `}
                    >
                        <AlertTriangle
                            size={24}
                            className={variant === 'danger' ? 'text-red-600' : 'text-plume-amber-dark'}
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                        <p className="mt-2 text-sm text-text-secondary">{message}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
