import React from 'react';
import { BookText, ChevronRight } from 'lucide-react';

export default function Angels() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Об ангелах
          </h1>
          <p className="text-sm text-[var(--color-ink)]/60 italic mb-4">
            По трудам святителя Игнатия Брянчанинова
          </p>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10 space-y-12">
          {/* Слово об ангелах */}
          <section className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <h2 className="font-kurale text-2xl text-[var(--color-ink)] text-center">Слово об ангелах</h2>
              
              <a 
                href="/books/Слово об ангелах.gen.epub"
                download="Слово об ангелах.gen.epub"
                className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group w-full max-w-md text-left"
              >
                <BookText className="group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex-1">
                  <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                  <div className="text-lg leading-tight">Слово об ангелах</div>
                </div>
                <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
              </a>

              <div className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm leading-relaxed text-[var(--color-ink)]/90">
                <p>
                  В «Слове об ангелах» подробно излагается библейское и святоотеческое учение об ангелах: их сотворении, духовной природе, иерархии, служении как посланников Божиих и видимом облике, подобном человеческому.
                </p>
                <p className="mt-4">
                  Свт. Игнатий (Брянчанинов) описывает падение части ангелов во главе с Денницей и их превращение в демонов, а также неустанное служение святых ангелов делу спасения человеческого рода.
                </p>
              </div>
            </div>
          </section>

          <div className="ornament-divider opacity-30">❦</div>

          {/* Слово о чувственном и о духовном видении духов */}
          <section className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <h2 className="font-kurale text-2xl text-[var(--color-ink)] text-center">Слово о чувственном и о духовном видении духов</h2>
              
              <a 
                href="/books/Слово о чувственном и о духовном видении духов.gen.epub"
                download="Слово о чувственном и о духовном видении духов.gen.epub"
                className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group w-full max-w-md text-left"
              >
                <BookText className="group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex-1">
                  <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                  <div className="text-lg leading-tight">Слово о чувственном и о духовном видении духов</div>
                </div>
                <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
              </a>

              <div className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm leading-relaxed text-[var(--color-ink)]/90">
                <p>
                  В этом труде святитель Игнатий раскрывает учение Православной Церкви о существовании мира духов и возможности общения с ними. Автор предостерегает от опасности стремления к чувственному видению духов, которое в падшем состоянии человека неизбежно ведет к обольщению демонами и духовной гибели.
                </p>
                <p className="mt-4">
                  Подлинное духовное видение, по учению отцов, даруется Богом лишь по мере очищения сердца покаянием и требует глубокого смирения и руководства святоотеческим преданием.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
