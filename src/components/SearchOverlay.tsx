import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, FileText, ChevronRight, HelpCircle } from 'lucide-react';
import { performGlobalSearch, SearchResult } from '../utils/search';
import { useNavigate } from 'react-router-dom';
import { DecorativeDivider } from './DecorativeDivider';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_TAGS = [
  'Исповедь',
  'Причастие',
  'Утренние молитвы',
  'Вечерние молитвы',
  'Календарь',
  'Беседы',
  'Карта пути',
  'Заповеди'
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    // Handle Esc key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const matched = performGlobalSearch(query);
    setResults(matched);
  }, [query]);

  const handleResultClick = (url: string) => {
    navigate(url);
    onClose();
    setQuery('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'prayer':
        return <BookOpen className="text-amber-600 shrink-0" size={20} />;
      case 'sin':
        return <FileText className="text-rose-700 shrink-0" size={18} />;
      case 'catechesis':
        return <HelpCircle className="text-teal-700 shrink-0" size={19} />;
      default:
        return <ChevronRight className="text-stone-400 shrink-0" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center p-4 sm:p-6"
        >
          {/* Main search card */}
          <motion.div 
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-[var(--color-parchment)] border-2 border-[var(--color-cinnabar)]/40 w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative"
          >
            {/* Top decorative header inside layout */}
            <div className="pt-5 px-6 pb-2 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] tracking-wide flex items-center gap-2">
                  <span className="text-amber-500">✙</span> Поиск по приложению
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-black/5 text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  title="Закрыть"
                >
                  <X size={22} />
                </button>
              </div>
              <DecorativeDivider />
            </div>

            {/* Sticky input section */}
            <div className="px-6 py-2 shrink-0 relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-[var(--color-ink)]/50 pointer-events-none" size={20} />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Введите запрос (например: причастие, гордость)..."
                  className="w-full bg-white/60 focus:bg-white text-[var(--color-ink)] font-sans border border-amber-600/30 focus:border-[var(--color-cinnabar)]/60 focus:outline-none rounded-2xl pl-11 pr-10 py-3 text-base shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] transition-all placeholder:text-[var(--color-ink)]/40"
                />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-3 p-1 rounded-full text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/70 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Results scroll area */}
            <div className="flex-1 overflow-y-auto px-6 py-3 min-h-0 relative">
              {/* Top scroll subtle shadow inside area */}
              <div className="sticky top-0 left-0 right-0 h-2 bg-gradient-to-b from-[var(--color-parchment)] to-transparent pointer-events-none z-10" />

              {query.trim() === '' ? (
                /* Pre-search view: Suggestions & Tags */
                <div className="py-2 space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--color-ink)]/40 font-semibold mb-3">
                      Быстрый подбор
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TAGS.map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-3.5 py-1.5 bg-white/45 hover:bg-white border border-amber-900/10 hover:border-amber-900/35 text-[var(--color-ink)]/80 hover:text-[var(--color-ink)] font-sans text-xs rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer transition-all active:scale-95"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/30 border border-amber-200/30 p-4 rounded-xl text-[var(--color-ink)]/75 text-sm leading-relaxed font-sans mt-2">
                    <p className="font-semibold text-amber-900/80 mb-1 flex items-center gap-1.5">
                      <span>✦</span> Будет найдено:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[13px] opacity-90">
                      <li>Любая молитва (утренняя, вечерняя, ко причастию)</li>
                      <li>Духовные огласительные беседы и вопросы</li>
                      <li>Конкретные грехи, проступки и страсти</li>
                      <li>Аскетические правила, календарь, карта пути Христа</li>
                    </ul>
                  </div>
                </div>
              ) : results.length > 0 ? (
                /* Dynamic search results list */
                <div className="space-y-2 pb-4">
                  <div className="text-xs text-[var(--color-ink)]/50 pb-1 font-sans italic">
                    Найдено совпадений: {results.length}
                  </div>
                  
                  {results.map((res) => (
                    <button 
                      key={res.id}
                      onClick={() => handleResultClick(res.url)}
                      className="w-full text-left bg-white/45 hover:bg-white border border-amber-800/10 hover:border-amber-800/30 p-3.5 rounded-xl flex items-start gap-3 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] group cursor-pointer"
                    >
                      <div className="p-1.5 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                        {getResultIcon(res.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-izhitsa text-sm text-[var(--color-cinnabar)] uppercase tracking-wide truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-500/10 shrink-0">
                            {res.category}
                          </span>
                        </div>
                        <p className="text-[13px] text-stone-700 font-sans line-clamp-2 leading-relaxed opacity-90">
                          {res.snippet}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* No results state */
                <div className="text-center py-10 animate-fade-in">
                  <div className="text-amber-500/30 text-5xl mb-3">☩</div>
                  <p className="font-izhitsa text-lg text-[var(--color-cinnabar)]/70 mb-1">Ничего не найдено</p>
                  <p className="text-xs text-[var(--color-ink)]/50 font-sans">
                    Попробуйте скорректировать запрос или выбрать другой тег быстрой подсказки
                  </p>
                </div>
              )}
            </div>

            {/* Bottom bar decorative offset info */}
            <div className="border-t border-amber-900/10 bg-amber-50/20 px-6 py-3.5 shrink-0 text-center">
              <span className="text-[10px] sm:text-[11px] font-serif text-[var(--color-ink)]/45 italic">
                «Ищите же прежде Царства Божия и правды Его...» (Мф. 6:33)
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
