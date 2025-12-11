import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ToastContainer, type ToastType } from '../components/ui/Toast';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    }, []);

    const success = useCallback((message: string) => showToast('success', message), [showToast]);
    const error = useCallback((message: string) => showToast('error', message), [showToast]);
    const info = useCallback((message: string) => showToast('info', message), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
