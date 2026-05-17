import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share, PlusSquare, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from '../hooks/useToast';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'other' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    // @ts-ignore
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      // @ts-ignore
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) return;

    // Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) && !userAgent.includes('macintosh');
    const isAndroid = userAgent.includes('android');
    
    setPlatform(isIOS ? 'ios' : isAndroid ? 'other' : 'other');

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasPrompted = localStorage.getItem('androidPwaPrompted_v1.1');
      if (!hasPrompted) {
        // Show after a delay if not prompted recently
        setTimeout(() => setShow(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Fallback for Android help if no prompt event
    const checkTimer = setTimeout(() => {
      if (isAndroid && !deferredPrompt && !localStorage.getItem('androidPwaPrompted_v1.1')) {
        setShow(true);
      }
    }, 15000);

    // For iOS, we show it manually since there's no event
    if (isIOS) {
      const hasPrompted = localStorage.getItem('iosPwaPrompted_v1.1');
      // Show after a shorter delay to be more responsive
      const delay = 3500;
      
      const promptTimer = setTimeout(() => {
        // Only show if not already in standalone mode and not suppressed by another popup
        if (!hasPrompted && !(window as any).pwaPopupActive) {
          setShow(true);
        } else if (!hasPrompted) {
          // If update popup was active, wait for it to close
          const handleClosed = () => {
            setTimeout(() => setShow(true), 1000);
            window.removeEventListener('pwa-popup-closed', handleClosed);
          };
          window.addEventListener('pwa-popup-closed', handleClosed);
        }
      }, delay);
      
      return () => clearTimeout(promptTimer);
    }

    return () => {
      clearTimeout(checkTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []); // Remove deferredPrompt from deps to avoid double listeners

  const handleInstallClick = async () => {
    console.log('Install button clicked, deferredPrompt status:', !!deferredPrompt);
    
    if (!deferredPrompt) {
      toast.info('Используйте меню браузера для установки');
      return;
    }
    
    try {
      setIsInstalling(true);
      
      // Give immediate visual feedback that we are trying to prompt
      toast.info('Запуск установки...');
      
      console.log('Triggering PWA install prompt...');
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        toast.success('Приложение успешно установлено');
        setShow(false);
        setDeferredPrompt(null);
        localStorage.setItem('androidPwaPrompted_v1.1', 'true');
      } else {
        toast.info('Установка отложена');
      }
    } catch (err) {
      console.error('Install prompt error:', err);
      toast.error('Не удалось запустить установку');
    } finally {
      setIsInstalling(false);
    }
  };

  const closePrompt = () => {
    setShow(false);
    if (platform === 'ios') {
      localStorage.setItem('iosPwaPrompted_v1.1', 'true');
    } else {
      localStorage.setItem('androidPwaPrompted_v1.1', 'true');
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-[env(safe-area-inset-bottom,0px)] left-0 right-0 z-[100] p-4 pb-12 pointer-events-none flex justify-center"
      >
        <div className="w-full max-w-[340px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto relative pb-5 pt-4 px-5 overflow-hidden">
          {/* Decorative subtle gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-cinnabar)]/20 to-transparent" />
          
          <button 
            onClick={closePrompt}
            className="absolute top-3 right-3 p-1.5 text-[var(--color-ink)]/20 hover:text-[var(--color-cinnabar)] transition-colors rounded-full hover:bg-black/5"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center gap-3 mt-1">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-14 h-14 bg-gradient-to-tr from-[var(--color-cinnabar)]/80 to-[#d44d4d]/80 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 backdrop-blur-sm"
              >
                <Download className="text-white" size={24} />
              </motion.div>
            </div>
            
            <div className="space-y-0.5">
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] tracking-normal">
                Помощь кающимся
              </h3>
              <p className="text-[9px] text-[var(--color-ink)]/40 font-sans font-medium tracking-[0.15em] uppercase">
                Духовный дневник • Офлайн доступ
              </p>
            </div>

            {platform === 'ios' ? (
              <div className="space-y-3 w-full">
                <p className="text-xs text-[var(--color-ink)]/60 leading-relaxed px-4">
                  Нажмите <Share size={14} className="inline mx-1 text-blue-500" /> «Поделиться», затем <PlusSquare size={14} className="inline mx-1" /> «На экран "Домой"».
                </p>
                <button 
                  onClick={closePrompt}
                  className="text-[var(--color-cinnabar)] font-sans font-semibold text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity pt-1"
                >
                  Понятно
                </button>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-4 w-full px-2">
                <p className="text-xs text-[var(--color-ink)]/60 leading-relaxed">
                  Будет работать быстро и без интернета
                </p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-3 bg-[var(--color-cinnabar)] text-white rounded-2xl font-izhitsa text-base shadow-md hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center gap-3"
                >
                  {isInstalling ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  <span>{isInstalling ? 'Установка...' : 'Установить'}</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <div className="flex flex-col gap-2 bg-black/[0.02] p-3 rounded-2xl text-[11px] text-[var(--color-ink)]/70">
                  <div className="flex items-center gap-2">
                    <MoreVertical size={14} className="opacity-40" />
                    <span className="text-left font-medium">Нажмите на три точки в углу</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlusSquare size={14} className="opacity-40" />
                    <span className="text-left font-medium">Выберите «Добавить на гл. экран»</span>
                  </div>
                </div>
                <button
                  onClick={closePrompt}
                  className="w-full py-2.5 text-[var(--color-cinnabar)]/60 font-sans font-bold text-xs hover:text-[var(--color-cinnabar)] transition-colors"
                >
                  СКРЫТЬ
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
