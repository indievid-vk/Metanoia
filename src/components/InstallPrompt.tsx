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
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = userAgent.includes('android');
    
    // Check if app is already installed
    // @ts-ignore
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      // @ts-ignore
      || window.navigator.standalone 
      || document.referrer.includes('android-app://')
      || window.location.search.includes('mode=standalone');

    setIsStandalone(standalone);

    if (standalone) return;

    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');
    setShowFAB(true);

    // Initial check for globally captured prompt
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // Initial prompt logic
    const hasSeenInSession = sessionStorage.getItem('hasSeenWelcome_v1');
    const hasPromptedForever = localStorage.getItem('pwaPromptedForever_v1');

    if (!hasSeenInSession && !hasPromptedForever) {
      // For iOS we show instructions by timeout because there's no event
      if (isIOS) {
        const timer = setTimeout(() => {
          if (!window.matchMedia('(display-mode: standalone)').matches && !(window as any).pwaPopupActive) {
            setShow(true);
            sessionStorage.setItem('hasSeenWelcome_v1', 'true');
          }
        }, 3500);
        return () => clearTimeout(timer);
      }
      
      // For Android/Other, we wait for the event to show the prompt with the button
      // If we already have the prompt (captured globally), show it soon
      if ((window as any).deferredPrompt) {
        const timer = setTimeout(() => {
          if (!(window as any).pwaPopupActive) {
            setShow(true);
            sessionStorage.setItem('hasSeenWelcome_v1', 'true');
          }
        }, 2000);
        return () => clearTimeout(timer);
      }

      // If no prompt yet, wait up to 20s for the event before showing manual fallback
      // This long wait ensures we don't annoy the user with manual instructions 
      // when the browser is just about to fire the beforeinstallprompt event.
      const fallbackTimer = setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches && 
            !deferredPrompt && 
            !(window as any).deferredPrompt &&
            !(window as any).pwaPopupActive) {
          setShow(true);
          sessionStorage.setItem('hasSeenWelcome_v1', 'true');
        }
      }, 20000); 
      return () => clearTimeout(fallbackTimer);
    }

    // Listen for custom event from index.html listener
    const handlePromptAvailable = () => {
      console.log('Prompt became available via global listener');
      const event = (window as any).deferredPrompt;
      setDeferredPrompt(event);
      
      // Auto-show if we haven't prompted yet and no other popup is active
      if (!sessionStorage.getItem('hasSeenWelcome_v1') && 
          !localStorage.getItem('pwaPromptedForever_v1') && 
          !(window as any).pwaPopupActive) {
        setShow(true);
        sessionStorage.setItem('hasSeenWelcome_v1', 'true');
      }
    };

    window.addEventListener('pwa-prompt-available', handlePromptAvailable);

    // Listen for beforeinstallprompt just in case (though global should catch it)
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('Capture beforeinstallprompt (local)');
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
      
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
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      localStorage.setItem('pwaPromptedForever_v1', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    
    if (!promptEvent) {
      if (platform === 'ios') {
        setShow(true);
      }
      return;
    }
    
    try {
      setIsInstalling(true);
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('Приложение успешно установлено');
        setShow(false);
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
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
            onClick={() => {
              if ((window as any).deferredPrompt && !deferredPrompt) {
                setDeferredPrompt((window as any).deferredPrompt);
              }
              setShow(true);
            }}
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
                    {(deferredPrompt || (window as any).deferredPrompt) ? (
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
                    ) : (
                      <div className="bg-black/[0.03] rounded-2xl p-4 text-left space-y-3">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-ink)]/40 px-1">
                          Как установить:
                        </p>
                        <p className="text-[12px] text-[var(--color-ink)]/80 leading-relaxed px-1">
                          Используйте меню настроек браузера и выберите <strong>«Установить приложение»</strong> или <strong>«Добавить на гл. экран»</strong>.
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => closePrompt(true)}
                      className="w-full py-3.5 text-[var(--color-cinnabar)] font-sans font-bold text-xs uppercase tracking-widest opacity-80 hover:opacity-100 transition-all border-t border-black/5 mt-2"
                    >
                      Продолжить в браузере
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
