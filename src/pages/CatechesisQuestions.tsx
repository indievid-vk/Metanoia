import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import questionsData from '../data/catechesisQuestions.json';
import { BackToTopButton } from '../components/BackToTopButton';

interface QuestionItem {
  q: string;
  a: string;
}

interface QuestionCategory {
  category: string;
  items: QuestionItem[];
}

export default function CatechesisQuestions() {
  const categories: QuestionCategory[] = questionsData;
  const [expandedIndex, setExpandedIndex] = useState<{ cat: number; item: number } | null>(null);

  const toggleQuestion = (catIdx: number, itemIdx: number) => {
    if (expandedIndex?.cat === catIdx && expandedIndex?.item === itemIdx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex({ cat: catIdx, item: itemIdx });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Контрольные вопросы
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам тезисов видео-лекций С.М. Масленникова)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Проверьте свои знания по основным темам огласительных бесед.
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10 space-y-12">
          {categories.map((group, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h2 className="font-kurale text-xl sm:text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2 mb-6">
                {group.category}
              </h2>
              
              <div className="space-y-3">
                {group.items.map((item, itemIdx) => {
                  const isExpanded = expandedIndex?.cat === catIdx && expandedIndex?.item === itemIdx;
                  
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
                        <span className={`flex-1 font-kurale text-lg leading-tight transition-colors ${isExpanded ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]'}`}>
                          {item.q}
                        </span>
                        <span className={`shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]/30'}`}>
                          <ChevronDown size={20} />
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-[var(--color-cinnabar)]/5">
                          <div className="font-serif text-[var(--color-ink)] leading-relaxed text-justify whitespace-pre-wrap">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
