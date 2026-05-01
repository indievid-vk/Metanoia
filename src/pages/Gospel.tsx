import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gospel() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-4">
      <div className="grid gap-4 max-w-xl mx-auto">
        <button 
          onClick={() => navigate('/gospel-life/catechesis')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Оглашение</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Фундаментальные основы православной веры для готовящихся и новоначальных.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/scripture')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Священное Писание</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Тексты Нового и Ветхого Завета, необходимые для духовного чтения.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/commandments')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Евангельские заповеди</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Свод евангельских заповедей для повседневной жизни христианина.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/death')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">О смерти</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Святоотеческое учение о переходе в вечность и памяти смертной.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/angels')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Об ангелах</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Библейское и святоотеческое учение о небесных силах и их роли в спасении.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/literature')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <h3 className="font-kurale text-xl text-[var(--color-ink)] mb-2">Душеполезная литература</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Рекомендуемые книги для духовного чтения, укрепления веры и трезвения.
          </p>
        </button>
      </div>
    </div>
  );
}
