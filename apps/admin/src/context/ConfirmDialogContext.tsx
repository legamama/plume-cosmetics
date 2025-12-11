// ConfirmDialog Context - Provides useConfirmDialog hook for async confirmation dialogs

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ConfirmDialog, type ConfirmDialogVariant } from '../components/ui/ConfirmDialog';

export interface ConfirmOptions {
    title: string;
    message: string;
    details?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
}

interface ConfirmDialogContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions(opts);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        resolvePromise?.(true);
        setResolvePromise(null);
        setOptions(null);
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        resolvePromise?.(false);
        setResolvePromise(null);
        setOptions(null);
    }, [resolvePromise]);

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            {options && (
                <ConfirmDialog
                    isOpen={isOpen}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    title={options.title}
                    message={options.message}
                    details={options.details}
                    confirmText={options.confirmText}
                    cancelText={options.cancelText}
                    variant={options.variant}
                />
            )}
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirmDialog() {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
    }
    return context;
}
