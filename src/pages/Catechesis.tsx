import React from 'react';
import { useNavigate } from 'react-router-dom';
import catechesisData from '../data/catechesis.json';
import { BackToTopButton } from '../components/BackToTopButton';

interface Video {
  id: string;
  title: string;
  description: string;
}

export default function Catechesis() {
  const navigate = useNavigate();
  const videos: Video[] = catechesisData;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Оглашение
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам сайта <a href="https://uralzvon.site" target="_blank" rel="noopener noreferrer" className="hover:underline">uralzvon.site</a> © Масленников С.М.)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto mb-6">
            Огласительные беседы об основных понятиях учения Православной Церкви.
          </div>

          <button 
            onClick={() => navigate('/gospel-life/catechesis/questions')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded-full font-kurale text-lg shadow-lg hover:shadow-xl hover:brightness-110 transition-all active:scale-95 mb-4"
          >
            Контрольные вопросы
          </button>

          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          <div className="space-y-12">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="flex flex-col lg:flex-row gap-8 items-start bg-white/50 p-6 rounded-xl border border-[var(--color-ink)]/10 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Video Player */}
            <div className="w-full lg:w-3/5 aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-[var(--color-ink)]/20">
              <iframe
                src={`https://rutube.ru/play/embed/${video.id}`}
                frameBorder="0"
                allow="clipboard-write; autoplay"
                allowFullScreen
                className="w-full h-full"
                title={video.title}
              ></iframe>
            </div>

            {/* Description */}
            <div className="w-full lg:w-2/5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-cinnabar)] text-white font-bold text-sm">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-kurale text-[var(--color-ink)] leading-tight">
                  {video.title}
                </h2>
              </div>
              
              <div className="h-px bg-[var(--color-cinnabar)]/20 w-1/4"></div>
              
              <div className="text-[var(--color-ink)]/90 leading-relaxed text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {video.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
