import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  threshold?: number;
  targetId?: string;
}

export function BackToTopButton({ threshold = 300, targetId = 'toc' }: BackToTopButtonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    
    const handleScroll = () => {
      if (mainElement) {
        setShow(mainElement.scrollTop > threshold);
      } else {
        setShow(window.scrollY > threshold);
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-3 lg:p-4 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all z-50 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300"
      aria-label="Вернуться к содержанию"
      title="Вернуться к содержанию"
    >
      <ArrowUp size={24} />
    </button>
  );
}
