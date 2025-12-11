// ConfirmDialog component - Accessible confirmation modal

import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'default';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    details?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    isLoading?: boolean;
}

const variantStyles = {
    danger: {
        icon: Trash2,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        confirmVariant: 'danger' as const,
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        confirmVariant: 'primary' as const,
    },
    default: {
        icon: AlertCircle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        confirmVariant: 'primary' as const,
    },
};

export function ConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    details,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    const styles = variantStyles[variant];
    const Icon = styles.icon;

    // Focus trap and keyboard handling
    useEffect(() => {
        if (!isOpen) return;

        // Focus the cancel button for safety (user must explicitly confirm destructive actions)
        const focusTarget = variant === 'danger' ? cancelButtonRef.current : confirmButtonRef.current;
        focusTarget?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }

            // Focus trap
            if (e.key === 'Tab') {
                const focusableElements = dialogRef.current?.querySelectorAll(
                    'button:not([disabled])'
                );
                if (!focusableElements?.length) return;

                const first = focusableElements[0] as HTMLElement;
                const last = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onCancel, variant]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mx-auto mb-4`}>
                        <Icon size={24} className={styles.iconColor} />
                    </div>

                    {/* Title */}
                    <h2
                        id="confirm-dialog-title"
                        className="text-lg font-semibold text-gray-900 text-center mb-2"
                    >
                        {title}
                    </h2>

                    {/* Message */}
                    <p
                        id="confirm-dialog-message"
                        className="text-sm text-gray-600 text-center"
                    >
                        {message}
                    </p>

                    {/* Optional details */}
                    {details && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-mono break-all">
                                {details}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <Button
                        ref={cancelButtonRef}
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        ref={confirmButtonRef}
                        variant={styles.confirmVariant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className="flex-1"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
