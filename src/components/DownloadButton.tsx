import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookText, ChevronRight, Loader2, X, HelpCircle, Check } from 'lucide-react';
import { toast } from '../hooks/useToast';

interface DownloadButtonProps {
  title: string;
  subtitle?: string;
  downloadUrl: string;
  fileName: string;
  format?: string;
  className?: string;
  key?: React.Key;
  children?: React.ReactNode;
}

export default function DownloadButton({ title, subtitle, downloadUrl, fileName, format = "EPUB", className = "" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openUrl, setOpenUrl] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    return () => {
      if (openUrl && openUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(openUrl);
      }
    };
  }, [openUrl]);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowInstructions(false);
    if (openUrl && openUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(openUrl);
      setOpenUrl('');
    }
  };

  const handleOpenNow = () => {
    window.open(openUrl, '_blank');
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setOpenUrl(url);
      setShowModal(true);
      toast.success(`Книга «${title}» успешно скачана`);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to direct link if fetch fails
      try {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.target = "_blank";
        a.click();
        
        setOpenUrl(downloadUrl);
        setShowModal(true);
        toast.info(`Скачивание книги «${title}» началось`);
      } catch (err) {
        toast.error(`Не удалось скачать книгу «${title}»`);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <motion.button 
        onClick={handleDownload}
        disabled={isDownloading}
        whileTap={{ scale: 0.96 }}
        className={`flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-[0_4px_15px_rgba(195,59,59,0.3)] active:shadow-inner transition-all font-izhitsa group w-full text-left relative overflow-hidden block ${className} ${isDownloading ? 'cursor-wait opacity-90' : ''}`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        
        <div className="relative z-10 shrink-0">
          <AnimatePresence mode="wait">
            {isDownloading ? (
              <motion.div
                key="loader"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <Loader2 className="animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <BookText className="group-hover:scale-110 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="text-xs opacity-80 font-izhitsa uppercase tracking-wider flex items-center gap-2">
            {isDownloading ? 'Загрузка...' : `Скачать ${format}`}
          </div>
          <div className="text-xl leading-tight font-izhitsa">{title}</div>
          {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
        </div>
        <ChevronRight className={`group-hover:translate-x-1 transition-transform shrink-0 relative z-10 ${isDownloading ? 'opacity-30' : ''}`} />
      </motion.button>

      {/* Download Alert Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-text">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--color-parchment)] w-full max-w-md rounded-2xl shadow-2xl border-2 border-[var(--color-cinnabar)]/25 overflow-hidden text-center relative"
            >
              {/* Decorative top pattern */}
              <div className="h-2 bg-gradient-to-r from-[var(--color-cinnabar)]/60 via-[var(--color-cinnabar)] to-[var(--color-cinnabar)]/60" />
              
              {/* Close pin */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-[var(--color-ink)]/40 hover:text-[var(--color-cinnabar)] p-1 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>

              <div className="p-6 space-y-5">
                {/* Visual ring element */}
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 shadow-sm animate-bounce-short">
                  <Check size={32} className="stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-cinnabar)] font-bold font-sans">Загрузка завершена</span>
                  <h3 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] leading-snug">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-[var(--color-ink)]/50 italic font-sans">{subtitle}</p>
                  )}
                </div>

                <div className="text-sm text-[var(--color-ink)]/80 leading-relaxed font-sans space-y-2 text-justify bg-white/50 p-4 rounded-xl border border-[var(--color-ink)]/5">
                  <p>
                    Файл книги <strong className="font-semibold text-[var(--color-ink)] select-all">{fileName}</strong> успешно загружен и сохранен на вашем устройстве!
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/60">
                    Вы можете сразу открыть его или запустить позже в любимом приложении-читалке.
                  </p>
                </div>

                {/* Core actionable buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleOpenNow}
                    className="w-full py-3.5 bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/90 text-[var(--color-parchment)] rounded-xl hover:shadow-lg hover:shadow-[var(--color-cinnabar)]/20 active:scale-[0.98] transition-all font-izhitsa text-lg flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Открыть файл
                  </button>

                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full py-2.5 bg-white/30 hover:bg-white/60 border border-[var(--color-cinnabar)]/20 text-[var(--color-cinnabar)] rounded-xl transition-all font-izhitsa text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HelpCircle size={16} />
                    {showInstructions ? 'Скрыть инструкцию' : 'Как открыть этот формат?'}
                  </button>
                </div>

                {/* Smooth instructions panel */}
                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 text-xs text-justify bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/15 rounded-xl space-y-2 text-[var(--color-ink)]/80 leading-relaxed font-sans mt-1">
                        {format === 'FB2' ? (
                          <>
                            <p className="font-semibold text-[var(--color-cinnabar)]">Формат FB2 (FictionBook):</p>
                            <p>Для чтения на телефонах и планшетах рекомендуем бесплатные программы: <strong className="text-[var(--color-ink)]">ReadEra</strong>, <strong className="text-[var(--color-ink)]">AlReader</strong> или <strong className="text-[var(--color-ink)]">FBReader</strong>.</p>
                            <p>На компьютере можно использовать проигрыватель документов Sumatra PDF или программу Calibre.</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-[var(--color-cinnabar)]">Формат EPUB:</p>
                            <p>Это самый популярный стандарт электронных книг. На устройствах от <strong className="text-[var(--color-ink)]">Apple (iOS/macOS)</strong> книга откроется автоматически в стандартном приложении «Книги».</p>
                            <p>На <strong className="text-[var(--color-ink)]">Android</strong> рекомендуем поставить приложения <strong className="text-[var(--color-ink)]">ReadEra</strong>, <strong className="text-[var(--color-ink)]">eBoox</strong> или <strong className="text-[var(--color-ink)]">Moon+ Reader</strong>.</p>
                            <p>Для компьютеров отлично подойдут программы Calibre или ридер Sumatra PDF.</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Gracious footer closer */}
                <div className="pt-2 border-t border-[var(--color-ink)]/5">
                  <button
                    onClick={handleCloseModal}
                    className="text-xs text-[var(--color-ink)]/40 hover:text-[var(--color-cinnabar)] transition-colors uppercase tracking-wider font-bold cursor-pointer"
                  >
                    Отлично, книга сохранена
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
