import React from 'react';
import commandmentsData from '../data/commandments.json';
import { BackToTopButton } from '../components/BackToTopButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

export default function Commandments() {
  const commandments = Array.isArray(commandmentsData) 
    ? commandmentsData 
    : (commandmentsData as any).default || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Евангельские заповеди
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам сайта uralzvon.site © Масленников С.М.)
          </p>
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Христианские добродетели согласно евангельским заповедям.
          </div>
        </div>

        <div className="relative z-10">
          <div id="toc" className="bg-white/50 p-5 rounded-3xl border border-[var(--color-cinnabar)]/20 shadow-md mb-8 scroll-mt-20">
            <h4 className="font-izhitsa text-xl text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1 text-center italic">Оглавление (все материалы)</h4>
        <ul className="space-y-3 text-base text-[var(--color-ink)] font-izhitsa">
          {commandments.map((cmd, idx) => {
            const isMain = cmd.title.match(/^\d+\./) && !cmd.title.match(/^\d+\.\d+/);
            return (
            <li key={idx} className={`${isMain ? 'mt-4 border-l-2 border-[var(--color-cinnabar)]/30 pl-3' : 'ml-6 border-l border-gray-200 pl-3'}`}>
              <button 
                onClick={() => {
                  const el = document.getElementById(`cmd-${idx}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`hover:text-[var(--color-cinnabar)] text-left hover:underline transition-colors leading-tight ${isMain ? 'text-[var(--color-cinnabar)]' : 'text-sm'}`}
              >
                {cmd.title}
              </button>
            </li>
          )})}
        </ul>
      </div>

      <div className="space-y-8">
        {commandments.map((cmd, idx) => {
          const isMain = cmd.title.match(/^\d+\./) && !cmd.title.match(/^\d+\.\d+/);
          return (
          <div key={idx} id={`cmd-${idx}`} className={`bg-white/55 border border-[var(--color-ink)]/10 p-6 rounded-2xl shadow-sm scroll-mt-24 ${isMain ? 'mt-16 ring-1 ring-[var(--color-cinnabar)]/10' : ''}`}>
            <h3 className={`font-izhitsa text-[var(--color-cinnabar)] mb-4 border-b border-[var(--color-cinnabar)]/20 pb-2 ${isMain ? 'text-2xl uppercase tracking-wide' : 'text-xl italic'}`}>
              {cmd.title}
            </h3>
            {cmd.content ? (
              <p className="text-[var(--color-ink)] leading-relaxed text-justify whitespace-pre-wrap font-izhitsa">
                {cmd.content}
              </p>
            ) : (
              <p className="text-[var(--color-ink)]/40 italic text-sm">
                Раздел содержит подразделы ниже...
              </p>
            )}
          </div>
        )})}
      </div>
      </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
