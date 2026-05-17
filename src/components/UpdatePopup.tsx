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

  const CURRENT_VERSION = '1.1.6'; // Increment to force popup
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'update' | 'offline' | 'new-version'>('update');

  useEffect(() => {
    // Knowledge Base Section 6: Version-based check
    const storedVersion = localStorage.getItem('appVersion');
    
    // Check if app is already installed
    // @ts-ignore
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      // @ts-ignore
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    // If version mismatch or not set
    if (storedVersion !== CURRENT_VERSION) {
      if (isStandalone) {
        // App updated and it is installed!
        setType('new-version');
        setShow(true);
        (window as any).pwaPopupActive = true;
      } else {
        // Just update version silently if not installed yet
        localStorage.setItem('appVersion', CURRENT_VERSION);
      }
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closePopup}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="relative bg-white/95 backdrop-blur-xl w-full max-w-[360px] rounded-[3rem] p-8 pb-10 shadow-[0_30px_70px_rgba(0,0,0,0.3)] border border-white/40 flex flex-col items-center text-center gap-6"
          >
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 text-[var(--color-ink)]/20 hover:text-[var(--color-cinnabar)] transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 mt-2 ${type === 'update' || type === 'new-version' ? 'bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)]' : 'bg-green-100 text-green-600'}`}>
              {type === 'update' || type === 'new-version' ? <RefreshCcw size={36} className={type === 'update' ? "animate-spin-slow" : ""} /> : <CheckCircle size={36} />}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-izhitsa text-2xl text-[var(--color-ink)] leading-tight px-4">
                {type === 'update' ? 'Приложение обновилось!' : type === 'new-version' ? 'Приложение стало удобнее' : 'Готово к работе офлайн'}
              </h4>
              <p className="text-sm text-[var(--color-ink)]/60 font-sans leading-relaxed px-2">
                {type === 'update' 
                  ? 'Мы подготовили новые статьи и исправили ошибки. Обновите приложение для доступа.' 
                  : type === 'new-version' 
                    ? 'Мы добавили новые функции и улучшили работу. Ознакомьтесь с изменениями в разделе «О приложении».' 
                    : 'Приложение сохранено в памяти вашего устройства для доступа без интернета.'}
              </p>
            </div>
            
            {(type === 'update' || type === 'new-version') && (
              <button
                onClick={handleUpdate}
                className="w-full bg-[var(--color-cinnabar)] text-white px-6 py-4 rounded-2xl font-izhitsa text-lg shadow-lg active:scale-[0.98] transition-all mt-2"
              >
                {type === 'update' ? 'Обновить сейчас' : 'Понятно'}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
