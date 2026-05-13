import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import prayersData from '../data/prayers.json';
import { BackToTopButton } from '../components/BackToTopButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

type PrayerItem = {
  type?: 'header';
  text?: string;
  slavonic?: string;
  russian?: string;
};

const TITLES: Record<string, string> = {
  'morning': 'Молитвы утренние',
  'evening': 'Молитвы на сон грядущим',
  'canon-repentance': 'Канон покаянный ко Господу нашему Иисусу Христу',
  'canon-theotokos': 'Канон молебный ко Пресвятой Богородице',
  'canon-guardian-angel': 'Канон Ангелу-Хранителю',
  'communion-prayers': 'Последование ко Святому Причащению',
  'thanksgiving': 'Благодарственные молитвы по Святом Причащении'
};

export default function PrayerViewer() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const initialMode = searchParams.get('mode') === 'easter' ? 'easter' : 'normal';
  const [viewMode, setViewMode] = useState<'normal' | 'easter'>(initialMode);

  useEffect(() => {
    setViewMode(searchParams.get('mode') === 'easter' ? 'easter' : 'normal');
  }, [searchParams]);

  const allPrayers: PrayerItem[] = useMemo(() => id ? (prayersData as any)[id] || [] : [], [id]);
  
  // Find where Paschal Hours start - more robust search
  const easterIndex = useMemo(() => allPrayers.findIndex(item => 
    item.type === 'header' && 
    (item.text?.trim().includes('Пасхальные часы') || 
     item.slavonic?.trim().includes('Пасхальные часы') ||
     item.russian?.trim().includes('Пасхальные часы'))
  ), [allPrayers]);
  
  const prayers = useMemo(() => id === 'morning' || id === 'evening' 
    ? (viewMode === 'normal' 
        ? (easterIndex !== -1 ? allPrayers.slice(0, easterIndex) : allPrayers)
        : (easterIndex !== -1 ? allPrayers.slice(easterIndex) : []))
    : allPrayers, [id, viewMode, easterIndex, allPrayers]);

  const title = useMemo(() => id ? TITLES[id] || 'Молитвы' : 'Молитвы', [id]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!prayers.length) {
    return <div className="p-4 text-center">Загрузка...</div>;
  }

  return (
    <div className="pb-12 max-w-4xl mx-auto px-4">
      <BackToTopButton />
      <div className="text-center mb-8">
        <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] uppercase tracking-wide">{title}</h2>
        <DecorativeDivider className="mt-4" />
        
        {easterIndex !== -1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setViewMode('normal')}
              className={`flex-1 max-w-[200px] py-3 rounded-lg font-izhitsa shadow-sm transition-all ${
                viewMode === 'normal'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-inner'
                  : 'bg-[var(--color-parchment)] text-[var(--color-ink)] hover:bg-black/5 border border-[var(--color-ink)]/10'
              }`}
            >
              Обычное правило
            </button>
            <button
              onClick={() => setViewMode('easter')}
              className={`flex-1 max-w-[200px] py-3 rounded-lg font-izhitsa shadow-sm transition-all ${
                viewMode === 'easter'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-inner'
                  : 'bg-[var(--color-parchment)] text-[var(--color-ink)] hover:bg-black/5 border border-[var(--color-ink)]/10'
              }`}
            >
              Пасхальные часы
            </button>
          </div>
        )}
        <DecorativeDivider className="mt-6" />
      </div>

      <div className="space-y-6">
        {prayers.map((item, index) => {
          if (item.type === 'header' || !item.russian) {
            return (
              <div key={index} className="text-center my-10 relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--color-cinnabar)]/10 -z-10" />
                <h3 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] bg-[var(--color-parchment)] inline-block px-6">
                  {item.text || item.slavonic}
                </h3>
              </div>
            );
          }

          const isExpanded = !!expandedItems[index];

          return (
            <div key={index} className="group pb-8">
              <div 
                className="cursor-pointer transition-colors"
                onClick={() => toggleItem(index)}
              >
                <div className="font-izhitsa text-xl leading-snug text-[var(--color-ink)] text-justify whitespace-pre-wrap">
                  {(item.slavonic?.split('') || []).map((char, i) => {
                    if (i === 0) {
                      return <span key={i} className="text-4xl text-[var(--color-cinnabar)] align-baseline leading-none mr-0.5">{char}</span>;
                    }
                    return char;
                  })}
                </div>
                <div className="flex items-center justify-center mt-6 gap-2 text-[var(--color-cinnabar)] opacity-30 group-hover:opacity-100 transition-opacity">
                   <div className="h-px w-12 bg-current" />
                   {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                   <div className="h-px w-12 bg-current" />
                </div>
              </div>
              
              {isExpanded && (
                <div className="pt-4 animate-in fade-in duration-300">
                  <span className="font-izhitsa text-sm uppercase tracking-widest block mb-2 text-[var(--color-cinnabar)] opacity-80 text-center">Перевод</span>
                  <p className="font-izhitsa text-lg leading-snug text-[var(--color-ink)] italic opacity-90 text-justify whitespace-pre-wrap">
                    {item.russian}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
