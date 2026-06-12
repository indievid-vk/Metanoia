import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';

export default function DivineServices() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 px-4 select-text">
      {/* Decorative Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
          Богослужения
        </h1>
        <DecorativeDivider className="mb-4" />
        <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
          Порядок и последовательность общественного богослужения Православной Церкви
        </p>
      </div>

      <div className="grid gap-5 max-w-xl mx-auto">
        {/* Card 1: Daily Cycle of Services */}
        <button 
          onClick={() => navigate('/temple/divine-services/daily')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group relative overflow-hidden flex items-start gap-4 active:scale-[0.99]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-125"></div>
          
          <div className="p-3 bg-[var(--color-cinnabar)]/5 rounded-lg text-[var(--color-cinnabar)] group-hover:bg-[var(--color-cinnabar)]/10 transition-colors z-10">
            <Clock size={28} />
          </div>

          <div className="flex-1 space-y-1.5 z-10">
            <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] leading-tight">
              Суточный круг богослужения
            </h3>
            <p className="text-sm text-[var(--color-ink)]/75 leading-relaxed font-sans">
              Девять последовательных церковных служб, совершаемых Православной Церковью в течение суток, их духовный смысл и порядок.
            </p>
          </div>

          <div className="self-center text-[var(--color-cinnabar)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all z-10 shrink-0">
            <ChevronRight size={24} />
          </div>
        </button>

        {/* Card 2: Divine Liturgy */}
        <button 
          onClick={() => navigate('/temple/liturgy')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group relative overflow-hidden flex items-start gap-4 active:scale-[0.99]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-125"></div>
          
          <div className="p-3 bg-[var(--color-cinnabar)]/5 rounded-lg text-[var(--color-cinnabar)] group-hover:bg-[var(--color-cinnabar)]/10 transition-colors z-10">
            <BookOpen size={28} />
          </div>

          <div className="flex-1 space-y-1.5 z-10">
            <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] leading-tight">
              Божественная Литургия
            </h3>
            <p className="text-sm text-[var(--color-ink)]/75 leading-relaxed font-sans">
              Сердце и венец всех богослужений. Последование Литургии свт. Иоанна Златоуста и свт. Василия Великого с параллельным переводом.
            </p>
          </div>

          <div className="self-center text-[var(--color-cinnabar)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all z-10 shrink-0">
            <ChevronRight size={24} />
          </div>
        </button>
      </div>

      <div className="max-w-xl mx-auto text-sm text-[var(--color-ink)]/60 text-justify leading-relaxed font-sans pt-4">
        <p>
          Суточный круг богослужения неразрывно связан с молитвенным предстоянием перед Богом. Объединенные службы подготавливают душу христианина к главному таинству — Божественной Евхаристии, напоминающей о спасительном земном пути Господа и причащающей верующих Его Пречистым Тайнам.
        </p>
      </div>
    </div>
  );
}
