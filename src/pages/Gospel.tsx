import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gospel() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-4">
      <div className="grid gap-4 max-w-xl mx-auto">
        <button 
          onClick={() => navigate('/gospel-life/catechesis')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Оглашение</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Фундаментальные основы православной веры для готовящихся и новоначальных.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/repentance-help')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">В помощь кающимся</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Практическое руководство святителя Игнатия (EPUB) для подготовки к Таинству Исповеди.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/scripture')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Священное Писание</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Тексты Нового и Ветхого Завета, необходимые для духовного чтения.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/commandments')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Евангельские заповеди</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Свод евангельских заповедей для повседневной жизни христианина.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/death')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">О смерти</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Святоотеческое учение о переходе в вечность и памяти смертной.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/angels')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Об ангелах</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Библейское и святоотеческое учение о небесных силах и их роли в спасении.
          </p>
        </button>

        <button 
          onClick={() => navigate('/gospel-life/literature')}
          className="bg-[var(--color-parchment)] border border-[var(--color-cinnabar)]/30 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group relative overflow-hidden border-l-4 border-l-[var(--color-cinnabar)]"
        >
          <div className="absolute top-2 right-2">
            <div className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Книга</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <h3 className="font-izhitsa text-xl text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-cinnabar)] transition-colors">Душеполезная литература</h3>
          <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
            Рекомендуемые книги для духовного чтения, укрепления веры и трезвения.
          </p>
        </button>
      </div>
    </div>
  );
}
