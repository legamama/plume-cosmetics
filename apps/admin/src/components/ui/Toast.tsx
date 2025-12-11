import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
};

const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
};

export function Toast({ id, type, message, duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const Icon = iconMap[type];

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => onClose(id), 200);
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm
                transform transition-all duration-200 ease-out
                ${colorMap[type]}
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <Icon size={20} className={iconColorMap[type]} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export interface ToastContainerProps {
    toasts: Array<Omit<ToastProps, 'onClose'>>;
    onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={onClose} />
            ))}
        </div>
    );
}
