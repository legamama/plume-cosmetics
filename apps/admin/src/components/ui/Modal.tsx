// Modal component

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`
          relative bg-surface rounded-xl shadow-medium
          w-full ${sizeStyles[size]}
          max-h-[90vh] overflow-auto
          animate-in fade-in zoom-in-95 duration-200
        `}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className={title ? 'p-6' : 'p-6'}>
                    {!title && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-hover text-text-secondary transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
