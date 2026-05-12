import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';

const CURRENT_VERSION = '1.0.1'; // Update this string to trigger the popup for users

export default function UpdatePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const savedVersion = localStorage.getItem('appVersion');
      
      if (!savedVersion) {
        // First time installing after this feature is added.
        // Don't show the popup immediately, just save the version.
        localStorage.setItem('appVersion', CURRENT_VERSION);
      } else if (savedVersion !== CURRENT_VERSION) {
        // App has updated!
        setShow(true);
      }
    } catch (e) {
      console.warn('Storage access failed:', e);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem('appVersion', CURRENT_VERSION);
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[var(--color-parchment)] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border-2 border-[var(--color-cinnabar)]/20 relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[var(--color-ink)]/40 hover:text-[var(--color-cinnabar)] transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 ring-8 ring-green-50">
              <CheckCircle size={32} />
            </div>
            
            <h3 className="font-izhitsa text-2xl text-[var(--color-cinnabar)]">
              Обновление
            </h3>
            
            <p className="text-lg text-[var(--color-ink)] font-izhitsa">
              Приложение обновилось,<br/>и стало удобнее!
            </p>
            
            <button
              onClick={handleClose}
              className="mt-4 w-full py-3 bg-[var(--color-cinnabar)] text-white rounded-xl font-izhitsa text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Отлично
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
