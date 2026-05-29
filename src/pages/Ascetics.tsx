import React from 'react';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { BackToTopButton } from '../components/BackToTopButton';
import AsceticsContent from '../components/AsceticsContent';

export default function Ascetics() {
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
            Практические советы и суточный круг молитвы, трезвения и борьбы со страстями.
          </div>
        </div>

        <div className="bg-white/70 border border-[var(--color-ink)]/10 p-5 sm:p-10 rounded-3xl shadow-md relative z-10 transition-all duration-300">
          <AsceticsContent />
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
