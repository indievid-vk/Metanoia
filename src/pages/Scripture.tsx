import React from 'react';
import { BookText, ChevronRight } from 'lucide-react';

const BOOKS = [
  { id: 'matthew', title: 'Евангелие от Матфея', file: 'Толкование на Евангелие от Матфея.gen.epub' },
  { id: 'mark', title: 'Евангелие от Марка', file: 'Толкование на Евангелие от Марка.gen.epub' },
  { id: 'luke', title: 'Евангелие от Луки', file: 'Толкование на Евангелие от Луки.gen.epub' },
  { id: 'john', title: 'Евангелие от Иоанна', file: 'Толкование на Евангелие от Иоанна.gen.epub' },
];

export default function Scripture() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Священное писание
          </h1>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Книги Священного Писания с классическими толкованиями для скачивания (формат EPUB).
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          <div className="w-full max-w-xl mx-auto space-y-10 px-4">
        {/* Евангелие с толкованием блаженного Феофилакта Болгарского */}
        <div className="space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 text-center">
            Евангелие с толкованием блаженного Феофилакта Болгарского
          </h3>
          <div className="grid gap-4">
            {BOOKS.map((book) => (
              <a 
                key={book.id}
                href={`/books/${book.file}`}
                download={book.file}
                className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group text-left"
              >
                <BookText className="group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex-1">
                  <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                  <div className="text-lg leading-tight">{book.title}</div>
                </div>
                <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Прочие книги */}
        <div className="space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 text-center">
            Другие толкования
          </h3>
          <div className="grid gap-4">
            <a 
              href="/books/Толкование на Деяния святых Апостолов.gen.epub"
              download="Толкование на Деяния святых Апостолов.gen.epub"
              className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group text-left"
            >
              <BookText className="group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex-1">
                <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                <div className="text-lg leading-tight">Толкование на Деяния святых Апостолов</div>
              </div>
              <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
            </a>

            <a 
              href="/books/Толкование на Псалмы.gen.epub"
              download="Толкование на Псалмы.gen.epub"
              className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group text-left"
            >
              <BookText className="group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex-1">
                <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                <div className="text-lg leading-tight">Псалтырь. Епископ Палладий</div>
              </div>
              <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
            </a>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
