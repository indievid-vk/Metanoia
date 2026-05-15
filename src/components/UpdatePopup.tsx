import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, RefreshCcw } from 'lucide-react';
// @ts-ignore - Virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePopup() {
  const {
    offlineReady: [offlineReady, setOfflineReady] = [false, () => {}],
    needUpdate: [needUpdate, setNeedUpdate] = [false, () => {}],
    updateServiceWorker,
  } = useRegisterSW() || {
    offlineReady: [false, () => {}],
    needUpdate: [false, () => {}],
    updateServiceWorker: (reload?: boolean) => { if(reload) window.location.reload(); },
  };

  const CURRENT_VERSION = '1.1.2'; // Increment to force popup
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'update' | 'offline' | 'new-version'>('update');

  useEffect(() => {
    // Knowledge Base Section 6: Version-based check
    const storedVersion = localStorage.getItem('appVersion');
    
    // If version mismatch or not set, show the updated window
    if (storedVersion !== CURRENT_VERSION) {
      setType('new-version');
      setShow(true);
      (window as any).pwaPopupActive = true;
    }
  }, []);

  useEffect(() => {
    // Signal that PWA check is in progress
    if (!(window as any).pwaPopupActive && !show) {
      (window as any).pwaPopupActive = true;
      
      // If after 3 seconds nothing is shown, clear the flag
      const initialTimer = setTimeout(() => {
        if (!show && !needUpdate && !offlineReady) {
          (window as any).pwaPopupActive = false;
          window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
        }
      }, 3000);
      return () => clearTimeout(initialTimer);
    }
  }, [show, needUpdate, offlineReady]);

  useEffect(() => {
    if (needUpdate || offlineReady) {
      if (needUpdate) {
        setType('update');
      } else if (offlineReady) {
        setType('offline');
      }
      setShow(true);
      (window as any).pwaPopupActive = true;
      
      if (offlineReady && !needUpdate) {
        // Show offline ready for a few seconds then hide and unlock Beatitudes
        const timer = setTimeout(() => {
          setShow(false);
          (window as any).pwaPopupActive = false;
          window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [needUpdate, offlineReady]);

  const handleUpdate = () => {
    if (type === 'update') {
      updateServiceWorker(true);
    } else if (type === 'new-version') {
      localStorage.setItem('appVersion', CURRENT_VERSION);
    }
    setShow(false);
    (window as any).pwaPopupActive = false;
    window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
  };

  const closePopup = () => {
    if (type === 'new-version') {
      localStorage.setItem('appVersion', CURRENT_VERSION);
    }
    setShow(false);
    setOfflineReady(false);
    setNeedUpdate(false);
    (window as any).pwaPopupActive = false;
    window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-6 left-4 right-4 z-[200] flex justify-center pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 pointer-events-auto flex items-center gap-4 relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-[var(--color-ink)]/20 hover:text-[var(--color-cinnabar)] transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${type === 'update' || type === 'new-version' ? 'bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)]' : 'bg-green-100 text-green-600'}`}>
              {type === 'update' || type === 'new-version' ? <RefreshCcw size={24} className={type === 'update' ? "animate-spin-slow" : ""} /> : <CheckCircle size={24} />}
            </div>
            
            <div className="flex-1 pr-4">
              <h4 className="font-izhitsa text-lg text-[var(--color-ink)] leading-tight">
                {type === 'update' ? 'Доступно обновление' : type === 'new-version' ? 'Система обновлена' : 'Готово к работе офлайн'}
              </h4>
              <p className="text-xs text-[var(--color-ink)]/60 font-sans mt-0.5">
                {type === 'update' ? 'Обновите для получения новых статей и функций' : type === 'new-version' ? `Вы перешли на версию ${CURRENT_VERSION}` : 'Приложение сохранено для доступа без интернета'}
              </p>
            </div>
            
            {(type === 'update' || type === 'new-version') && (
              <button
                onClick={handleUpdate}
                className="bg-[var(--color-cinnabar)] text-white px-4 py-2 rounded-xl font-izhitsa text-sm shadow-md active:scale-95 transition-all"
              >
                {type === 'update' ? 'Обновить' : 'Отлично'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
