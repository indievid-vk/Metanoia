import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, X } from 'lucide-react';
import { BackToTopButton } from '../components/BackToTopButton';
import questionsData from '../data/catechesisQuestions.json';
import { DecorativeDivider } from '../components/DecorativeDivider';

interface QuestionItem {
  q: string;
  a: string;
}

interface QuestionCategory {
  category: string;
  items: QuestionItem[];
}

export default function CatechesisQuestions() {
  const categories = questionsData as QuestionCategory[];
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<{ cat: number; item: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Lazy load content to speed up initial transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (idx: number) => {
    setExpandedCategory(expandedCategory === idx ? null : idx);
    setExpandedIndex(null);
  };

  const toggleQuestion = (catIdx: number, itemIdx: number) => {
    if (expandedIndex?.cat === catIdx && expandedIndex?.item === itemIdx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex({ cat: catIdx, item: itemIdx });
    }
  };

  const filteredCategories = useMemo(() => {
    if (!debouncedQuery.trim()) return categories;
    
    const query = debouncedQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.q.toLowerCase().includes(query) || 
        item.a.toLowerCase().includes(query)
      )
    })).filter(cat => cat.items.length > 0);
  }, [categories, debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Контрольные вопросы
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам тезисов видео-лекций С.М. Масленникова)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 z-20">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-[var(--color-ink)]/40" size={20} />
            <input
              type="text"
              placeholder="Поиск по вопросам и ответам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/50 border border-[var(--color-ink)]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cinnabar)]/30 font-izhitsa"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[var(--color-ink)]/40 hover:text-[var(--color-cinnabar)]"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-[var(--color-ink)]/60 mt-2 px-1">
              Найдено категорий: {filteredCategories.length}
            </p>
          )}
        </div>

        <div className="relative z-10 space-y-4">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[var(--color-cinnabar)]/20 border-t-[var(--color-cinnabar)] rounded-full animate-spin"></div>
              <p className="text-[var(--color-ink)]/60 font-izhitsa animate-pulse">Загрузка вопросов...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((group, catIdx) => {
              const isCatExpanded = expandedCategory === catIdx || debouncedQuery.length > 0;
              
              return (
                <div key={catIdx} className="space-y-2">
                  <button
                    onClick={() => toggleCategory(catIdx)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      isCatExpanded && !debouncedQuery
                        ? 'bg-[var(--color-cinnabar)] text-white border-[var(--color-cinnabar)] shadow-md' 
                        : 'bg-white/40 text-[var(--color-ink)] border-[var(--color-ink)]/10 hover:bg-white/60'
                    }`}
                  >
                    <h2 className="font-izhitsa text-lg sm:text-xl text-left leading-tight pr-4">
                      {group.category}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-izhitsa font-medium ${isCatExpanded && !debouncedQuery ? 'bg-white/20 text-white' : 'bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)]'}`}>
                        {group.items.length}
                      </span>
                      <span className={`shrink-0 transition-transform duration-300 ${isCatExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={24} />
                      </span>
                    </div>
                  </button>
                  
                  {isCatExpanded && (
                    <div className="space-y-3 mt-4 pl-0 sm:pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {group.items.slice(0, isCatExpanded && !debouncedQuery ? undefined : 20).map((item, itemIdx) => {
                        const isExpanded = (expandedIndex?.cat === catIdx && expandedIndex?.item === itemIdx) || (debouncedQuery.length > 2 && (item.q.toLowerCase().includes(debouncedQuery.toLowerCase()) || item.a.toLowerCase().includes(debouncedQuery.toLowerCase())));
                        
                        return (
                          <div 
                            key={itemIdx} 
                            className={`border rounded-lg transition-all duration-300 ${isExpanded ? 'border-[var(--color-cinnabar)]/30 bg-white/60 shadow-md' : 'border-[var(--color-ink)]/10 bg-white/30 hover:bg-white/50'}`}
                          >
                            <button
                              onClick={() => toggleQuestion(catIdx, itemIdx)}
                              className="w-full flex items-start gap-4 p-4 text-left group"
                            >
                              <span className={`shrink-0 mt-1 transition-colors ${isExpanded ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]/40 group-hover:text-[var(--color-cinnabar)]/60'}`}>
                                <HelpCircle size={20} />
                              </span>
                              <span className={`flex-1 font-izhitsa text-lg leading-tight transition-colors ${isExpanded ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]'}`}>
                                {item.q}
                              </span>
                              <span className={`shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]/30'}`}>
                                <ChevronDown size={20} />
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="px-6 pb-6 pt-2 border-t border-[var(--color-cinnabar)]/5">
                                <div className="font-izhitsa text-[var(--color-ink)] leading-relaxed text-justify whitespace-pre-wrap">
                                  {item.a}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[var(--color-ink)]/50 italic font-izhitsa">
              Ничего не найдено по вашему запросу
            </div>
          )}
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
