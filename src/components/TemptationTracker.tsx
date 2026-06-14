import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Sparkles, Smile, Shield, Flame, AlertCircle, HelpCircle } from 'lucide-react';

export interface Temptation {
  id: string;
  name: string;
  explanation: string;
  status: 'stopped' | 'less' | 'often'; // "перестал услаждаться" | "реже услаждаюсь" | "часто услаждаюсь, не начал борьбу"
  createdAt: string;
}

const STATUS_LABELS = {
  stopped: 'перестал услаждаться',
  less: 'реже услаждаюсь',
  often: 'часто услаждаюсь, не начал борьбу',
};

const DEFAULT_TEMPTATIONS: Temptation[] = [
  {
    id: '1',
    name: 'Празднословие и осуждение',
    explanation: 'Пустые разговоры в мессенджерах и обсуждение поступков коллег. Мешает сохранять сердечный мир.',
    status: 'often',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Излишнее экранное время',
    explanation: 'Бесцельное пролистывание новостей и развлекательных видео вместо вечерней молитвы.',
    status: 'less',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Услаждение яствами (пресыщение)',
    explanation: 'Употребление пищи сверх сытости ради удовольствия, особенно по вечерам перед сном.',
    status: 'often',
    createdAt: new Date().toISOString()
  }
];

