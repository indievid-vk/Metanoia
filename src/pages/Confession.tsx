import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Check, Trash2, X, Minimize2, ArrowUp } from 'lucide-react';
import { useSinsStore, Passion, SinSeverity } from '../store';
import { PASSIONS, MOCK_SINS } from '../data/mock';
import { BackToTopButton } from '../components/BackToTopButton';

export default function Confession() {
  const { selectedSins, sinNotes, customSins, toggleSin, updateNote, addCustomSin, deleteCustomSin, clearConfession } = useSinsStore();
  const [expandedPassion, setExpandedPassion] = useState<Passion | null>(null);
  const [expandedSin, setExpandedSin] = useState<string | null>(null);
  const [expandedSelectedSin, setExpandedSelectedSin] = useState<string | null>(null);
  
  // Custom sin modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSinPassion, setCustomSinPassion] = useState<Passion>('Чревоугодие');
  const [customSinTitle, setCustomSinTitle] = useState('');
  const [customSinDesc, setCustomSinDesc] = useState('');
  const [customSinSeverity, setCustomSinSeverity] = useState<SinSeverity>('Простительный');

  // Memo modal state
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const allSins = [...MOCK_SINS, ...customSins];
  const selectedSinsList = allSins.filter(s => selectedSins[s.id]);

  const handleAddCustomSin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSinTitle.trim()) return;
    
    addCustomSin(customSinPassion, customSinTitle, customSinDesc, customSinSeverity);
    setIsModalOpen(false);
    setCustomSinTitle('');
    setCustomSinDesc('');
  };

  const openCustomModal = (passion: Passion) => {
    setCustomSinPassion(passion);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2">
            Дневник кающегося
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-6">
            (по материалам сайта uralzvon.site © Масленников Сергей Михайлович)
          </p>
          
          <button 
            onClick={() => setIsMemoOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded-full font-kurale text-lg shadow-lg hover:shadow-xl hover:brightness-110 transition-all active:scale-95 mb-6"
          >
            Памятка
          </button>

          <p className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto px-4">
            Отметьте грехи, в которых желаете покаяться, и добавьте личные обстоятельства.
          </p>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          {selectedSinsList.length > 0 && (
        <div className="mb-8 bg-white/40 p-4 rounded-lg shadow-inner border border-[var(--color-ink)]/10">
          <div className="flex justify-between items-center mb-4 border-b border-[var(--color-cinnabar)]/20 pb-2">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)]">На исповеди</h2>
            <span className="text-sm font-bold text-[var(--color-ink)]/60">Выбрано: {selectedSinsList.length}</span>
          </div>
          
          <ul className="space-y-3 mb-4">
            {selectedSinsList.map(sin => {
              const isExpanded = expandedSelectedSin === sin.id;
              return (
                <li key={sin.id} className="flex items-start bg-white/50 p-2 rounded border border-[var(--color-ink)]/10">
                  <span className="text-[var(--color-cinnabar)] mr-2 mt-1">☩</span>
                  <div className="flex-1 cursor-pointer" onClick={() => setExpandedSelectedSin(isExpanded ? null : sin.id)}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[var(--color-ink)]">{sin.title}</span>
                      {isExpanded ? <ChevronUp size={16} className="text-[var(--color-ink)]/50" /> : <ChevronDown size={16} className="text-[var(--color-ink)]/50" />}
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-2 text-sm text-[var(--color-ink)]/80 border-t border-[var(--color-ink)]/10 pt-2">
                        {sin.description && <p className="mb-2">{sin.description}</p>}
                        {sinNotes[sin.id] && (
                          <div className="bg-[var(--color-parchment)]/50 p-2 rounded border border-[var(--color-ink)]/10">
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-60 block mb-1">Обстоятельства:</span>
                            <p className="italic">{sinNotes[sin.id]}</p>
                          </div>
                        )}
                        {!sin.description && !sinNotes[sin.id] && (
                          <p className="italic opacity-60">Нет дополнительного описания</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          
          <button 
            onClick={clearConfession}
            className="w-full py-4 bg-[var(--color-parchment)] border border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] rounded-lg font-kurale text-xl shadow-sm hover:shadow-md transition-shadow"
          >
            Исповедано
          </button>
        </div>
      )}

      <div className="space-y-4">
        {PASSIONS.map(passion => {
          const passionSins = allSins.filter(s => s.passion === passion);
          const isExpanded = expandedPassion === passion;
          
          return (
            <div key={passion} className="border border-[var(--color-ink)]/20 rounded-lg overflow-hidden bg-white/30">
              <button 
                onClick={() => setExpandedPassion(isExpanded ? null : passion)}
                className="w-full flex items-center justify-between p-4 bg-[var(--color-parchment)] hover:bg-black/5 transition-colors"
              >
                <h3 className="font-kurale text-xl text-[var(--color-ink)]">{passion}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] px-2 py-1 rounded-full">
                    {passionSins.length}
                  </span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-2 space-y-2 bg-[var(--color-parchment)]/50">
                  {passionSins.map(sin => {
                    const isSinExpanded = expandedSin === sin.id;
                    const isSelected = !!selectedSins[sin.id];
                    
                    return (
                      <div key={sin.id} className={`border rounded-md transition-colors ${isSelected ? 'border-[var(--color-cinnabar)]/50 bg-[var(--color-cinnabar)]/5' : 'border-[var(--color-ink)]/10 bg-white/50'}`}>
                        <div className="flex items-start p-3">
                          <button 
                            onClick={() => toggleSin(sin.id)}
                            className={`mt-1 flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors mr-3 ${isSelected ? 'bg-[var(--color-cinnabar)] border-[var(--color-cinnabar)] text-[var(--color-parchment)]' : 'border-[var(--color-ink)]/30'}`}
                          >
                            {isSelected && <Check size={16} />}
                          </button>
                          
                          <div className="flex-1 cursor-pointer" onClick={() => setExpandedSin(isSinExpanded ? null : sin.id)}>
                            <div className="flex justify-between items-start">
                              <h4 className={`font-kurale text-lg ${isSelected ? 'text-[var(--color-cinnabar)]' : 'text-[var(--color-ink)]'}`}>
                                {sin.title}
                              </h4>
                              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ml-2 whitespace-nowrap ${
                                sin.severity === 'Смертный' ? 'bg-red-100 text-red-800' : 
                                sin.severity === 'Тяжкий' ? 'bg-orange-100 text-orange-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {sin.severity}
                              </span>
                            </div>
                            
                            {isSinExpanded && (
                              <div className="mt-3 text-sm text-[var(--color-ink)]/80 leading-relaxed">
                                {sin.description && <p className="drop-cap">{sin.description}</p>}
                                
                                <div className={`pt-3 border-t border-[var(--color-ink)]/10 ${sin.description ? 'mt-4' : 'mt-2'}`}>
                                  <label className="block text-xs font-semibold text-[var(--color-ink)]/60 mb-1 uppercase tracking-wide">
                                    Личные обстоятельства:
                                  </label>
                                  <textarea 
                                    value={sinNotes[sin.id] || ''}
                                    onChange={(e) => updateNote(sin.id, e.target.value)}
                                    placeholder="Например: сорвался на детей после работы..."
                                    className="w-full p-2 text-sm bg-white/50 border border-[var(--color-ink)]/20 rounded focus:outline-none focus:border-[var(--color-cinnabar)]/50 focus:ring-1 focus:ring-[var(--color-cinnabar)]/50 resize-none"
                                    rows={3}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>

                                {sin.isCustom && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); deleteCustomSin(sin.id); }}
                                    className="mt-3 flex items-center text-red-600 text-xs hover:underline"
                                  >
                                    <Trash2 size={14} className="mr-1" /> Удалить свой грех
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button 
                    onClick={() => openCustomModal(passion)}
                    className="w-full py-3 mt-2 border-2 border-dashed border-[var(--color-ink)]/20 rounded-md text-[var(--color-ink)]/60 hover:text-[var(--color-cinnabar)] hover:border-[var(--color-cinnabar)]/40 transition-colors flex items-center justify-center text-sm font-kurale"
                  >
                    <Plus size={16} className="mr-1" /> Добавить свой грех
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-parchment)] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4">
              <h3 className="font-kurale text-xl">Добавить грех</h3>
              <p className="text-xs opacity-80">Страсть: {customSinPassion}</p>
            </div>
            
            <form onSubmit={handleAddCustomSin} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)]/80 mb-1">Название греха</label>
                <input 
                  type="text" 
                  required
                  value={customSinTitle}
                  onChange={e => setCustomSinTitle(e.target.value)}
                  className="w-full p-2 bg-white/50 border border-[var(--color-ink)]/20 rounded focus:outline-none focus:border-[var(--color-cinnabar)]/50"
                  placeholder="Краткое название"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)]/80 mb-1">Описание (необязательно)</label>
                <textarea 
                  value={customSinDesc}
                  onChange={e => setCustomSinDesc(e.target.value)}
                  className="w-full p-2 bg-white/50 border border-[var(--color-ink)]/20 rounded focus:outline-none focus:border-[var(--color-cinnabar)]/50 resize-none"
                  rows={3}
                  placeholder="Подробное описание..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-ink)]/80 mb-1">Тяжесть</label>
                <select 
                  value={customSinSeverity}
                  onChange={e => setCustomSinSeverity(e.target.value as SinSeverity)}
                  className="w-full p-2 bg-white/50 border border-[var(--color-ink)]/20 rounded focus:outline-none focus:border-[var(--color-cinnabar)]/50"
                >
                  <option value="Простительный">Простительный</option>
                  <option value="Тяжкий">Тяжкий</option>
                  <option value="Смертный">Смертный</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-[var(--color-ink)]/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-[var(--color-ink)]/20 rounded text-[var(--color-ink)]/80 hover:bg-black/5 transition-colors"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] rounded hover:bg-[var(--color-cinnabar)]/90 transition-colors font-semibold"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Memo Modal */}
      {isMemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsMemoOpen(false)}>
          <div 
            className="bg-[var(--color-parchment)] w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-200 custom-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 flex justify-between items-center z-10 shadow-md">
              <h3 className="font-kurale text-2xl">Грехи, страсти, добродетели</h3>
              <button onClick={() => setIsMemoOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div id="memo-toc" className="bg-white/50 p-5 rounded-lg border border-[var(--color-cinnabar)]/20 shadow-md">
                <h4 className="font-kurale text-xl text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1 text-center italic">Содержание</h4>
                <ul className="list-decimal list-inside space-y-2 text-base text-[var(--color-ink)] font-kurale">
                  <li><a href="#razvitie-greha" className="hover:underline">Развитие греха</a></li>
                  <li><a href="#stepeni-tyazhesti" className="hover:underline">Степени тяжести грехов</a></li>
                  <li><a href="#dobrodeteli-protiv-strastey" className="hover:underline">Добродетели против страстей</a></li>
                </ul>
              </div>

              <div className="flex flex-col items-center space-y-4">
                {[
                  { src: "/images/stadii_grexa.webp", alt: "Стадии греха 1" },
                  { src: "/images/stadii_greha_2.webp", alt: "Стадии греха 2" }
                ].map((img, index) => (
                  <div key={index} className="relative w-full flex justify-center p-2">
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="max-w-full h-auto max-h-[50vh] object-contain rounded-lg shadow-md border border-[var(--color-ink)]/10 cursor-pointer transition-all duration-300 hover:scale-105"
                      onClick={() => setExpandedImage(img.src)}
                      
                    />
                  </div>
                ))}
              </div>

              {expandedImage && (
                <div 
                  className="fixed inset-0 z-[100] bg-black/95 overflow-auto"
                  onClick={() => setExpandedImage(null)}
                >
                  <button className="fixed top-4 right-4 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-[110]">
                    <Minimize2 size={24} />
                  </button>
                  <div className="w-max min-w-full min-h-full p-4 sm:p-8 flex items-start justify-start">
                    <img 
                      src={expandedImage} 
                      alt="Увеличенное изображение" 
                      className="max-w-none w-[200vw] sm:w-[150vw] md:w-auto h-auto"
                      onClick={(e) => e.stopPropagation()}
                      
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 text-[var(--color-ink)]">
                <h4 id="razvitie-greha" className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 scroll-mt-20">Как развивается грех</h4>
                
                <div className="space-y-6 text-sm md:text-base">
                  {/* Стадия 1 */}
                  <div className="bg-white/50 p-4 rounded-lg border border-[var(--color-ink)]/10">
                    <h5 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1">Стадия 1 — Прилог</h5>
                    <ul className="space-y-2">
                      <li><strong className="text-[var(--color-ink)]">Грех:</strong> Греховный помысел только появляется в уме. Это лишь предложение извне.</li>
                      <li><strong className="text-[var(--color-ink)]">Дух Святой:</strong> Пребывает с человеком, просвещает ум, дает силы отвергнуть ложь.</li>
                      <li><strong className="text-[var(--color-ink)]">Пораженные силы души:</strong> Ни одна сила души еще не поражена.</li>
                      <li><strong className="text-[var(--color-ink)]">Подчиненность сил души:</strong> Силы души свободны и подчинены духу (уму).</li>
                      <li><strong className="text-[var(--color-ink)]">Вердикт:</strong> Стадия безгрешна. Человек свободен в выборе.</li>
                      <li><strong className="text-[var(--color-cinnabar)]">Что делать:</strong> Сразу отвергнуть помысел! Отгонять его молитвою "Враже, предложение твое на главу твою. Матерь Божия, помоги!" и далее многократно повторять Богородичную молитву "Богородице Дево радуйся..."</li>
                    </ul>
                  </div>

                  {/* Стадия 2 */}
                  <div className="bg-white/50 p-4 rounded-lg border border-[var(--color-ink)]/10">
                    <h5 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1">Стадия 2 — Сочетание</h5>
                    <ul className="space-y-2">
                      <li><strong className="text-[var(--color-ink)]">Грех:</strong> Ум принимает помысел, начинает его рассматривать и собеседовать с ним.</li>
                      <li><strong className="text-[var(--color-ink)]">Дух Святой:</strong> Отходит от человека. Начинается греховный процесс.</li>
                      <li><strong className="text-[var(--color-ink)]">Пораженные силы души:</strong> Поражается ум (дух) — высшая сила души.</li>
                      <li><strong className="text-[var(--color-ink)]">Подчиненность сил души:</strong> Ум теряет свою руководящую роль, начинает увлекаться ложью.</li>
                      <li><strong className="text-[var(--color-ink)]">Вердикт:</strong> Начало падения. Потеря духовной бдительности.</li>
                      <li><strong className="text-[var(--color-cinnabar)]">Что делать:</strong> Немедленно опомниться, прекратить собеседование с помыслом, покаяться Богу.</li>
                    </ul>
                  </div>

                  {/* Стадия 3 */}
                  <div className="bg-white/50 p-4 rounded-lg border border-[var(--color-ink)]/10">
                    <h5 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1">Стадия 3 — Сосложение</h5>
                    <ul className="space-y-2">
                      <li><strong className="text-[var(--color-ink)]">Грех:</strong> Воля соглашается на грех. Человек начинает желать предложенного. Грех уже совершен в сердце.</li>
                      <li><strong className="text-[var(--color-ink)]">Дух Святой:</strong> Оставляет человека, лишая его Своей благодатной защиты.</li>
                      <li><strong className="text-[var(--color-ink)]">Пораженные силы души:</strong> Поражена сила желания (сердце). Ум помрачен.</li>
                      <li><strong className="text-[var(--color-ink)]">Подчиненность сил души:</strong> Ум становится рабом желания. Чувства диктуют воле.</li>
                      <li><strong className="text-[var(--color-ink)]">Вердикт:</strong> Тяжкое духовное состояние. Внутреннее согласие с грехом.</li>
                      <li><strong className="text-[var(--color-cinnabar)]">Что делать:</strong> Требуется серьезное усилие воли воспротивиться желанию и просить у Бога прощения.</li>
                    </ul>
                  </div>

                  {/* Стадия 4 */}
                  <div className="bg-white/50 p-4 rounded-lg border border-[var(--color-ink)]/10">
                    <h5 className="font-kurale text-lg text-[var(--color-cinnabar)] mb-3 border-b border-[var(--color-cinnabar)]/10 pb-1">Стадия 4 — Совершение греха</h5>
                    <ul className="space-y-2">
                      <li><strong className="text-[var(--color-ink)]">Грех:</strong> Практическое осуществление задуманного греха в действии.</li>
                      <li><strong className="text-[var(--color-ink)]">Дух Святой:</strong> Оскорблен и удален.</li>
                      <li><strong className="text-[var(--color-ink)]">Пораженные силы души:</strong> Полное поражение ума, силы желания и силы энергии (воли/действия).</li>
                      <li><strong className="text-[var(--color-ink)]">Подчиненность сил души:</strong> Все силы души подчинены греху. Формируется страсть.</li>
                      <li><strong className="text-[var(--color-ink)]">Вердикт:</strong> Духовная смерть или тяжелая рана. Человек становится рабом греха.</li>
                      <li><strong className="text-[var(--color-cinnabar)]">Что делать:</strong> Скорейшая и чистосердечная Исповедь у священника, слезное покаяние.</li>
                    </ul>
                  </div>
                </div>

                <h4 id="stepeni-tyazhesti" className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 mt-8 scroll-mt-20">Степени тяжести грехов</h4>
                <div className="space-y-4 text-sm md:text-base">
                  <p className="italic text-[var(--color-ink)]/80">
                    Святитель Игнатий Брянчанинов учит, что грех — это груз, который тянет душу вниз. Смертные и тяжкие грехи подобны тяжелым камням, а множество простительных грехов — мешку песка. Если не очистить душу покаянием, этот груз становится непреодолимым.
                  </p>
                  <p className="font-bold text-red-800 bg-red-50 p-3 rounded border border-red-200">
                    Важно помнить: даже один нераскаянный смертный грех, несколько нераскаянных тяжких или множество нераскаянных простительных грехов после смерти сразу отправляют душу в ад, минуя мытарства.
                  </p>

                  <div className="bg-white/50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-kurale text-lg text-red-700 mb-2">Смертные грехи</h5>
                    <p>Грехи, которые лишают человека благодати Божией, умерщвляют душу. Святитель Игнатий говорит: <em>"Смертный грех есть грех, совершаемый с полным сознанием и произволением, грех, который отнимает у души жизнь духовную и предает ее смерти вечной, если не будет уврачеван покаянием"</em>.</p>
                    <p className="mt-2 text-sm text-[var(--color-ink)]/90">
                      Если привязать к шее человека большой камень, он мгновенно потянет его на дно. Так и смертный грех — это тяжесть, которая сразу лишает душу способности возноситься к Богу, погружая ее в пучину духовной смерти. Божья благодать мгновенно отходит от согрешившего смертным грехом, и человек остаётся беззащитным перед бесами. Такой грех требует немедленного и решительного покаяния, чтобы «отсечь» этот камень и не погибнуть. Смертный грех должно не повторять.
                    </p>
                    <div className="mt-3 text-sm bg-red-50 p-2 rounded border border-red-100">
                      <p className="font-semibold text-red-800">Что делать:</p>
                      <ul className="list-disc list-inside text-red-900/80">
                        <li>Исповедаться у священника о согрешении смертным грехом.</li>
                        <li>Прекратить его совершать.</li>
                        <li>Просить помощи в этом у Господа, Пресвятой Богородицы.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg border border-orange-200">
                    <h5 className="font-kurale text-lg text-orange-700 mb-2">Тяжкие грехи</h5>
                    <p>Грехи, наносящие душе глубокие раны. <em>"Тяжкий грех есть грех, который, хотя и не умерщвляет душу, но делает ее неспособною к принятию благодати Божией"</em>. Нераскаянные, они также ведут к погибели.</p>
                    <div className="mt-3 text-sm bg-orange-50 p-2 rounded border border-orange-100">
                      <p className="font-semibold text-orange-800">Что делать:</p>
                      <ul className="list-disc list-inside text-orange-900/80">
                        <li>Исповедаться у священника о согрешении тяжкими грехами.</li>
                        <li>Стараться их прекратить и не повторять.</li>
                        <li>Просить помощи в этом у Господа, Пресвятой Богородицы.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-kurale text-lg text-green-700 mb-2">Простительные грехи</h5>
                    <p>Грехи по немощи. Святитель Игнатий предостерегает: <em>"Не пренебрегай грехами, которые кажутся тебе малыми. Из малых грехов составляется великая бездна, поглощающая душу"</em>. Множество таких грехов, если не очищены покаянием, губительны.</p>
                    <div className="mt-3 text-sm bg-green-50 p-2 rounded border border-green-100">
                      <p className="font-semibold text-green-800">Что делать:</p>
                      <ul className="list-disc list-inside text-green-900/80">
                        <li>Исповедаться у священника о согрешении простительными грехами.</li>
                        <li>Стараться их прекратить и не повторять.</li>
                        <li>Просить помощи в этом у Господа, Пресвятой Богородицы.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h4 id="dobrodeteli-protiv-strastey" className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2 mt-8 scroll-mt-20">Добродетели против страстей</h4>
                <p className="italic text-[var(--color-ink)]/80 mb-4">
                  Святитель Игнатий Брянчанинов учит: <em>"Страсть побеждается добродетелью, противоположной ей"</em>. Страсть — это укоренившийся в душе греховный навык, а добродетель — благодатное состояние души, приобретаемое трудом и помощью Божией. Борьба со страстями требует постоянства, бдительности и помощи Божией.
                </p>
                <div className="space-y-3">
                  {[
                    { 
                      passion: "Чревоугодие (страсть)", 
                      description: "Чревоугодие есть матерь всех страстей. Оно порабощает дух плоти, делая его рабом чрева.", 
                      examples: "Объедение, пьянство, тайное ядение, пристрастие к лакомствам.",
                      virtue: "Воздержание", 
                      vDescription: "Воздержание есть начало и основа всех добродетелей, укрощение плоти.",
                      vExamples: "Пост, умеренность в пище, отказ от излишеств.",
                      quote: "Воздержание — начало и основа всех добродетелей." 
                    },
                    { 
                      passion: "Блуд (страсть)", 
                      description: "Блуд есть осквернение тела и души, отчуждающее человека от Бога и лишающее его благодати.", 
                      examples: "Блудные помыслы, нечистые взгляды, просмотр развратного контента, прелюбодеяние.",
                      virtue: "Целомудрие", 
                      vDescription: "Целомудрие есть чистота ума и сердца, возвышающая человека к Богу.",
                      vExamples: "Хранение чувств, молитва, избегание соблазнов, чистота помыслов.",
                      quote: "Целомудрие есть чистота ума и сердца." 
                    },
                    { 
                      passion: "Сребролюбие (страсть)", 
                      description: "Сребролюбие есть идолопоклонство, привязывающее сердце к тленному и земному.", 
                      examples: "Жадность, накопительство, скупость, надежда на деньги, а не на Бога.",
                      virtue: "Нестяжание", 
                      vDescription: "Нестяжание освобождает сердце от земных уз для любви к Богу.",
                      vExamples: "Милостыня, отказ от лишнего, щедрость, доверие Богу.",
                      quote: "Нестяжание освобождает сердце для Бога." 
                    },
                    { 
                      passion: "Гнев (страсть)", 
                      description: "Гнев есть помрачение ума, лишающее человека мира и рассудительности.", 
                      examples: "Раздражительность, крик, злопамятность, желание отомстить.",
                      virtue: "Кротость", 
                      vDescription: "Кротость есть победа над самим собою, подражание Христу.",
                      vExamples: "Терпение обид, молчание в ответ на грубость, прощение, молитва за врагов.",
                      quote: "Кротость есть победа над самим собою." 
                    },
                    { 
                      passion: "Печаль (страсть)", 
                      description: "Печаль мирская есть ропот на Бога, отчаяние в спасении.", 
                      examples: "Уныние из-за неудач, ропот на судьбу, зависть, обида на ближних.",
                      virtue: "Духовная радость", 
                      vDescription: "Радость о Господе есть плод веры и упования.",
                      vExamples: "Благодарность Богу за всё, упование на Его волю, молитва, чтение Писания.",
                      quote: "Радость о Господе — сила души." 
                    },
                    { 
                      passion: "Уныние (страсть)", 
                      description: "Уныние есть расслабление души, нежелание трудиться для спасения.", 
                      examples: "Лень, праздность, небрежение к молитве, откладывание добрых дел.",
                      virtue: "Трезвение", 
                      vDescription: "Трезвение есть бодрствование ума, хранение сердца от помыслов.",
                      vExamples: "Внимательная молитва, бдительность над мыслями, духовное чтение.",
                      quote: "Трезвение есть бодрствование ума." 
                    },
                    { 
                      passion: "Тщеславие (страсть)", 
                      description: "Тщеславие есть желание славы человеческой, лишающее славы Божией.", 
                      examples: "Хвастовство, желание похвалы, гордость своими талантами, лицемерие.",
                      virtue: "Смирение", 
                      vDescription: "Смирение есть признание своей немощи и величие Божие.",
                      vExamples: "Делание добра втайне, принятие критики, отказ от похвалы, молитва о смирении.",
                      quote: "Смирение есть единственное вместилище даров Божиих." 
                    },
                    { 
                      passion: "Гордость (страсть)", 
                      description: "Гордость есть начало греха, отвержение Бога, самообожествление.", 
                      examples: "Превозношение над другими, осуждение, самоуверенность, нежелание слушать советы.",
                      virtue: "Любовь", 
                      vDescription: "Любовь есть исполнение закона, высшая добродетель, соединяющая с Богом.",
                      vExamples: "Жертвенность, прощение, служение ближним, молитва о любви.",
                      quote: "Любовь есть совокупность совершенства." 
                    }
                  ].map((item) => (
                    <div key={item.passion} className="bg-white/50 p-4 rounded-lg border border-[var(--color-ink)]/10">
                      <p className="font-bold text-[var(--color-ink)] text-lg">{item.passion}</p>
                      <p className="text-sm text-[var(--color-ink)]/80 mb-2">{item.description}</p>
                      <p className="text-xs text-[var(--color-ink)]/60 mb-2"><strong>Примеры:</strong> {item.examples}</p>
                      <div className="border-t border-[var(--color-ink)]/10 pt-2 mt-2">
                        <p className="font-bold text-[var(--color-cinnabar)]">{item.virtue}</p>
                        <p className="text-sm text-[var(--color-ink)]/80">{item.vDescription}</p>
                        <p className="text-xs text-[var(--color-ink)]/60"><strong>Примеры:</strong> {item.vExamples}</p>
                      </div>
                      <p className="text-sm italic text-[var(--color-ink)]/70 mt-2">"{item.quote}"</p>
                    </div>
                  ))}
                </div>
                <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[60]">
                  <button onClick={(e) => {
                    e.preventDefault();
                    const container = document.querySelector('.custom-scrollbar');
                    const toc = document.getElementById('memo-toc');
                    if (toc) {
                      toc.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else if (container) {
                      container.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }} 
                  className="bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-3 lg:p-4 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                  aria-label="Вернуться к содержанию"
                  title="Вернуться к содержанию"
                  >
                    <ArrowUp size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
