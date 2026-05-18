import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share, PlusSquare, MoreVertical, Loader2, Smartphone, Monitor } from 'lucide-react';
import { toast } from '../hooks/useToast';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                  (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);
    const isAndroid = userAgent.includes('android');
    
    // Check if app is already installed
    // @ts-ignore
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      // @ts-ignore
      || window.navigator.standalone 
      || document.referrer.includes('android-app://')
      || window.location.search.includes('mode=standalone');

    setIsStandalone(standalone);

    if (standalone) {
      console.log('App is in standalone mode, skipping prompt and FAB');
      return;
    }

    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');

    // Show FAB if not standalone
    setShowFAB(!standalone);

    // Initial prompt logic
    const hasSeenInSession = sessionStorage.getItem('hasSeenWelcome_v1');
    const hasPromptedForever = localStorage.getItem('pwaPromptedForever_v1');

    if (!hasSeenInSession && !hasPromptedForever) {
      const delay = isIOS ? 3000 : 5000;
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem('hasSeenWelcome_v1', 'true');
      }, delay);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // If we haven't shown in this session, maybe show now
      if (!sessionStorage.getItem('hasSeenWelcome_v1') && !localStorage.getItem('pwaPromptedForever_v1')) {
        setShow(true);
        sessionStorage.setItem('hasSeenWelcome_v1', 'true');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('App installed successfully');
      setShow(false);
      setShowFAB(false);
      localStorage.setItem('pwaPromptedForever_v1', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt event on Android/Desktop, maybe it's iOS or just not supported
      if (platform === 'ios') {
        setShow(true);
      } else {
        toast.info('Используйте меню браузера для установки');
      }
      return;
    }
    
    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('Приложение успешно установлено');
        setShow(false);
        setDeferredPrompt(null);
        localStorage.setItem('pwaPromptedForever_v1', 'true');
      }
    } catch (err) {
      console.error('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const closePrompt = (forever = false) => {
    setShow(false);
    if (forever) {
      localStorage.setItem('pwaPromptedForever_v1', 'true');
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showFAB && !show && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShow(true)}
            className="fixed bottom-24 right-5 z-[90] w-12 h-12 bg-[var(--color-cinnabar)] text-white rounded-full shadow-[0_8px_30px_rgb(195,59,59,0.4)] flex items-center justify-center border border-white/20"
          >
            <div className="relative">
              <Download size={20} />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full"
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Prompt */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[env(safe-area-inset-bottom,0px)] left-0 right-0 z-[100] p-4 pb-8 sm:pb-6 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-[360px] bg-white/95 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] pointer-events-auto relative pb-5 pt-6 px-6 overflow-hidden">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[var(--color-cinnabar)]/30 to-transparent" />
              
              <button 
                onClick={() => closePrompt()}
                className="absolute top-4 right-4 p-1.5 text-[var(--color-ink)]/20 hover:text-[var(--color-cinnabar)] transition-colors rounded-full hover:bg-black/5"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                {/* App Icon / Visual */}
                <div className="relative">
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gradient-to-tr from-[var(--color-cinnabar)] to-[#d44d4d] rounded-[1.25rem] flex items-center justify-center shadow-lg border border-white/30"
                  >
                    <Download className="text-white" size={28} />
                  </motion.div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-izhitsa text-2xl text-[var(--color-ink)] tracking-normal">
                    Установка
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink)]/60 leading-relaxed max-w-[240px]">
                    Добавьте приложение на рабочий стол для мгновенного доступа.
                  </p>
                </div>

                {platform === 'ios' ? (
                  <div className="w-full space-y-4">
                    <div className="bg-black/[0.03] rounded-2xl p-4 text-left space-y-3">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-ink)]/40 px-1">
                        Как установить вручную:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-lg shadow-sm border border-black/5 flex items-center justify-center">
                            <Share size={12} className="text-blue-500" />
                          </div>
                          <span className="text-[12px] text-[var(--color-ink)]/80 leading-tight">
                            Нажмите <strong>«Меню»</strong> или <strong>«Поделиться»</strong>
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-6 h-6 bg-white rounded-lg shadow-sm border border-black/5 flex items-center justify-center">
                            <PlusSquare size={12} className="text-gray-500" />
                          </div>
                          <span className="text-[12px] text-[var(--color-ink)]/80 leading-tight">
                            Выберите пункт <strong>«На экран "Домой"»</strong> или <strong>«Установить»</strong>
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <button 
                      onClick={() => closePrompt()}
                      className="w-full py-3.5 text-[var(--color-cinnabar)] font-sans font-bold text-xs uppercase tracking-widest opacity-80 hover:opacity-100 transition-all border-t border-black/5 mt-2"
                    >
                      Продолжить в браузере
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleInstallClick}
                      disabled={isInstalling}
                      className="w-full py-4 bg-[var(--color-cinnabar)] text-white rounded-2xl font-izhitsa text-lg shadow-[0_8px_20px_rgb(195,59,59,0.3)] hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center gap-3"
                    >
                      {isInstalling ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Smartphone size={20} />
                      )}
                      <span>{isInstalling ? 'Установка...' : 'Установить'}</span>
                    </motion.button>
                    
                    <button
                      onClick={() => closePrompt(true)}
                      className="text-[11px] font-bold text-[var(--color-ink)]/30 uppercase tracking-widest hover:text-[var(--color-cinnabar)]/60 transition-colors"
                    >
                      Больше не показывать
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