export const TemptationTracker: React.FC = () => {
  const [temptations, setTemptations] = useState<Temptation[]>([]);
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [status, setStatus] = useState<'stopped' | 'less' | 'often'>('often');
  const [filter, setFilter] = useState<'all' | 'stopped' | 'less' | 'often'>('all');

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('pravoslav_temptations');
    if (saved) {
      try {
        setTemptations(JSON.parse(saved));
      } catch (e) {
        setTemptations(DEFAULT_TEMPTATIONS);
      }
    } else {
      setTemptations(DEFAULT_TEMPTATIONS);
      localStorage.setItem('pravoslav_temptations', JSON.stringify(DEFAULT_TEMPTATIONS));
    }
  }, []);

  // Save to LocalStorage
  const saveTemptations = (newItems: Temptation[]) => {
    setTemptations(newItems);
    localStorage.setItem('pravoslav_temptations', JSON.stringify(newItems));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: Temptation = {
      id: Date.now().toString(),
      name: name.trim(),
      explanation: explanation.trim(),
      status,
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...temptations];
    saveTemptations(updated);
    
    // Reset form
    setName('');
    setExplanation('');
    setStatus('often');
  };

  const handleDelete = (id: string) => {
    const updated = temptations.filter(item => item.id !== id);
    saveTemptations(updated);
  };

  const handleChangeStatus = (id: string, newStatus: 'stopped' | 'less' | 'often') => {
    const updated = temptations.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    saveTemptations(updated);
  };

  const filteredItems = temptations.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Description & Spirit Advice */}
      <div className="bg-[#fcf8f2] border-l-4 border-[var(--color-cinnabar)] p-5 rounded-r-2xl space-y-3">
        <h3 className="font-izhitsa text-lg text-[var(--color-cinnabar)] flex items-center gap-2">
          <Flame className="w-5 h-5 shrink-0" />
          Духовная брань с услаждениями
        </h3>
        <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-izhitsa">
          Страсть побеждается постепенным отсечением услаждений умственных и плотских. Святые отцы учат замечать малейшие шаги греха и вести трезвенный учет искушений, дабы исповедовать их и планомерно ослаблять их силу. Используйте этот дневник борьбы, чтобы держать свой ум в постоянном бодрствовании.
        </p>
      </div>

      {/* Form: Add New temptation */}
      <div className="bg-white/50 border border-[var(--color-cinnabar)]/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-izhitsa text-lg text-[var(--color-cinnabar)] flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Новое искушение или услаждение
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[var(--color-cinnabar)]/60 font-semibold">
              Название искушения / услаждения
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Наприклад: Праздность, ропот, излишний сон, гнев..."
              className="w-full bg-white/70 border border-amber-800/10 rounded-lg p-2.5 text-sm sm:text-base focus:border-[var(--color-cinnabar)] focus:ring-1 focus:ring-[var(--color-cinnabar)] outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider text-[var(--color-cinnabar)]/60 font-semibold mr-1">
              Пояснение / Заметки к борьбе
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Как это происходит? Какие обстоятельства провоцируют искушение? План духовного противодействия (молитва, воздержание)..."
              rows={3}
              className="w-full bg-white/70 border border-amber-800/10 rounded-lg p-2.5 text-sm focus:border-[var(--color-cinnabar)] focus:ring-1 focus:ring-[var(--color-cinnabar)] outline-none resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[var(--color-cinnabar)]/60 font-semibold">
              Текущий статус борьбы
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('often')}
                className={`py-2 px-3.5 text-xs sm:text-sm rounded-lg border font-semibold transition-all flex items-center justify-start gap-2 ${
                  status === 'often'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold shadow-xs'
                    : 'bg-white/40 border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                часто услаждаюсь
              </button>

              <button
                type="button"
                onClick={() => setStatus('less')}
                className={`py-2 px-3.5 text-xs sm:text-sm rounded-lg border font-semibold transition-all flex items-center justify-start gap-2 ${
                  status === 'less'
                    ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold shadow-xs'
                    : 'bg-white/40 border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                реже услаждаюсь
              </button>

              <button
                type="button"
                onClick={() => setStatus('stopped')}
                className={`py-2 px-3.5 text-xs sm:text-sm rounded-lg border font-semibold transition-all flex items-center justify-start gap-2 ${
                  status === 'stopped'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold shadow-xs'
                    : 'bg-white/40 border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                перестал услаждаться
              </button>
            </div>
            <p className="text-[11px] text-stone-500 italic pl-1">
              {status === 'often' && '🔴 часто услаждаюсь, не начал борьбу — требуется усиленное внимание и немедленное покаяние.'}
              {status === 'less' && '🟡 реже услаждаюсь — начало сознательной борьбы, страсть идет на убыль.'}
              {status === 'stopped' && '🟢 перестал услаждаться — слава Богу, искушение преодолевается по Его милости.'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-cinnabar)] text-[var(--color-parchment)] py-2.5 px-4 rounded-lg font-izhitsa text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            Записать искушение
          </button>
        </form>
      </div>

      {/* List Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-cinnabar)]/10 pb-3">
          <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Мой список искушений и услаждений ({temptations.length})
          </h3>
          
          <div className="flex bg-white/40 border border-amber-800/10 rounded-lg p-0.5 text-xs text-stone-600 font-semibold self-start sm:self-center overflow-x-auto max-w-full">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                filter === 'all' ? 'bg-[var(--color-cinnabar)] text-white font-bold' : 'hover:text-[var(--color-cinnabar)]'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('often')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                filter === 'often' ? 'bg-rose-600 text-white font-bold' : 'hover:text-rose-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              Часто
            </button>
            <button
              onClick={() => setFilter('less')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                filter === 'less' ? 'bg-amber-600 text-white font-bold' : 'hover:text-amber-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Реже
            </button>
            <button
              onClick={() => setFilter('stopped')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1 ${
                filter === 'stopped' ? 'bg-emerald-600 text-white font-bold' : 'hover:text-emerald-600'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              Побеждено
            </button>
          </div>
        </div>

        {/* Liturgy List Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 bg-white/30 border border-dashed border-stone-200 rounded-xl">
            <p className="text-stone-500 text-sm font-izhitsa">Искушений в данной категории не обнаружено.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              // Status Badge attributes
              let badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
              let dotColor = "bg-rose-500 animate-pulse";
              if (item.status === 'less') {
                badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                dotColor = "bg-amber-500";
              } else if (item.status === 'stopped') {
                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                dotColor = "bg-emerald-500";
              }

              return (
                <div 
                  key={item.id}
                  className="bg-white/40 border border-[var(--color-cinnabar)]/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:bg-white/60 transition-all duration-300 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] line-clamp-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors shrink-0"
                        title="Удалить запись"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.explanation ? (
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-izhitsa bg-white/20 p-2.5 rounded border border-stone-100">
                        {item.explanation}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 italic font-sans pl-1">
                        Без пояснений. Нажмите чтобы дописать, или ведите мысленную брань.
                      </p>
                    )}
                  </div>

                  {/* Status interactive selector for existing item */}
                  <div className="mt-4 pt-3 border-t border-stone-100/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 w-fit ${badgeColor}`}>
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                      {STATUS_LABELS[item.status]}
                    </div>

                    {/* Fast Change Status Widget */}
                    <div className="flex bg-white/50 border border-stone-200/50 rounded-md p-0.5 text-[10px] sm:text-xs">
                      <button
                        onClick={() => handleChangeStatus(item.id, 'often')}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          item.status === 'often' ? 'bg-rose-500 text-white font-bold' : 'text-stone-500 hover:text-rose-600'
                        }`}
                        title="Поставить статус: часто услаждаюсь, не начал борьбу"
                      >
                        Часто
                      </button>
                      <button
                        onClick={() => handleChangeStatus(item.id, 'less')}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          item.status === 'less' ? 'bg-amber-500 text-white font-bold' : 'text-stone-400 hover:text-amber-600'
                        }`}
                        title="Поставить статус: реже услаждаюсь"
                      >
                        Реже
                      </button>
                      <button
                        onClick={() => handleChangeStatus(item.id, 'stopped')}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          item.status === 'stopped' ? 'bg-emerald-500 text-white font-bold' : 'text-stone-400 hover:text-emerald-600'
                        }`}
                        title="Поставить статус: перестал услаждаться"
                      >
                        Победа
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
