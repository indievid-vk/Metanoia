import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast, ToastType } from '../hooks/useToast';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <XCircle className="text-red-500" size={20} />,
  info: <Info className="text-[var(--color-cinnabar)]" size={20} />,
};

const bgColors: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-100',
  error: 'bg-red-50 border-red-100',
  info: 'bg-[var(--color-parchment)] border-[var(--color-cinnabar)]/20',
};

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-32 left-4 right-4 sm:left-auto sm:right-6 flex flex-col items-center sm:items-end gap-2 z-[10000] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-xl max-w-sm w-full ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-izhitsa text-[var(--color-ink)]">{toast.message}</p>
            <button 
              onClick={() => remove(toast.id)}
              className="text-[var(--color-ink)]/30 hover:text-[var(--color-ink)] transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
