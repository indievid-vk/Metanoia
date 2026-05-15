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
      
      const hasPrompted = localStorage.getItem('androidPwaPrompted');
      if (!hasPrompted) {
        // Show after a delay if not prompted recently
        setTimeout(() => setShow(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Fallback for Android help if no prompt event
    const checkTimer = setTimeout(() => {
      if (isAndroid && !deferredPrompt && !localStorage.getItem('androidPwaPrompted')) {
        setShow(true);
      }
    }, 15000);

    // For iOS, we show it manually since there's no event
    if (isIOS) {
      const hasPrompted = localStorage.getItem('iosPwaPrompted');
      if (!hasPrompted) {
        setTimeout(() => setShow(true), 6000);
      }
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
        localStorage.setItem('androidPwaPrompted', 'true');
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
      localStorage.setItem('iosPwaPrompted', 'true');
    } else {
      localStorage.setItem('androidPwaPrompted', 'true');
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
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none flex justify-center"
      >
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md border border-[var(--color-cinnabar)]/20 rounded-[2rem] shadow-2xl pointer-events-auto relative pb-6 pt-5 px-6">
          <button 
            onClick={closePrompt}
            className="absolute top-4 right-4 p-2 text-[var(--color-ink)]/30 hover:text-[var(--color-cinnabar)] transition-colors rounded-full"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center gap-4 mt-2">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-tr from-[var(--color-cinnabar)] to-[#d44d4d] rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
              >
                <Download className="text-white" size={28} />
              </motion.div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-izhitsa text-2xl text-[var(--color-cinnabar)]">
                Помощь кающимся
              </h3>
              <p className="text-[10px] text-[var(--color-ink)]/50 font-izhitsa tracking-[0.2em] uppercase">
                Духовный дневник
              </p>
            </div>

            {platform === 'ios' ? (
              <div className="space-y-4 w-full">
                <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed px-2">
                  Добавьте на экран «Домой» для быстрого доступа и работы без сети
                </p>
                <div className="flex flex-col gap-3 bg-[var(--color-ink)]/[0.03] p-4 rounded-2xl text-xs text-[var(--color-ink)]/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm shrink-0">
                      <Share size={16} className="text-blue-500" />
                    </div>
                    <span className="text-left font-medium">Нажмите «Поделиться» внизу</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm shrink-0">
                      <PlusSquare size={16} className="text-[var(--color-ink)]/70" />
                    </div>
                    <span className="text-left font-medium">Выберите «На экран "Домой"»</span>
                  </div>
                </div>
                <button 
                  onClick={closePrompt}
                  className="text-[var(--color-cinnabar)] font-izhitsa text-sm underline underline-offset-4 opacity-60 flex items-center justify-center gap-2 pt-2"
                >
                  Скрыть
                </button>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-5 w-full">
                <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed px-2">
                  Установите приложение для работы без интернета.
                </p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-4 bg-gradient-to-r from-[var(--color-cinnabar)] to-[#c34a4a] text-white rounded-xl font-izhitsa text-lg shadow-md hover:shadow-lg active:brightness-90 transition-all flex items-center justify-center gap-2"
                >
                  {isInstalling ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Download size={20} />
                  )}
                  <span>{isInstalling ? 'Установка...' : 'Установить'}</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed px-2">
                  Для установки используйте меню вашего браузера.
                </p>
                <div className="flex flex-col gap-3 bg-[var(--color-ink)]/[0.03] p-4 rounded-2xl text-xs text-[var(--color-ink)]/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm shrink-0">
                      <MoreVertical size={16} className="text-[var(--color-ink)]/70" />
                    </div>
                    <span className="text-left font-medium">Нажмите на три точки (меню)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm shrink-0">
                      <PlusSquare size={16} className="text-[var(--color-ink)]/70" />
                    </div>
                    <span className="text-left font-medium">Выберите «Установить приложение»</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={closePrompt}
                  className="w-full py-3 bg-[var(--color-ink)]/[0.03] text-[var(--color-ink)]/70 rounded-xl font-izhitsa text-base hover:bg-[var(--color-ink)]/[0.06] transition-colors"
                >
                  Скрыть
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
