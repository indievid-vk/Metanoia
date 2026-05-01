import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrayerBook() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8 max-w-xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)]">Молитвослов</h2>
        <div className="ornament-divider mt-4">☩</div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate('/prayer-book/morning')}
            className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
            <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Молитвы утренние</h3>
            <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
              Молитвенное правило, читаемое после пробуждения.
            </p>
          </button>
          <button
            onClick={() => navigate('/prayer-book/morning?mode=easter')}
            className="mx-6 py-2 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded-b-lg font-izhitsa text-sm shadow-sm hover:brightness-110 transition-all text-center"
          >
            Пасхальные часы (утро)
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate('/prayer-book/evening')}
            className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
            <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Молитвы на сон грядущим</h3>
            <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
              Вечернее молитвенное правило перед отходом ко сну.
            </p>
          </button>
          <button
            onClick={() => navigate('/prayer-book/evening?mode=easter')}
            className="mx-6 py-2 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded-b-lg font-izhitsa text-sm shadow-sm hover:brightness-110 transition-all text-center"
          >
            Пасхальные часы (вечер)
          </button>
        </div>

        <button 
          onClick={() => navigate('/prayer-book/communion')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Молитвы ко Святому Причащению</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Последование ко Святому Причащению и благодарственные молитвы.
          </p>
        </button>
      </div>
    </div>
  );
}
