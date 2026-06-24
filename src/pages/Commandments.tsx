import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark, BookMarked } from 'lucide-react';
import commandmentsData from '../data/commandments.json';
import { BackToTopButton } from '../components/BackToTopButton';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { useBookmarksStore } from '../store';
import AsceticsContent from '../components/AsceticsContent';

const BEATITUDES = [
  "Блаженны нищие духом, ибо их есть Царство Небесное.",
  "Блаженны плачущие, ибо они утешатся.",
  "Блаженны кроткие, ибо они наследуют землю.",
  "Блаженны алчущие и жаждущие правды, ибо они насытятся.",
  "Блаженны милостивые, ибо они помилованы будут.",
  "Блаженны чистые сердцем, ибо они Бога узрят.",
  "Блаженны миротворцы, ибо они будут наречены сынами Божиими.",
  "Блаженны изгнанные за правду, ибо их есть Царство Небесное.",
  "Блаженны вы, когда будут поносить вас и гнать и всячески неправедно злословить за Меня. Радуйтесь и веселитесь, ибо велика ваша награда на небесах."
];

export default function Commandments() {
  const { setBookmark, getBookmark } = useBookmarksStore();
  const PAGE_KEY = 'commandments';
  const currentBookmark = getBookmark(PAGE_KEY);
  const [showContinue, setShowContinue] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const targetId = searchParams.get('id');
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('bg-amber-100/40', 'transition-all', 'duration-1000');
          setTimeout(() => {
            el.classList.remove('bg-amber-100/40');
          }, 3000);
        }
      }, 400);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentBookmark) {
      const timer = setTimeout(() => setShowContinue(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentBookmark]);

  const commandments = Array.isArray(commandmentsData) 
    ? commandmentsData 
    : (commandmentsData as any).default || [];

  const scrollToBookmark = () => {
    const el = document.getElementById(currentBookmark || '');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setShowContinue(false);
    }
  };

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

        {/* Заповеди Блаженств list as requested */}
        <div className="bg-white/55 border-2 border-[var(--color-cinnabar)]/25 p-6 rounded-3xl shadow-sm relative z-10 mb-8">
          <h2 className="font-izhitsa text-2xl text-center text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">Заповеди Блаженств</h2>
          <div className="text-center text-xs font-izhitsa italic text-[var(--color-ink)]/70 mb-4">(Мф. 5:3-12)</div>
          <DecorativeDivider className="mb-4" />
          <ol className="space-y-4 px-1 sm:px-2 pb-2 font-izhitsa text-stone-900">
            {BEATITUDES.map((cmd, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="font-izhitsa text-[var(--color-cinnabar)] font-bold shrink-0">{idx + 1}.</span>
                <span className="text-sm sm:text-base text-[var(--color-ink)] text-justify leading-relaxed">{cmd}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative z-10">
          {showContinue && (
            <div className="mb-6 animate-in fade-in slide-in-from-top duration-500">
              <button 
                onClick={scrollToBookmark}
                className="w-full flex items-center justify-center gap-3 bg-[var(--color-cinnabar)] text-white py-3 px-6 rounded-2xl shadow-lg hover:bg-[var(--color-cinnabar)]/90 transition-all font-izhitsa group"
              >
                <BookMarked className="group-hover:scale-110 transition-transform" />
                Продолжить чтение с последней закладки
              </button>
            </div>
          )}

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
          const isBookmarked = currentBookmark === `cmd-${idx}`;
          return (
          <div key={idx} id={`cmd-${idx}`} className={`bg-white/55 border p-6 rounded-2xl shadow-sm scroll-mt-24 transition-all duration-500 ${isMain ? 'mt-16 ring-1 ring-[var(--color-cinnabar)]/10 border-[var(--color-ink)]/10' : 'border-[var(--color-ink)]/10'} ${isBookmarked ? 'ring-2 ring-[var(--color-cinnabar)] shadow-md translate-x-1' : ''}`}>
            <div className="flex justify-between items-start mb-4 border-b border-[var(--color-cinnabar)]/20 pb-2">
              <h3 className={`font-izhitsa text-[var(--color-cinnabar)] ${isMain ? 'text-2xl uppercase tracking-wide' : 'text-xl italic'}`}>
                {cmd.title}
              </h3>
              <button
                onClick={() => setBookmark(PAGE_KEY, `cmd-${idx}`)}
                className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-[var(--color-cinnabar)] bg-[var(--color-cinnabar)]/10 scale-110' : 'text-gray-400 hover:text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/5'}`}
                title="Поставить закладку"
              >
                {isBookmarked ? <BookMarked size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
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

      {/* Аскетика дня. Практика block duplication */}
      <div className="mt-16 bg-white/55 border-2 border-[var(--color-cinnabar)]/45 p-6 rounded-3xl shadow-md relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-izhitsa text-2xl sm:text-3xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Аскетика дня. Практика
          </h2>
          <DecorativeDivider className="mb-4" />
        </div>
        <AsceticsContent />
      </div>

      </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
