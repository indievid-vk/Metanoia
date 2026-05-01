import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSinsStore, Passion } from '../store';
import { MOCK_SINS, PASSIONS } from '../data/mock';

export default function MyConfession() {
  const navigate = useNavigate();
  const { selectedSins, sinNotes, customSins, clearConfession } = useSinsStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [expandedSins, setExpandedSins] = useState<Record<string, boolean>>({});

  const allSins = [...MOCK_SINS, ...customSins];
  
  // Filter only selected sins
  const selectedSinsList = allSins.filter(sin => selectedSins[sin.id]);

  // Group by passion
  const groupedSins = PASSIONS.reduce((acc, passion) => {
    const sinsForPassion = selectedSinsList.filter(s => s.passion === passion);
    if (sinsForPassion.length > 0) {
      acc[passion] = sinsForPassion;
    }
    return acc;
  }, {} as Record<Passion, typeof selectedSinsList>);

  const hasSins = Object.keys(groupedSins).length > 0;

  const handleConfessed = () => {
    clearConfession();
    setIsConfirmOpen(false);
    navigate('/');
  };

  const toggleSin = (id: string) => {
    setExpandedSins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto px-4">
      <div className="text-center mb-8">
        <p className="text-sm italic text-[var(--color-ink)]/70">
          Шпаргалка для таинства исповеди. Читайте перед священником.
        </p>
        <div className="ornament-divider mt-4">☩</div>
      </div>

      {!hasSins ? (
        <div className="text-center py-12 opacity-60">
          <span className="text-6xl mb-4 block">📜</span>
          <p className="font-kurale text-lg">Ваш список пуст.</p>
          <p className="text-sm mt-2">Перейдите в "Дневник кающегося", чтобы подготовиться к исповеди.</p>
          <button 
            onClick={() => navigate('/temple/confession')}
            className="mt-6 px-6 py-2 border border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] rounded-full hover:bg-[var(--color-cinnabar)]/10 transition-colors"
          >
            Перейти к дневнику
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white/40 p-6 rounded-lg shadow-inner border border-[var(--color-ink)]/10 font-serif leading-relaxed">
            <p className="mb-6 italic text-[var(--color-ink)]/80 text-center">
              "Исповедую Господу Богу моему и пред тобою, честный отче, все мои грехи..."
            </p>

            {Object.entries(groupedSins).map(([passion, sins]) => (
              <div key={passion} className="mb-6 last:mb-0">
                <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-1 mb-3">
                  Грехи против {passion.toLowerCase()}
                </h3>
                <ul className="space-y-4">
                  {sins.map(sin => {
                    const isExpanded = !!expandedSins[sin.id];
                    return (
                      <li key={sin.id} className="pl-4 border-l-2 border-[var(--color-ink)]/20">
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-black/5 p-1 -ml-1 rounded transition-colors"
                          onClick={() => toggleSin(sin.id)}
                        >
                          <span className="font-bold text-[var(--color-ink)]">{sin.title}</span>
                          <div className="flex items-center">
                            <span className="text-[10px] uppercase tracking-wider opacity-50 mr-2">{sin.severity}</span>
                            {isExpanded ? <ChevronUp size={16} className="opacity-50" /> : <ChevronDown size={16} className="opacity-50" />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                            {sin.description && <p className="text-sm text-[var(--color-ink)]/80">{sin.description}</p>}
                            
                            {sinNotes[sin.id] && (
                              <div className="mt-2 bg-[var(--color-parchment)]/80 p-2 rounded text-sm border border-[var(--color-cinnabar)]/20">
                                <span className="font-semibold text-[var(--color-cinnabar)] text-xs uppercase tracking-wider block mb-1">
                                  Мои обстоятельства:
                                </span>
                                <span className="italic">{sinNotes[sin.id]}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <p className="mt-8 italic text-[var(--color-ink)]/80 text-center">
              "...и во всех сих раскаиваюсь, и прошу прощения."
            </p>
          </div>

          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="w-full py-4 bg-[var(--color-parchment)] border border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] rounded-lg font-kurale text-xl shadow-sm hover:shadow-md transition-shadow"
          >
            Исповедано
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[var(--color-parchment)] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-black/10">
            <div className="p-8 text-center bg-white/50">
              <div className="w-20 h-20 bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-5xl font-izhitsa">☦</span>
              </div>
              <h3 className="font-kurale text-3xl text-[var(--color-cinnabar)] mb-3">Очистить список?</h3>
              <p className="text-[var(--color-ink)]/80 mb-8 leading-relaxed">
                Вы уверены, что хотите отметить исповедь как свершенную? Список грехов будет очищен.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfessed}
                  className="w-full py-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded-xl hover:brightness-110 transition-all font-kurale text-xl shadow-md uppercase tracking-wider"
                >
                  Да, очистить
                </button>
                <button 
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-full py-3 bg-[var(--color-ink)]/5 text-[var(--color-ink)]/60 rounded-xl hover:bg-[var(--color-ink)]/10 transition-all font-semibold"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
