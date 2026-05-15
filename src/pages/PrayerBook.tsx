import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DecorativeDivider } from '../components/DecorativeDivider';

export default function PrayerBook() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-8 max-w-xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">Молитвослов</h2>
        <DecorativeDivider className="mt-4" />
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate('/prayer-book/morning')}
            className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block border-l-4 border-l-[var(--color-cinnabar)]"
          >
            <div className="absolute top-2 right-2">
              <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Молитвы утренние</h3>
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
            className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block border-l-4 border-l-[var(--color-cinnabar)]"
          >
            <div className="absolute top-2 right-2">
              <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Молитвы на сон грядущим</h3>
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
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Молитвы ко Святому Причащению</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Последование ко Святому Причащению и благодарственные молитвы.
          </p>
        </button>
        <button 
          onClick={() => navigate('/prayer-book/various')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden w-full block border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Молитвы на разные случаи жизни</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Молитвы о болящих, молитвы о детях и другие прошения.
          </p>
        </button>
      </div>
    </div>
  );
}
