import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <GlassToast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

function GlassToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <AlertCircle className="w-5 h-5 text-blue-400" />,
    };

    const borderColors = {
        success: 'border-green-500/30',
        error: 'border-red-500/30',
        info: 'border-blue-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full glass-panel border ${borderColors[toast.type]} shadow-lg backdrop-blur-xl min-w-[300px]`}
        >
            {icons[toast.type]}
            <span className="text-sm font-medium text-white font-mono flex-1">{toast.message}</span>
            <button onClick={onDismiss} className="text-white/50 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
}
