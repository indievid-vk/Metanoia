import React, { useState } from 'react';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { BackToTopButton } from '../components/BackToTopButton';
import AsceticsContent from '../components/AsceticsContent';
import { TemptationTracker } from '../components/TemptationTracker';
import { BookOpen, Flame } from 'lucide-react';

export default function Ascetics() {
  const [activeTab, setActiveTab] = useState<'guide' | 'temptations'>('guide');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4 relative overflow-x-hidden">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Аскетика дня. Практика
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (выдержки из святоотеческого учения и руководство на день)
          </p>
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            {activeTab === 'guide' 
              ? 'Практические советы и суточный круг молитвы, трезвения и борьбы со страстями.'
              : 'Дневник борьбы с искушениями, помыслами и излишними услаждениями.'
            }
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/50 border border-[var(--color-cinnabar)]/10 rounded-lg p-1.5 max-w-lg mx-auto shadow-sm mb-8 relative z-10 font-izhitsa">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm rounded-md transition-all ${
              activeTab === 'guide'
                ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/30'
            }`}
          >
            <BookOpen size={16} />
            Руководство на день
          </button>
          <button
            onClick={() => setActiveTab('temptations')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm rounded-md transition-all ${
              activeTab === 'temptations'
                ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/30'
            }`}
          >
            <Flame size={16} />
            Борьба с искушениями
          </button>
        </div>

        <div className="bg-white/70 border border-[var(--color-ink)]/10 p-5 sm:p-10 rounded-3xl shadow-md relative z-10 transition-all duration-300">
          {activeTab === 'guide' ? (
            <AsceticsContent />
          ) : (
            <TemptationTracker />
          )}
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
