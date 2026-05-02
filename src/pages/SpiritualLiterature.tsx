import React, { useState } from 'react';
import { BookText, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getAssetPath } from '../utils';

interface BookAccordionProps {
  title: string;
  subtitle?: string;
  downloadUrl: string;
  fileName: string;
  children: React.ReactNode;
}

function BookAccordion({ title, subtitle, downloadUrl, fileName, children }: BookAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto mb-6">
      <a 
        href={downloadUrl}
        download={fileName}
        className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-t-xl shadow-lg hover:brightness-110 transition-all font-kurale group text-left w-full"
      >
        <BookText className="group-hover:scale-110 transition-transform shrink-0" />
        <div className="flex-1">
          <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать FB2</div>
          <div className="text-lg leading-tight">{title}</div>
          {subtitle && <div className="text-sm opacity-90 mt-1">{subtitle}</div>}
        </div>
        <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
      </a>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/40 hover:bg-white/60 p-3 px-5 border-x border-b border-[var(--color-ink)]/10 rounded-b-xl transition-colors text-[var(--color-ink)] font-kurale text-sm"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          О книге
        </span>
      </button>

      {isOpen && (
        <div className="bg-white/80 p-6 rounded-b-xl border-x border-b border-[var(--color-ink)]/10 shadow-inner mt-[-12px] pt-8 leading-relaxed text-[var(--color-ink)]/90 font-serif">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SpiritualLiterature() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Душеполезная литература
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (духовное чтение)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto mb-10">
            Книги, помогающие в духовном делании, трезвении и понимании воли Божией.
          </div>

          <BookAccordion 
            title="Близ есть, при дверех" 
            subtitle="Сергей Нилус"
            downloadUrl={getAssetPath("/books/Близ_есть_при_дверех_С.Нилус.fb2")}
            fileName="Близ_есть_при_дверех_С.Нилус.fb2"
          >
            <h4 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3">О книге «Близ есть, при дверех»</h4>
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
            downloadUrl={getAssetPath("/books/Аскетическая проповедь.gen.epub")}
            fileName="Аскетическая проповедь.gen.epub"
          >
            <h4 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3">О книге «Аскетическая проповедь»</h4>
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
          
          <div className="ornament-divider mt-12">☩</div>
        </div>
      </div>
    </div>
  );
}

