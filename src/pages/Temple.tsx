import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Temple() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-4">
      <div className="grid gap-4 max-w-xl mx-auto">
        <button 
          onClick={() => navigate('/temple/confession')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Исповедь</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Подготовка к исповеди. Список грехов по 8 страстям с возможностью добавления своих записей.
          </p>
        </button>

        <button 
          onClick={() => navigate('/temple/liturgy')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Литургия</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Последование Божественной Литургии свт. Иоанна Златоуста и свт. Василия Великого с переводом.
          </p>
        </button>

        <button 
          onClick={() => navigate('/temple/rules')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Правила поведения в Храме</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Тексты о благочестии в Храме, как правильно стоять, креститься и прикладываться к иконам.
          </p>
        </button>

        <button 
          onClick={() => navigate('/temple/treby')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Требы</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Инструкция по написанию записок (О здравии, О упокоении) и видам поминовений.
          </p>
        </button>

        <button 
          onClick={() => navigate('/temple/prosphora')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">О просфорах</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Что такое просфора, артос и антидор. Правила употребления, благоговейного хранения и утилизации святого хлеба.
          </p>
        </button>
      </div>
    </div>
  );
}
