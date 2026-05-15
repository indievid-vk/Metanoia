import React from 'react';
import DownloadButton from '../components/DownloadButton';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { getAssetPath } from '../utils';

export default function RepentanceHelp() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            В помощь кающимся
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            Святитель Игнатий (Брянчанинов)
          </p>
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto mb-10">
            Практическое руководство для подготовки к Таинству Исповеди.
          </div>

          <div className="max-w-xl mx-auto mb-6">
            <DownloadButton 
              title="В помощь кающимся" 
              subtitle="Святитель Игнатий (Брянчанинов)"
              downloadUrl={getAssetPath("/books/V_pomosh_kaushimsya.epub")}
              fileName="V_pomosh_kaushimsya.epub"
              format="EPUB"
            />
            
            <div className="bg-white/80 p-6 rounded-xl border border-[var(--color-ink)]/10 shadow-sm mt-4 leading-relaxed text-[var(--color-ink)]/90 font-izhitsa text-left text-justify">
              <p className="mb-4">
                Труд святителя Игнатия (Брянчанинова) «В помощь кающимся» является одним из важнейших духовных руководств для православных христиан, готовящихся к Таинству Исповеди. В нём подробно перечисляются и разъясняются страсти и помыслы в соответствии с заповедями Божиими и святоотеческим учением.
              </p>
              <p className="mb-4">
                Эта книга помогает заглянуть в самые сокровенные уголки души и извлечь оттуда забытые или неосознаваемые прегрешения. Она учит не просто перечислять свои греховные поступки, но исцелять злые навыки ума и сердца, принося всецелое покаяние Богу.
              </p>
              <p>
                Чтение этой книги необходимо для того, чтобы увидеть свою душу в свете евангельской истины, сокрушиться о содеянном и стяжать мир с Господом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
