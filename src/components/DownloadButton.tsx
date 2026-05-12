import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookText, ChevronRight, Loader2 } from 'lucide-react';

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
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to direct link if fetch fails
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.target = "_blank";
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
  );
}
