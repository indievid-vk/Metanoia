import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, RefreshCcw } from 'lucide-react';
// @ts-ignore - Virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePopup() {
  const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

  const rSW = useRegisterSW({
    onRegistered(r) {
      if (r && isOnline()) {
        r.update().catch(err => console.warn('PWA immediate update check skipped/failed:', err));
        setInterval(() => {
          if (isOnline()) {
            r.update().catch(err => console.warn('PWA background update check skipped/failed:', err));
          }
        }, 60 * 60 * 1000);
      }
    }
  });

  const [offlineReady, setOfflineReady] = (rSW && rSW.offlineReady) || [false, () => {}];
  const [needUpdate, setNeedUpdate] = (rSW && rSW.needUpdate) || [false, () => {}];
  const updateServiceWorker = (rSW && rSW.updateServiceWorker) || ((reload?: boolean) => { if (reload) window.location.reload(); });

  const CURRENT_VERSION = '1.2.1'; 
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'update' | 'offline' | 'new-version'>('update');

  // Immediately close popup if device goes offline
  useEffect(() => {
    const handleOffline = () => {
      setShow(false);
      (window as any).pwaPopupActive = false;
      window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
    };

    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, []);

  // 1. Check for service worker updates ONLY if online
  useEffect(() => {
    if (!isOnline()) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (!isOnline()) return;
        for (const registration of registrations) {
          registration.update().catch(err => console.warn('SW registration update failed:', err));
        }
      }).catch(err => {
        console.warn('Failed to get SW registrations:', err);
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isOnline()) {
          localStorage.setItem('app_just_updated', 'true');
        }
      });
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isOnline()) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(reg => {
            if (isOnline()) {
              reg.update().catch(err => console.warn('SW ready update failed:', err));
            }
          }).catch(err => console.warn('SW ready check failed:', err));
        }
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 2. Service worker state change listener (ONLY act if online)
  useEffect(() => {
    if (!isOnline()) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        if (!isOnline()) return;

        if (reg.waiting) {
          if (typeof setNeedUpdate === 'function') {
            setNeedUpdate(true);
          }
        }

        if (reg.installing) {
          const sw = reg.installing;
          const handleStateChange = () => {
            if (sw.state === 'installed' && isOnline()) {
              if (typeof setNeedUpdate === 'function') {
                setNeedUpdate(true);
              }
            }
          };
          sw.addEventListener('statechange', handleStateChange);
        }

        const handleUpdateFound = () => {
          const sw = reg.installing;
          if (sw) {
            const handleStateChange = () => {
              if (sw.state === 'installed' && isOnline()) {
                if (typeof setNeedUpdate === 'function') {
                  setNeedUpdate(true);
                }
              }
            };
            sw.addEventListener('statechange', handleStateChange);
          }
        };
        reg.addEventListener('updatefound', handleUpdateFound);
      }).catch(err => {
        console.warn('SW ready check failed in listener:', err);
      });
    }
  }, [setNeedUpdate]);

  // Sync state with global flags for UI
  useEffect(() => {
    (window as any).pwaPopupVisible = show;
    if (show) {
      window.dispatchEvent(new CustomEvent('pwa-popup-opened'));
    } else {
      window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
    }
    return () => {
      (window as any).pwaPopupVisible = false;
    };
  }, [show]);

  // 3. Version comparison check (STRICTLY when online)
  useEffect(() => {
    if (!isOnline()) return;

    const justUpdated = localStorage.getItem('app_just_updated');
    if (justUpdated === 'true') {
      localStorage.removeItem('app_just_updated');
      localStorage.setItem('appVersion', CURRENT_VERSION);
      setType('new-version');
      setShow(true);
      (window as any).pwaPopupActive = true;
      return;
    }

    const storedVersion = localStorage.getItem('appVersion');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://')
      || window.location.search.includes('mode=standalone');

    if (storedVersion && storedVersion !== CURRENT_VERSION) {
      setType('new-version');
      setShow(true);
      (window as any).pwaPopupActive = true;
    } else if (!storedVersion) {
      if (isStandalone) {
        setType('new-version');
        setShow(true);
        (window as any).pwaPopupActive = true;
      } else {
        localStorage.setItem('appVersion', CURRENT_VERSION);
      }
    }
  }, []);

  // 4. Periodic check for version.json (STRICTLY when online)
  useEffect(() => {
    const checkVersionJson = async () => {
      if (!isOnline()) {
        return; // Skip when offline to ensure unconditional offline work
      }
      try {
        const res = await fetch(`./version.json?cache-bust=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.version && data.version !== CURRENT_VERSION && isOnline()) {
            setType('new-version');
            setShow(true);
            (window as any).pwaPopupActive = true;
          }
        }
      } catch (err) {
        // Silently catch network errors
      }
    };

    if (isOnline()) {
      checkVersionJson();
    }
    const interval = setInterval(checkVersionJson, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      (window as any).pwaPopupActive = false;
      (window as any).pwaPopupVisible = false;
      window.dispatchEvent(new CustomEvent('pwa-popup-closed'));
    };
  }, []);

  // Show update modal when needUpdate triggers AND online
  useEffect(() => {
    if (!isOnline()) {
      setShow(false);
      return;
    }

    if (needUpdate) {
      setType('update');
      setShow(true);
      (window as any).pwaPopupActive = true;
    }
  }, [needUpdate]);

  const handleUpdate = () => {
    localStorage.setItem('appVersion', CURRENT_VERSION);
    if (needUpdate && typeof updateServiceWorker === 'function') {
      updateServiceWorker(true);
    } else {
      window.location.reload();
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

  if (!isOnline() || !show) {
    return null;
  }

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
              <h4 className="font-izhitsa text-2xl text-[var(--color-ink)] leading-tight px-2">
                {type === 'offline' 
                  ? 'Готово к работе офлайн' 
                  : 'Приложение обновилось!'}
              </h4>
              <p className="text-sm text-[var(--color-ink)]/70 font-sans leading-relaxed px-2">
                {type === 'offline' 
                  ? 'Приложение сохранено в памяти вашего устройства для доступа без интернета.'
                  : 'Пользоваться стало еще удобнее'}
              </p>
            </div>
            
            {(type === 'update' || type === 'new-version') && (
              <button
                onClick={handleUpdate}
                className="w-full bg-[var(--color-cinnabar)] text-white px-6 py-4 rounded-2xl font-izhitsa text-lg shadow-lg active:scale-[0.98] transition-all mt-2 cursor-pointer"
              >
                Начать
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

