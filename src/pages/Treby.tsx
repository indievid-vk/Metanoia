import React from 'react';
import trebyData from '../data/treby.json';

export default function Treby() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-6 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Записка церковная
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-6">
            (по материалам сайта azbyka.ru)
          </p>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          <div className="space-y-12">
            {trebyData.sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-8 space-y-6">
                <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">
                  {section.title}
                </h2>
                
                {section.content && section.content.length > 0 && (
                  <div className="space-y-4 text-[var(--color-ink)] leading-relaxed text-justify">
                    {section.content.map((paragraph, pIndex) => (
                      <div 
                        key={pIndex} 
                        className={pIndex === 0 ? "text-lg font-kurale italic text-[var(--color-cinnabar)]/80 mb-6 block" : ""}
                        dangerouslySetInnerHTML={{ __html: paragraph }} 
                      />
                    ))}
                  </div>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="grid gap-6 mt-6">
                    {section.subsections.map((sub) => (
                      <div key={sub.id} id={sub.id} className="scroll-mt-8 bg-white/40 p-5 rounded-lg border border-[var(--color-ink)]/10 transition-colors hover:bg-white/60">
                        <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/5 pb-1">
                          {sub.title}
                        </h3>
                        <div className="space-y-3 text-[var(--color-ink)]/90 leading-relaxed text-sm">
                          {sub.content.map((paragraph, pIndex) => (
                            <div 
                              key={pIndex} 
                              dangerouslySetInnerHTML={{ __html: paragraph }} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
