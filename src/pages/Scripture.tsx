import React from 'react';
import { getAssetPath } from '../utils';
import DownloadButton from '../components/DownloadButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

const BOOKS = [
  { id: 'matthew', title: 'Евангелие от Матфея', file: 'Evangelie_ot_Matfeya.epub' },
  { id: 'mark', title: 'Евангелие от Марка', file: 'Evangelie_ot_Marka.epub' },
  { id: 'luke', title: 'Евангелие от Луки', file: 'Evangelie_ot_Luki.epub' },
  { id: 'john', title: 'Евангелие от Иоанна', file: 'Evangelie_ot_Ioanna.epub' },
];

export default function Scripture() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Священное писание
          </h1>
          <DecorativeDivider className="mb-4" />
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Книги Священного Писания с классическими толкованиями для скачивания (формат EPUB).
          </div>
        </div>

        <div className="relative z-10">
          <div className="w-full max-w-xl mx-auto space-y-10 px-4">
        {/* Евангелие с толкованием блаженного Феофилакта Болгарского */}
        <div className="space-y-4">
          <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 text-center">
            Евангелие с толкованием блаженного Феофилакта Болгарского
          </h3>
          <div className="grid gap-4">
            {BOOKS.map((book) => (
              <DownloadButton 
                key={book.id}
                title={book.title}
                downloadUrl={getAssetPath(`/books/${book.file}`)}
                fileName={book.file}
              />
            ))}
          </div>
        </div>

        {/* Прочие книги */}
        <div className="space-y-4">
          <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 text-center">
            Другие толкования
          </h3>
          <div className="grid gap-4">
            <DownloadButton 
              title="Толкование на Деяния святых Апостолов"
              downloadUrl={getAssetPath("/books/Deyaniya_svyatih_Apostolov.epub")}
              fileName="Deyaniya_svyatih_Apostolov.epub"
            />

            <DownloadButton 
              title="Псалтырь. Епископ Палладий"
              downloadUrl={getAssetPath("/books/Tolkovavie_na_Psalmi.epub")}
              fileName="Tolkovavie_na_Psalmi.epub"
            />
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
