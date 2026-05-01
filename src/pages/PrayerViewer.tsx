import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import prayersData from '../data/prayers.json';

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

  const allPrayers: PrayerItem[] = id ? (prayersData as any)[id] || [] : [];
  
  // Find where Paschal Hours start - more robust search
  const easterIndex = allPrayers.findIndex(item => 
    item.type === 'header' && 
    item.text?.trim().includes('Пасхальные часы')
  );
  
  const prayers = id === 'morning' || id === 'evening' 
    ? (viewMode === 'normal' 
        ? (easterIndex !== -1 ? allPrayers.slice(0, easterIndex) : allPrayers)
        : (easterIndex !== -1 ? allPrayers.slice(easterIndex) : []))
    : allPrayers;

  const title = id ? TITLES[id] || 'Молитвы' : 'Молитвы';

  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!prayers.length) {
    return <div className="p-4 text-center">Загрузка...</div>;
  }

  return (
    <div className="pb-12 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] uppercase tracking-wide">{title}</h2>
        
        {easterIndex !== -1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setViewMode('normal')}
              className={`flex-1 max-w-[200px] py-3 rounded-lg font-kurale shadow-sm transition-all ${
                viewMode === 'normal'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-inner'
                  : 'bg-[var(--color-parchment)] text-[var(--color-ink)] hover:bg-black/5 border border-[var(--color-ink)]/10'
              }`}
            >
              Обычное правило
            </button>
            <button
              onClick={() => setViewMode('easter')}
              className={`flex-1 max-w-[200px] py-3 rounded-lg font-kurale shadow-sm transition-all ${
                viewMode === 'easter'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-inner'
                  : 'bg-[var(--color-parchment)] text-[var(--color-ink)] hover:bg-black/5 border border-[var(--color-ink)]/10'
              }`}
            >
              Пасхальные часы
            </button>
          </div>
        )}
        <div className="ornament-divider mt-6">☩</div>
      </div>

      <div className="space-y-6">
        {prayers.map((item, index) => {
          if (item.type === 'header' || !item.russian) {
            return (
              <div key={index} className="text-center my-10 relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--color-cinnabar)]/10 -z-10" />
                <h3 className="font-kurale text-2xl text-[var(--color-cinnabar)] bg-[var(--color-parchment)] inline-block px-6">
                  {item.text || item.slavonic}
                </h3>
              </div>
            );
          }

          const isExpanded = !!expandedItems[index];

          return (
            <div key={index} className="bg-white/50 rounded-xl border border-[var(--color-ink)]/10 overflow-hidden shadow-sm transition-all hover:border-[var(--color-cinnabar)]/20">
              <div 
                className="p-6 cursor-pointer hover:bg-[var(--color-cinnabar)]/5 transition-colors group"
                onClick={() => toggleItem(index)}
              >
                <p className="font-serif text-xl leading-relaxed text-[var(--color-ink)]">
                  {item.slavonic}
                </p>
                <div className="flex items-center justify-center mt-4 gap-2 text-[var(--color-cinnabar)] opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="h-px w-8 bg-current" />
                   {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                   <div className="h-px w-8 bg-current" />
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-6 bg-[var(--color-parchment)]/60 border-t border-[var(--color-cinnabar)]/10 animate-in slide-in-from-top-2 duration-300">
                  <span className="font-kurale text-xs uppercase tracking-widest block mb-3 text-[var(--color-cinnabar)]/60 italic font-semibold">Перевод:</span>
                  <p className="font-sans text-lg leading-relaxed text-[var(--color-ink)] italic opacity-90">
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
