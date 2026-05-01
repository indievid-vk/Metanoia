import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import liturgiesData from '../data/liturgies.json';

interface LiturgyItem {
  title?: string;
  slavonic: string;
  russian: string;
}

const LiturgySection: React.FC<{ item: LiturgyItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/40 border border-[var(--color-cinnabar)]/10 rounded-lg overflow-hidden transition-all hover:bg-white/60">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 cursor-pointer flex items-center justify-between group"
      >
        <div className="flex-1">
          {item.title && (
            <h4 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-1">
              {item.title}
            </h4>
          )}
          <div className="text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap font-serif">
            {item.slavonic}
          </div>
        </div>
        <div className="ml-4 text-[var(--color-cinnabar)]/40 group-hover:text-[var(--color-cinnabar)] transition-colors">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[var(--color-cinnabar)]/5 bg-white/30">
          <div className="pt-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-cinnabar)]/40 font-kurale block mb-2">Перевод</span>
            <div className="text-[var(--color-ink)]/70 leading-relaxed italic whitespace-pre-wrap text-sm">
              {item.russian}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Liturgy() {
  const [activeTab, setActiveTab] = useState<'chrysostom' | 'basil'>('chrysostom');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            {activeTab === 'chrysostom' ? 'Литургия свт. Иоанна Златоуста' : 'Литургия свт. Василия Великого'}
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам сайта azbyka.ru)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Последование Божественной Литургии с параллельным переводом на русский язык.
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10 flex flex-col space-y-8">
          <div className="flex bg-white/40 border border-[var(--color-ink)]/10 rounded-lg p-1 shrink-0 w-full max-w-sm mx-auto shadow-sm">
            <button
              onClick={() => setActiveTab('chrysostom')}
              className={`flex-1 px-2 sm:px-4 py-2 font-kurale text-center text-sm sm:text-base rounded-md transition-all ${
                activeTab === 'chrysostom'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm'
                  : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)]'
              }`}
            >
              Иоанна Златоуста
            </button>
            <button
              onClick={() => setActiveTab('basil')}
              className={`flex-1 px-2 sm:px-4 py-2 font-kurale text-center text-sm sm:text-base rounded-md transition-all ${
                activeTab === 'basil'
                  ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm'
                  : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)]'
              }`}
            >
              Василия Великого
            </button>
          </div>

          <div className="space-y-4">
            {liturgiesData[activeTab].map((item, index) => (
              <LiturgySection key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
