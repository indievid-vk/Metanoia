import React, { useEffect, useState } from 'react';
import { ArrowUp, Maximize2, Minimize2 } from 'lucide-react';
import templeRulesData from '../data/templeRules.json';
import { BackToTopButton } from '../components/BackToTopButton';
import { getAssetPath } from '../utils';

export default function TempleRules() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSchemaExpanded, setIsSchemaExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    templeRulesData.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
      
      section.subsections?.forEach((sub) => {
        const subEl = document.getElementById(sub.id);
        if (subEl) observer.observe(subEl);
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    const toc = document.getElementById('toc');
    if (toc) {
      toc.scrollIntoView({ behavior: 'smooth' });
    } else {
      const container = document.querySelector('main');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            Правила поведения в Храме
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам сайта azbyka.ru)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Тексты о благочестии, как правильно стоять, креститься и прикладываться к иконам.
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10 space-y-8">
          {/* Active Table of Contents */}
      <nav id="toc" className="w-full bg-white/50 p-5 rounded-lg border border-[var(--color-cinnabar)]/20 shadow-md">
        <h2 className="font-kurale text-xl text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1 text-center italic">
          Содержание
        </h2>
        <ul className="space-y-3 text-base text-[var(--color-ink)] font-kurale">
          {templeRulesData.sections.map((section, idx) => (
            <li key={section.id} className="flex flex-col">
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-left flex items-baseline gap-2 hover:text-[var(--color-cinnabar)] transition-colors group ${
                  activeSection === section.id ? 'text-[var(--color-cinnabar)] font-bold' : 'text-[var(--color-ink)]/80'
                }`}
              >
                <span className="shrink-0 opacity-60 font-sans text-sm w-5">{idx + 1}.</span>
                <span className="group-hover:underline decoration-dotted">{section.title}</span>
              </button>
              {section.subsections && section.subsections.length > 0 && (
                <ul className="pl-7 mt-2 space-y-2 border-l border-[var(--color-ink)]/10 ml-2.5">
                  {section.subsections.map((sub, sIdx) => (
                    <li key={sub.id}>
                      <button
                        onClick={() => scrollToSection(sub.id)}
                        className={`text-left flex items-baseline gap-2 hover:text-[var(--color-cinnabar)] transition-colors text-xs ${
                          activeSection === sub.id ? 'text-[var(--color-cinnabar)] font-bold italic' : 'text-[var(--color-ink)]/70'
                        }`}
                      >
                        <span className="shrink-0 opacity-40">•</span>
                        <span>{sub.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

          {/* Content */}
          <div className="w-full">
            <div className="bg-white/40 p-4 sm:p-6 rounded-lg shadow-inner border border-[var(--color-ink)]/10">
              <div className="space-y-10">
            {templeRulesData.sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-8">
                <h2 className="font-kurale text-xl sm:text-2xl text-[var(--color-ink)] mb-4">
                  {section.title}
                </h2>
                
                {section.title === 'Об устройстве Храма' && (
                  <div className="mb-6">
                    <div 
                      className="w-full max-w-2xl mx-auto border-2 border-[var(--color-ink)]/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg relative cursor-pointer transition-all duration-300"
                      onClick={() => setIsSchemaExpanded(true)}
                    >
                      <div className="absolute top-2 right-2 text-[var(--color-ink)] bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors">
                        <Maximize2 size={20} />
                      </div>
                      <img 
                        src={getAssetPath("/images/Hram.webp")} 
                        alt="Схема устройства православного храма" 
                        className="w-full h-auto object-contain"
                      />
                      <div className="bg-[var(--color-parchment)] p-3 text-sm text-center text-[var(--color-ink)]/80 border-t border-[var(--color-ink)]/10">
                        Схема устройства православного храма внутри с указанием осевых направлений (нажмите для увеличения)
                      </div>
                    </div>

                    {isSchemaExpanded && (
                      <div 
                        className="fixed inset-0 z-[100] bg-black/95 overflow-auto"
                        onClick={() => setIsSchemaExpanded(false)}
                      >
                        <button className="fixed top-4 right-4 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-[110]">
                          <Minimize2 size={24} />
                        </button>
                        <div className="w-max min-w-full min-h-full p-4 sm:p-8 flex items-start justify-start">
                          <img 
                            src={getAssetPath("/images/Hram.webp")} 
                            alt="Схема устройства православного храма (увеличено)" 
                            className="max-w-none w-[200vw] sm:w-[150vw] md:w-auto h-auto"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {section.content && section.content.length > 0 && (
                  <div className="space-y-4 text-[var(--color-ink)]/90 leading-relaxed">
                    {section.content.map((paragraph, pIndex) => (
                      <div 
                        key={pIndex} 
                        className={pIndex === 0 ? "drop-cap" : ""}
                        dangerouslySetInnerHTML={{ __html: paragraph }} 
                      />
                    ))}
                  </div>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-8 mt-6">
                    {section.subsections.map((sub) => (
                      <div key={sub.id} id={sub.id} className="scroll-mt-8">
                        <h3 className="font-kurale text-lg sm:text-xl text-[var(--color-ink)] mb-3">
                          {sub.title}
                        </h3>
                        <div className="space-y-3 text-[var(--color-ink)]/90 leading-relaxed">
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
                
                {/* Mobile back to top link for each section */}
                <div className="mt-4 lg:hidden text-center">
                  <button 
                    onClick={scrollToTop}
                    className="text-sm text-[var(--color-cinnabar)] hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowUp size={16} />
                    К содержанию
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
