import React from 'react';
import commandments from '../data/commandments.json';
import { BackToTopButton } from '../components/BackToTopButton';

export default function Commandments() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Евангельские заповеди
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам сайта uralzvon.site © Масленников С.М.)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Христианские добродетели согласно евангельским заповедям.
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          <div id="toc" className="bg-white/50 p-5 rounded-lg border border-[var(--color-cinnabar)]/20 shadow-md mb-8 scroll-mt-20">
            <h4 className="font-kurale text-xl text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1 text-center italic">Содержание</h4>
        <ul className="space-y-3 text-base text-[var(--color-ink)] font-kurale">
          {commandments.map((cmd, idx) => {
            return (
            <li key={idx} className={`${cmd.title.match(/^\d+\./) && !cmd.title.match(/^\d+\.\d+/) ? 'mt-4 font-bold' : 'ml-4'}`}>
              <button 
                onClick={() => {
                  const el = document.getElementById(`cmd-${idx}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[var(--color-cinnabar)] text-left hover:underline transition-colors leading-tight"
              >
                {cmd.title}
              </button>
            </li>
          )})}
        </ul>
      </div>

      <div className="space-y-8">
        {commandments.map((cmd, idx) => {
          return (
          <div key={idx} id={`cmd-${idx}`} className={`bg-white/50 border border-[var(--color-ink)]/10 p-6 rounded-lg shadow-sm scroll-mt-20 ${cmd.title.match(/^\d+\./) && !cmd.title.match(/^\d+\.\d+/) ? 'mt-12' : ''}`}>
            <h3 className={`font-kurale text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-2 ${cmd.title.match(/^\d+\./) && !cmd.title.match(/^\d+\.\d+/) ? 'text-2xl font-bold uppercase' : 'text-xl'}`}>
              {cmd.title}
            </h3>
            <p className="text-[var(--color-ink)] leading-relaxed text-justify whitespace-pre-wrap">
              {cmd.content}
            </p>
          </div>
        )})}
      </div>
      </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
