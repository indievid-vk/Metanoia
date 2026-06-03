import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getAssetPath } from '../utils';
import DownloadButton from '../components/DownloadButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

interface BookAccordionProps {
  title: string;
  subtitle?: string;
  downloadUrl: string;
  fileName: string;
  children: React.ReactNode;
  format?: string;
}

function BookAccordion({ title, subtitle, downloadUrl, fileName, children, format = "EPUB" }: BookAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto mb-6">
      <DownloadButton 
        title={title}
        subtitle={subtitle}
        downloadUrl={downloadUrl}
        fileName={fileName}
        format={format}
        className="rounded-b-none"
      />
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/40 hover:bg-white/60 p-3 px-5 border-x border-b border-[var(--color-ink)]/10 rounded-b-xl transition-colors text-[var(--color-ink)] font-izhitsa text-sm shadow-sm"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          О книге
        </span>
      </button>

      {isOpen && (
        <div className="bg-white/80 p-6 rounded-b-xl border-x border-b border-[var(--color-ink)]/10 shadow-inner mt-[-12px] pt-8 leading-relaxed text-[var(--color-ink)]/90 font-izhitsa">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SpiritualLiterature() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Душеполезная информация
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (духовное чтение и материалы)
          </p>
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto mb-10">
            Карта Земного пути Спасителя, книги для духовного чтения, помогающие в духовном делании, трезвении и понимании воли Божией.
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <button 
              onClick={() => navigate('/gospel-life/route-map')}
              className="w-full bg-[var(--color-parchment)] border-2 border-[var(--color-cinnabar)]/45 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group relative overflow-hidden ring-1 ring-amber-100 flex flex-col cursor-pointer"
            >
              <div className="absolute top-2 right-2">
                <div className="bg-amber-105 text-amber-900 border border-amber-250 select-none text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-xs animate-pulse">Карта</div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)] mb-2 group-hover:text-red-700 transition-colors">Земной путь Спасителя</h3>
              <p className="text-sm text-[var(--color-ink)]/75 leading-relaxed font-sans">
                Интерактивная хроника и карта 23 ключевых мест чудес, проповедей и Крестного пути Господа Иисуса Христа.
              </p>
            </button>
          </div>

          <div className="my-8 border-t border-[var(--color-cinnabar)]/10 max-w-lg mx-auto" />
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] mb-6 uppercase tracking-wide text-center">Рекомендуемые книги</h2>

          <BookAccordion 
            title="Близ есть, при дверех" 
            subtitle="Сергей Нилус"
            downloadUrl={getAssetPath("/books/Bliz_est_pri_dvereh.fb2")}
            fileName="Bliz_est_pri_dvereh.fb2"
            format="FB2"
          >
            <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] mb-3">О книге «Близ есть, при дверех»</h4>
            <p className="mb-4">
              «Близ есть, при дверех. О том, чему не желают верить и что так близко» — один из самых известных и значительных трудов духовного писателя С.А. Нилуса. Эта книга стала итогом его многолетних исследований, посвященных признакам приближения конца времен, пришествию антихриста и тайным силам, действующим в мировой истории.
            </p>
            <p className="mb-4">
              Особое место в труде занимает публикация и подробный анализ «Протоколов сионских мудрецов». Нилус рассматривает эти процессы как важнейшее свидетельство подготовки мира к воцарению врага рода человеческого и предпринимает смелую попытку разоблачить их суть.
            </p>
            <p className="mb-4">
              Автор призывает православных христиан не к унынию и страху, а к духовному бодрствованию, трезвению и непоколебимому стоянию в вере. Автор напоминает, что никакие козни тайных сил не могут противостоять Промыслу Божию.
            </p>
            <div className="pt-4 border-t border-[var(--color-cinnabar)]/10 italic text-sm text-[var(--color-ink)]/70">
              Духовное наследие Сергея Александровича Нилуса раскрывает глубокие смыслы священной истории, грядущих судеб мира и Церкви.
            </div>
          </BookAccordion>

          <div className="my-8 border-t border-[var(--color-ink)]/5 max-w-sm mx-auto" />

          <BookAccordion 
            title="Аскетическая проповедь" 
            subtitle="Святитель Игнатий (Брянчанинов)"
            downloadUrl={getAssetPath("/books/Asketicheskaya_propoved.epub")}
            fileName="Asketicheskaya_propoved.epub"
          >
            <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] mb-3">О книге «Аскетическая проповедь»</h4>
            <p className="mb-4 text-justify leading-relaxed">
              «Аскетическая проповедь» — один из фундаментальных трудов святителя Игнатия (Брянчанинова), в котором он с поразительной глубиной и доступностью излагает основы православной аскетики. Сборник включает в себя проповеди и слова, произнесенные святителем в различные периоды его служения.
            </p>
            <p className="mb-4 text-justify leading-relaxed">
              Автор раскрывает суть покаяния, борьбы со страстями и стяжания добродетелей как насущной необходимости для каждого христианина, стремящегося к спасению. Особое внимание уделяется молитве, хранению ума и сердца, а также правильному пониманию воли Божией в жизненных обстоятельствах.
            </p>
            <p className="text-justify leading-relaxed">
              Этот труд является незаменимым руководством для тех, кто ищет твердой духовной опоры и желает глубже понять аскетическую традицию Православной Церкви в ее практическом применении.
            </p>
          </BookAccordion>

          <div className="my-8 border-t border-[var(--color-ink)]/5 max-w-sm mx-auto" />

          <BookAccordion 
            title="До и после. Апология книги Еноха" 
            subtitle="Митрополит Митрофан (Баданин)"
            downloadUrl={getAssetPath("/books/Do_i_posle_Apologiya_knigi_Enoha.epub")}
            fileName="Do_i_posle_Apologiya_knigi_Enoha.epub"
          >
            <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] mb-3">О книге «До и после. Апология книги Еноха»</h4>
            <p className="text-justify leading-relaxed">
              Представленная книга митрополита Митрофана (Баданина), правящего архиерея Мурманской епархии, представляет собой богословский труд, ставящий своей задачей апологию (от др.-греч . ἀπολογία «оправдание», «защита») одного из древнейших священных текстов, сохранившихся в истории человечества – Книги Еноха . Эта книга практически единственный источник наших знаний о трагических страницах жизни допотопного человечества, приведших к ужасам эпохи исполинов и завершившейся наказанием Всемирного Потопа.
            </p>
          </BookAccordion>
          
          <DecorativeDivider className="mt-12" />
        </div>
      </div>
    </div>
  );
}
