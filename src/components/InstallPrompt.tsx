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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none flex justify-center"
      >
        <div className="w-full max-w-md bg-[var(--color-parchment)] border-t-4 border-[var(--color-cinnabar)] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] pointer-events-auto relative overflow-hidden pb-8 pt-4 px-6 ring-1 ring-[var(--color-ink)]/5">
          {/* Handle bar for bottom sheet look */}
          <div className="w-12 h-1 bg-[var(--color-ink)]/10 rounded-full mx-auto mb-6" />
          
          <button 
            onClick={closePrompt}
            className="absolute top-4 right-4 p-2 text-[var(--color-ink)]/30 hover:text-[var(--color-cinnabar)] transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center gap-5">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-20 h-20 bg-[var(--color-cinnabar)] rounded-3xl flex items-center justify-center shadow-[0_12px_24px_rgba(195,59,59,0.3)] border-2 border-white/20"
              >
                <Download className="text-white" size={40} />
              </motion.div>
              {/* Badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full border-4 border-[var(--color-parchment)] flex items-center justify-center shadow-sm">
                <PlusSquare size={14} className="text-white fill-current" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">
                Помощь кающимся
              </h3>
              <p className="text-xs text-[var(--color-ink)]/50 font-izhitsa tracking-[0.2em] uppercase">
                Духовный дневник
              </p>
            </div>

            {platform === 'ios' ? (
              <div className="space-y-5 w-full">
                <p className="text-[16px] text-[var(--color-ink)] leading-relaxed italic opacity-80 px-4">
                  «Добавьте на главный экран для быстрого доступа к дневнику»
                </p>
                <div className="flex flex-col gap-4 bg-black/[0.02] p-5 rounded-2xl border border-[var(--color-ink)]/5 text-sm text-[var(--color-ink)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                      <Share size={20} className="text-blue-500" />
                    </div>
                    <span className="text-left">Нажмите «Поделиться» в нижней панели Safari</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                      <PlusSquare size={20} />
                    </div>
                    <span className="text-left">Выберите «На экран "Домой"»</span>
                  </div>
                </div>
                <button 
                  onClick={closePrompt}
                  className="text-[var(--color-cinnabar)] font-izhitsa text-sm underline underline-offset-4 opacity-60 flex items-center justify-center gap-2"
                >
                  Понятно
                </button>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-6 w-full">
                <p className="text-[16px] text-[var(--color-ink)] leading-relaxed italic opacity-80">
                  Установите приложение для работы без интернета и быстрого доступа.
                </p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-5 bg-[var(--color-cinnabar)] text-white rounded-2xl font-izhitsa text-xl shadow-[0_15px_30px_rgba(195,59,59,0.3)] active:brightness-90 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  {isInstalling ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Download size={24} />
                  )}
                  <span>{isInstalling ? 'Подготовка...' : 'Установить'}</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-5 w-full">
                <p className="text-[16px] text-[var(--color-ink)] leading-relaxed italic opacity-80">
                  Для установки используйте инструменты вашего браузера.
                </p>
                <div className="flex flex-col gap-4 bg-black/[0.02] p-5 rounded-2xl border border-[var(--color-ink)]/5 text-sm text-[var(--color-ink)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                      <MoreVertical size={20} />
                    </div>
                    <span className="text-left">Нажмите на три точки (меню)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                      <PlusSquare size={20} />
                    </div>
                    <span className="text-left">Выберите «Установить приложение»</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={closePrompt}
                  className="w-full py-4 border-2 border-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] rounded-2xl font-izhitsa text-lg hover:bg-[var(--color-cinnabar)]/5 transition-colors"
                >
                  Понятно
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
