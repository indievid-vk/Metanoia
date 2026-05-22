import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, BookOpen, Info, Image as ImageIcon, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { DecorativeDivider } from '../components/DecorativeDivider';

type AzbykaResponse = {
  saints: {
    id: number;
    title: string;
    name?: string;
    uri?: string;
    type_of_sanctity?: string;
  }[];
  holidays: {
    id: number;
    title: string;
    uri?: string;
  }[];
  texts: { text: string }[];
  ikons: { title: string; clean_title?: string }[];
  fasting: {
    type: string;
    round_week: string;
    fasting: string;
    description: string | null;
    voice: number;
  };
};

const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

const fetchWithProxyFallback = async (originalUrl: string): Promise<string> => {
  let lastError: Error | null = null;
  for (const getProxyUrl of PROXIES) {
    const proxyUrl = getProxyUrl(originalUrl);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 seconds timeout

      const res = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 100 && !text.includes('Too Many Requests') && !text.includes('Rate limit exceeded')) {
          return text;
        }
      }
    } catch (e) {
      console.warn(`Proxy failed for ${originalUrl} via ${proxyUrl}:`, e);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError || new Error('Все доступные CORS-прокси вернули ошибку или недоступны.');
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Storage write failed. Clearing ortho_cal cache and retrying...", e);
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('ortho_cal_v1_') || k.startsWith('ortho_cal_v2_'))) {
          localStorage.removeItem(k);
          i--;
        }
      }
      localStorage.setItem(key, value);
    } catch (err) {
      console.error("Failed to write to localStorage after cleaning", err);
    }
  }
};

export default function Calendar() {
  const [data, setData] = useState<AzbykaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Fasting tab selection
  const [fastingTab, setFastingTab] = useState<'multiday' | 'oneday' | 'weeks'>('multiday');
  
  // Selected saint or holiday modal state
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    url: string;
  } | null>(null);

  // Bible readings state
  const [bibleContent, setBibleContent] = useState<string | null>(null);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const cacheKeyDay = `ortho_cal_v2_day_${dateStr}`;
      const cacheKeyBible = `ortho_cal_v2_bible_${dateStr}`;

      const cachedDay = localStorage.getItem(cacheKeyDay);
      const cachedBible = localStorage.getItem(cacheKeyBible);

      let isDayLoaded = false;
      let isBibleLoaded = false;

      // 1. Try loading calendar data from cache
      if (cachedDay) {
        try {
          setData(JSON.parse(cachedDay));
          setLoading(false);
          setError(null);
          isDayLoaded = true;
        } catch (e) {
          console.warn("Error parsing cached calendar data:", e);
          localStorage.removeItem(cacheKeyDay);
        }
      }

      // 2. Try loading bible readings content from cache
      if (cachedBible) {
        setBibleContent(cachedBible);
        setBibleLoading(false);
        setBibleError(null);
        isBibleLoaded = true;
      }

      // If both blocks were perfectly restored from the cache, we don't need any network hits!
      if (isDayLoaded && isBibleLoaded) {
        return;
      }

      // Initialize missing states for network fetch
      if (!isDayLoaded) {
        setLoading(true);
        setError(null);
      }
      if (!isBibleLoaded) {
        setBibleLoading(true);
        setBibleError(null);
        setBibleContent(null);
      }

      try {
        let currentDayData = data;

        // Fetch calendar data if not cached
        if (!isDayLoaded) {
          const calendarUrl = `https://azbyka.ru/days/api/day/${dateStr}.json`;
          const calendarHtml = await fetchWithProxyFallback(calendarUrl);
          const json = JSON.parse(calendarHtml);
          setData(json);
          currentDayData = json;
          safeLocalStorageSet(cacheKeyDay, calendarHtml);
          setLoading(false);
        }

        // Fetch bible readings if not cached
        if (!isBibleLoaded) {
          try {
            const isToday = (date: Date) => {
              const today = new Date();
              return date.getDate() === today.getDate() &&
                     date.getMonth() === today.getMonth() &&
                     date.getFullYear() === today.getFullYear();
            };
            const isSelectedToday = isToday(currentDate);
            const bibleUrl = isSelectedToday 
              ? 'https://azbyka.ru/biblia/days' 
              : `https://azbyka.ru/biblia/days/${dateStr}`;
              
            const html = await fetchWithProxyFallback(bibleUrl);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const titleDivs = doc.querySelectorAll('.days__book-title[id^="reading-"]');
            
            if (titleDivs.length > 0) {
              const readingBlocks: string[] = [];
              titleDivs.forEach((titleDiv) => {
                const h2 = titleDiv.querySelector('h2');
                if (!h2) return;
                
                let titleText = '';
                let subtitleText = '';
                
                const h2Clone = h2.cloneNode(true) as HTMLElement;
                const subtitleSpan = h2Clone.querySelector('.h2-subtitle');
                if (subtitleSpan) {
                  subtitleText = subtitleSpan.textContent?.trim() || '';
                  subtitleSpan.remove();
                }
                titleText = h2Clone.textContent?.trim() || '';
                
                const versesHtml: string[] = [];
                let sibling = titleDiv.nextElementSibling;
                while (sibling && !sibling.classList.contains('days__book-title')) {
                  if (sibling.classList.contains('tbl-content') || sibling.querySelector('.verse')) {
                    const russianVerses = sibling.querySelectorAll('.verse[data-lang="r"]');
                    russianVerses.forEach((verseEl) => {
                      // Remove checkmark checkboxes and icons
                      verseEl.querySelectorAll('.checkbox, .icon-check').forEach(el => el.remove());
                      // Expand and inline inner links (like theological lexicon terms) to avoid breaking styles
                      verseEl.querySelectorAll('a').forEach(link => {
                        const span = doc.createElement('span');
                        span.innerHTML = link.innerHTML;
                        link.parentNode?.replaceChild(span, link);
                      });
                      
                      const lineNum = verseEl.getAttribute('data-line') || '';
                      const verseText = verseEl.innerHTML.replace(/\s+/g, ' ').trim();
                      versesHtml.push(`
                        <p class="mb-3 leading-relaxed text-[var(--color-ink)]/90 text-sm sm:text-base">
                          <sup class="text-[var(--color-cinnabar)] font-mono font-bold mr-1.5 text-xs align-super">${lineNum}</sup>
                          <span>${verseText}</span>
                        </p>
                      `);
                    });
                  }
                  sibling = sibling.nextElementSibling;
                }
                
                if (versesHtml.length > 0) {
                  readingBlocks.push(`
                    <div class="bg-[#fdfbf6] p-5 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm mb-6 space-y-3 hover:shadow-md transition-shadow">
                      <div class="border-b border-[var(--color-cinnabar)]/10 pb-2 mb-4">
                        <h4 class="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] leading-tight">
                          ${titleText}
                        </h4>
                        <p class="font-sans text-xs text-[var(--color-ink)]/50 uppercase tracking-wider font-semibold mt-1">
                          ${subtitleText}
                        </p>
                      </div>
                      <div class="space-y-2 font-sans">
                        ${versesHtml.join('')}
                      </div>
                    </div>
                  `);
                }
              });
              
              if (readingBlocks.length > 0) {
                const finalBibleContent = readingBlocks.join('');
                setBibleContent(finalBibleContent);
                safeLocalStorageSet(cacheKeyBible, finalBibleContent);
              } else {
                setBibleError('Тексты чтений на текущий день не найдены в русском Синодальном переводе.');
              }
            } else {
              setBibleError('Не удалось выделить разделы богослужебных чтений на текущий день.');
            }
          } catch (e) {
            console.error('Error fetching bible text:', e);
            setBibleError(e instanceof Error ? e.message : 'Ошибка при разборе текста чтений');
          } finally {
            setBibleLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching calendar day data:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке календаря');
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const oldStyleDate = new Date(currentDate);
  oldStyleDate.setDate(currentDate.getDate() - 13);
  
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const handleOpenItem = (title: string, type: 'holiday' | 'saint', uri?: string) => {
    if (!uri) return;
    const baseUrl = 'https://azbyka.ru/days';
    const fullUrl = type === 'holiday' ? `${baseUrl}/prazdnik-${uri}` : `${baseUrl}/sv-${uri}`;
    setSelectedItem({ title, url: fullUrl });
  };

  return (
    <div className="pb-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">Православный календарь</h2>
        <DecorativeDivider className="mb-4" />
        <p className="text-xs text-[var(--color-ink)] opacity-60 mt-1">(по материалам сайта azbyka.ru)</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between gap-2 max-w-xs sm:max-w-sm mx-auto mb-6 bg-white/40 p-1 rounded-full border border-[var(--color-cinnabar)]/10 shadow-sm">
        <button 
          onClick={handlePrevDay}
          className="p-2 rounded-full hover:bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] transition-all active:scale-95"
          title="Предыдущий день"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleToday}
          className="px-4 py-1.5 rounded-full bg-white/80 border border-[var(--color-cinnabar)]/10 text-xs sm:text-sm font-izhitsa text-[var(--color-cinnabar)] hover:bg-white hover:shadow-sm transition-all active:scale-95"
        >
          Сегодня
        </button>
        <button 
          onClick={handleNextDay}
          className="p-2 rounded-full hover:bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] transition-all active:scale-95"
          title="Следующий день"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Date Card */}
      <div className="mb-8 flex flex-col items-center gap-2 font-izhitsa text-lg text-[var(--color-ink)]/90 bg-white/40 p-5 rounded-xl border border-[var(--color-cinnabar)]/10 shadow-sm max-w-xl mx-auto text-center">
        <p className="capitalize font-izhitsa text-2xl text-[var(--color-cinnabar)] tracking-wide">
          {currentDate.toLocaleDateString('ru-RU', { weekday: 'long' })}
        </p>
        <div className="space-y-1.5 text-sm sm:text-base">
          <p>
            <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2 text-xs">Новый стиль:</span>
            <span className="font-sans font-medium">{currentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
          <p>
            <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2 text-xs">Старый стиль:</span>
            <span className="font-sans font-medium">{oldStyleDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-[var(--color-ink)]/70">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-cinnabar)] mb-3" />
          <span className="font-izhitsa">Получение благовременных данных...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center bg-stone-50 border border-[var(--color-cinnabar)]/20 rounded-xl text-[var(--color-ink)] animate-fade-in">
          <p className="font-izhitsa mb-2 text-[var(--color-cinnabar)]">Произошла ошибка при загрузке</p>
          <p className="text-sm font-sans mb-4 opacity-75">{error}</p>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate))}
            className="px-4 py-2 bg-[var(--color-cinnabar)] text-white font-izhitsa rounded-lg hover:bg-red-700 transition-colors"
          >
            Повторить попытку
          </button>
        </div>
      ) : !data ? null : (
        <div className="space-y-8 animate-fade-in">
          
          {/* Week & Fasting */}
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Info className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Седмица и Пост</h3>
            </div>
            
            <div className="space-y-4 text-[var(--color-ink)]">
              {data.fasting.round_week && (
                <div className="mb-2">
                  <div 
                    dangerouslySetInnerHTML={{ __html: data.fasting.round_week }} 
                    className="text-lg font-izhitsa leading-relaxed text-[var(--color-cinnabar)]/95 [&_a]:text-[var(--color-cinnabar)] [&_a]:underline hover:[&_a]:text-red-700"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {data.fasting.voice !== undefined && data.fasting.voice !== null && (
                  <div className="bg-white/40 p-4 rounded-xl border border-[var(--color-ink)]/5 flex items-center justify-between">
                    <div>
                      <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Глас</span>
                      <span className="font-izhitsa text-3xl text-[var(--color-cinnabar)]">{data.fasting.voice}</span>
                    </div>
                    <span className="text-right text-xs text-[var(--color-ink)]/40 italic font-sans pr-2">песнопения дня</span>
                  </div>
                )}

                <div className="bg-white/40 p-4 rounded-xl border border-[var(--color-ink)]/5 flex flex-col justify-center">
                  <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Особенности трапезы</span>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {data.fasting.type === 'fasting' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        Постный день
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        Поста нет
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-base font-izhitsa text-[var(--color-ink)] leading-tight">
                    {data.fasting.fasting ? (
                      <div dangerouslySetInnerHTML={{ __html: data.fasting.fasting }} className="[&_a]:text-[var(--color-cinnabar)] [&_a]:underline font-izhitsa font-medium text-[var(--color-cinnabar)]" />
                    ) : data.fasting.type === 'fasting' ? (
                      <span>Постный день (однодневный пост: среда/пятница)</span>
                    ) : (
                      <span className="font-sans text-sm text-[var(--color-ink)]/70">Разрешена любая пища (мясоед)</span>
                    )}
                  </div>
                </div>
              </div>

              {data.fasting.description && (
                <div className="bg-[#fdfcf7] p-4 rounded-xl border border-[var(--color-cinnabar)]/10 italic text-sm text-[var(--color-ink)]/80 leading-relaxed">
                  <p dangerouslySetInnerHTML={{ __html: data.fasting.description }} className="[&_a]:text-[var(--color-cinnabar)] [&_a]:underline font-sans" />
                </div>
              )}
            </div>
          </div>

          {/* Holidays */}
          {data.holidays && data.holidays.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <CalendarIcon className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Церковные праздники</h3>
              </div>
              <ul className="space-y-3">
                {data.holidays.map((holiday, i) => {
                  const canClick = !!holiday.uri;
                  return (
                    <li key={i} className="border-l-2 border-[var(--color-cinnabar)]/20 pl-4 py-1 leading-tight">
                      {canClick ? (
                        <button
                          onClick={() => handleOpenItem(holiday.title, 'holiday', holiday.uri)}
                          className="font-izhitsa text-[var(--color-cinnabar)] text-lg hover:underline text-left cursor-pointer active:opacity-80 transition-all block focus:outline-none"
                        >
                          {holiday.title}
                        </button>
                      ) : (
                        <span className="font-izhitsa text-[var(--color-ink)] text-lg">{holiday.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Saints */}
          {data.saints && data.saints.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <Users className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Память святых</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.saints.map((saint, i) => {
                  const canClick = !!saint.uri;
                  return (
                    <button
                      key={i}
                      disabled={!canClick}
                      onClick={() => handleOpenItem(saint.title, 'saint', saint.uri)}
                      className={`px-3 py-1.5 rounded-lg font-izhitsa text-sm border transition-all text-left focus:outline-none ${
                        canClick
                          ? 'bg-white/40 border-[var(--color-cinnabar)]/20 text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/10 hover:border-[var(--color-cinnabar)]/40 hover:shadow-sm cursor-pointer active:scale-95'
                          : 'bg-stone-100/60 border-stone-200 text-stone-500 cursor-default'
                      }`}
                    >
                      {saint.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Icons */}
          {data.ikons && data.ikons.length > 0 && (
            <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
              <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <ImageIcon className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Иконы дня</h3>
              </div>
              <ul className="space-y-2">
                {data.ikons.map((ikon, i) => (
                  <li key={i} className="font-izhitsa text-[var(--color-ink)]/90 italic border-l-2 border-amber-300/60 pl-4 py-1.5 leading-tight">
                    {ikon.title || ikon.clean_title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Readings in a Highly Native design */}
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10 text-[var(--color-ink)]">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <div className="flex items-center gap-3">
                <BookOpen className="text-[var(--color-cinnabar)]" size={24} />
                <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Богослужебные чтения дня</h3>
              </div>
              <a 
                href={`https://azbyka.ru/biblia/days/${dateStr}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-cinnabar)] font-izhitsa hover:underline text-xs"
              >
                Читать на Азбука.ру ↗
              </a>
            </div>
            
            {data.texts && data.texts.length > 0 && (
              <ul className="space-y-3 mb-6">
                {data.texts.map((textObj, i) => (
                  <li key={i} className="border-l-2 border-[var(--color-cinnabar)]/20 pl-4 py-1.5 leading-relaxed">
                    <div 
                       className="font-sans text-[var(--color-ink)] text-base [&_a]:text-[var(--color-cinnabar)] [&_a]:underline [&_a]:font-izhitsa hover:[&_a]:text-red-750 [&_a]:transition-colors font-medium prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: textObj.text }}
                    />
                  </li>
                ))}
              </ul>
            )}
            
            {/* Direct Bible Readings Text or Loader */}
            <div className="mt-4 pt-4 border-t border-[var(--color-cinnabar)]/10">
              {bibleLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--color-ink)]/70">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-cinnabar)] mb-3" />
                  <span className="font-izhitsa">Загрузка текстов Писания...</span>
                </div>
              ) : bibleError ? (
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/50 text-stone-700 text-sm font-sans">
                  <p className="font-semibold mb-1 text-[var(--color-cinnabar)] font-izhitsa">Не удалось загрузить тексты напрямую</p>
                  <p className="opacity-80 mb-3 text-xs">{bibleError}</p>
                  <a 
                    href={`https://azbyka.ru/biblia/days/${dateStr}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--color-cinnabar)] text-white font-izhitsa rounded-lg hover:bg-red-700 transition-colors text-xs"
                  >
                    Читать на Азбука.ру ↗
                  </a>
                </div>
              ) : bibleContent ? (
                <div 
                  className="prose max-w-none text-[var(--color-ink)]/90 font-sans text-base leading-relaxed space-y-4 max-h-[550px] overflow-y-auto pr-2
                    [&_h1]:hidden
                    [&_h2]:font-izhitsa [&_h2]:text-xl [&_h2]:text-[var(--color-cinnabar)] [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-[var(--color-cinnabar)]/10 [&_h2]:pb-2 [&_h2]:font-medium
                    [&_h3]:font-izhitsa [&_h3]:text-lg [&_h3]:text-[var(--color-cinnabar)] [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-medium
                    [&_p]:mb-3 [&_p]:leading-relaxed
                    [&_sup]:text-[var(--color-cinnabar)] [&_sup]:font-mono [&_sup]:font-semibold [&_sup]:mr-1 [&_sup]:text-xs [&_sup]:align-super
                    [&_span.verse]:text-[var(--color-cinnabar)] [&_span.verse]:font-semibold [&_span.verse]:mr-1
                    [&_.bible_text]:bg-white/40 [&_.bible_text]:p-4 [&_.bible_text]:rounded-xl [&_.bible_text]:border [&_.bible_text]:border-stone-100 [&_.bible_text]:mb-4
                    [&_table]:w-full [&_table]:my-4 [&_table]:text-sm [&_td]:p-2 [&_th]:p-2
                    [&_.lexicon]:hidden
                    [&_.lex]:hidden
                    [&_.ch_verses]:mt-2
                  "
                  dangerouslySetInnerHTML={{ __html: bibleContent }}
                />
              ) : (
                <p className="text-sm font-sans text-stone-500 italic">Духовные чтения временно недоступны.</p>
              )}
            </div>
          </div>

          {/* Comprehensive Native Fasting Calendar table widget */}
          <div className="bg-white/60 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Info className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">Календарь постов и правила трапезы</h3>
            </div>

            {/* Sub-tabs for detailed native fasting view */}
            <div className="flex border-b border-stone-200 mb-6 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-izhitsa">
              <button
                onClick={() => setFastingTab('multiday')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'multiday'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Многодневные посты
              </button>
              <button
                onClick={() => setFastingTab('oneday')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'oneday'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Однодневные посты
              </button>
              <button
                onClick={() => setFastingTab('weeks')}
                className={`py-2 px-3 shrink-0 border-b-2 font-medium transition-all ${
                  fastingTab === 'weeks'
                    ? 'border-[var(--color-cinnabar)] text-[var(--color-cinnabar)] font-semibold'
                    : 'border-transparent text-stone-500 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Сплошные седмицы
              </button>
            </div>

            {/* Fasting Tables with wider row for Descriptions */}
            <div className="overflow-x-auto">
              {fastingTab === 'multiday' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th className="px-4 py-3 rounded-l-lg">Пост / Событие</th>
                      <th className="px-4 py-3 rounded-r-lg">Период в 2026 году</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Великий пост */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Великий пост</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium">со 2 марта по 18 апреля</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-red-700">Особо строгий пост.</strong> Понедельник–пятница: сухоядение / варёная пища без масла. Суббота и воскресенье: разрешается елей (растительное масло) и вино. Рыба разрешена только в <span className="font-semibold text-amber-800">Благовещение Пресвятой Богородицы</span> (7 апреля) и <span className="font-semibold text-amber-800">Вербное воскресенье</span>. В Лазареву субботу разрешена икра.
                      </td>
                    </tr>
                    {/* Петров пост */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Петров (Апостольский)</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">с 15 июня по 11 июля</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-amber-800">Менее строгий пост.</strong> Начинается через неделю после Троицы. Рыба разрешается по субботам, воскресеньям, четвергам, вторникам и храмовым праздникам, если они приходятся на эти дни. В среды и пятницы – сухоядение или строгая пища без масла.
                      </td>
                    </tr>
                    {/* Успенский пост */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Успенский пост</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">с 14 по 27 августа</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-red-700">Строгий пост</strong> (в честь Божией Матери). Строгость трапезы такая же, как в Великий пост: рыба разрешается только в великий праздник <span className="font-semibold text-amber-800">Преображения Господня</span> (19 августа).
                      </td>
                    </tr>
                    {/* Рождественский пост */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Рождественский</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">с 28 ноября по 6 января</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        <strong className="text-orange-850 text-orange-800">Мягкий в начале, строгий в конце.</strong> С 28 ноября до Николая Чудотворца (19 декабря) по субботам, воскресеньям и праздникам разрешается рыба. С 20 декабря до 1 января рыба только в субботу и воскресенье. С 2 по 6 января – максимально строгий пост (рыба запрещена, сочельник – до первой звезды).
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {fastingTab === 'oneday' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th className="px-4 py-3 rounded-l-lg">Однодневный пост / Событие</th>
                      <th className="px-4 py-3 rounded-r-lg">Дата (нов. стиль)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Каждая среда и пятница */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-stone-800 text-base">Каждая среда и пятница</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">В течение всего года</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Среда – день предания Господа Иудой. Пятница – день Крестных страданий Спасителя. Пост отменяется только в Сплошные седмицы.
                      </td>
                    </tr>
                    {/* Крещенский сочельник */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Крещенский сочельник</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">18 января</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Навечерие великого праздника Богоявления. Строгий пост, трапеза состоит из сочива (варёной пшеницы с мёдом) после освящения воды.
                      </td>
                    </tr>
                    {/* Усекновение главы */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Усекновение главы Иоанна Предтечи</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">11 сентября</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост установлен в воспоминание мученического подвига великого Пророка Иоанна и в знак скорби о безумном пире царя Ирода. 
                      </td>
                    </tr>
                    {/* Воздвижение Креста */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-[var(--color-cinnabar)] text-base">Воздвижение Креста Господня</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">27 сентября</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост в память распятия и страданий Спасителя на Голгофе. Разрешается елей (растительное масло), но рыба запрещена.
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {fastingTab === 'weeks' && (
                <table className="min-w-full text-sm text-left text-stone-800 border-collapse">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 font-izhitsa text-[var(--color-cinnabar)]">
                      <th className="px-4 py-3 rounded-l-lg">Сплошная седмица</th>
                      <th className="px-4 py-3 rounded-r-lg">Период в календаре</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    {/* Святки */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-green-800 text-base">Святки</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium">с 7 по 17 января</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        От Рождества Христова до Крещенского сочельника. Светлые дни празднования Рождества, когда пост по средам и пятницам полностью упразднён.
                      </td>
                    </tr>
                    {/* Мытаря и фарисея */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-green-800 text-base">Мытаря и фарисея</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium">2 недели до Великого поста</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Пост упразднён для борьбы с гордыней: дабы христианин не превозносился своим постом подобно евангельскому фарисею.
                      </td>
                    </tr>
                    {/* Сырная */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-green-800 text-base">Сырная (Масленица)</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium">1 неделя до Великого поста</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Позволяет подготовиться к строгому посту физически и духовно: мясо уже запрещено во всю неделю, но сыр, сливочное масло, молоко, яйца и рыба разрешены во все дни, включая среду и пятницу.
                      </td>
                    </tr>
                    {/* Пасхальная */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-green-800 text-base">Пасхальная (Светлая)</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">Неделя после Пасхи</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Светлая и всерадостная неделя прославления Христа Воскресшего из мертвых. Любой пост отменён, верующие радуются духовно и телесно.
                      </td>
                    </tr>
                    {/* Троицкая */}
                    <tr className="bg-stone-50/20">
                      <td className="px-4 pt-3 pb-1 font-semibold font-izhitsa text-green-800 text-base">Троицкая</td>
                      <td className="px-4 pt-3 pb-1 text-stone-600 font-medium font-sans">Неделя после Троицы</td>
                    </tr>
                    <tr className="border-b border-stone-100/50">
                      <td colSpan={2} className="px-4 pb-3.5 pt-1 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans bg-white/30">
                        Неделя перед началом Петрова поста. Позволяет укрепить силы перед летним подвигом воздержания.
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Educational notes about fasting rigor */}
            <div className="mt-6 border-t border-stone-200/60 pt-4 font-sans text-xs text-stone-500 space-y-2">
              <p className="font-semibold text-stone-700 font-izhitsa text-sm mb-2">💡 Степени воздержания в пище по уставу:</p>
              <p>• <strong className="text-stone-700">Сухоядение:</strong> холодная необработанная растительная пища без масла (фрукты, сухофрукты, орехи, овощи, хлеб, вода).</p>
              <p>• <strong className="text-stone-700">Горячая пища без елея:</strong> варёная растительная пища без добавления растительного масла (супы, каши на воде).</p>
              <p>• <strong className="text-stone-700">Горячая пища с елеем:</strong> разрешаются супы, каши и тушёные овощи с растительным (оливковым/подсолнечным) маслом и натуральное виноградное вино.</p>
              <p>• <strong className="text-stone-700">Разрешение на рыбу:</strong> разрешаются любые рыбные блюда, рыбная икра и морепродукты, горячая пища с растительным маслом и вино.</p>
              <p className="italic text-stone-400 mt-2 font-sans pb-4">Примечание: мера строгости поста устанавливается индивидуально с учётом здоровья, возраста и семейных обстоятельств по благословению духовника.</p>
            </div>

            {/* Comprehensive Fasting Instructions block provided by the user */}
            <div className="mt-6 border-t border-[var(--color-cinnabar)]/20 pt-6 font-sans text-sm text-stone-800 space-y-6">
              <p className="italic text-stone-700 leading-relaxed font-medium">
                В Русской Православной Церкви существует четыре многодневных поста, посты в среду и пятницу в течение всего года (за исключением пяти седмиц, называемых сплошными), три однодневных поста.
              </p>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Великий Пост</h4>
                <p className="leading-relaxed mb-3">
                  Сам Спаситель был поведён Духом в пустыню, сорок дней искушался дьяволом и ничего не ел в эти дни. Великий пост – пост в честь Самого Спасителя, а последняя страстная седмица этого 48-дневного поста установлена в воспоминание о последних днях земной жизни, страданиях и смерти Иисуса Христа.
                </p>
                <p className="leading-relaxed mb-3 font-medium text-[var(--color-cinnabar)]">
                  С особой строгостью соблюдается пост в первую, чётвертую (Крестопоклонную) и страстную седмицы.
                </p>
                <p className="leading-relaxed mb-3">
                  В первые два дня Великого поста, а также в страстную Пятницу Типикон предписывает (монахам) полностью воздерживаться от пищи. В остальное время: среда, пятница – сухоядение (вода, хлеб, фрукты, овощи, компоты); вторник, четверг – горячая пища без масла; суббота, воскресенье – пища с растительным маслом.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  Рыба разрешается в Благовещение Пресвятой Богородицы и в Вербное воскресенье. В Лазареву субботу разрешается рыбная икра. В Страстную пятницу есть традиция не вкушать пищу до выноса плащаницы (обычно эта служба заканчивается в 15-16 часов).
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Апостольский пост</h4>
                <p className="text-stone-600 block mb-1 font-semibold uppercase tracking-wider text-xs">Начало зависит от даты Пасхи</p>
                <p className="leading-relaxed mb-3">
                  Начало Апостольского поста всегда приходится на второй понедельник после Дня Святой Троицы. Заканчивается пост всегда 12 июля – перед праздником апостолов Петра и Павла. Продолжительность поста зависит от даты Пасхи (от 8 до 42 дней.).
                </p>
                <p className="leading-relaxed mb-3">
                  Этот пост установлен в честь Святых апостолов, которые постом и молитвою приготовлялись к всемирной проповеди Евангелия и готовили себе преемников в деле спасительного служения.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В среду и пятницу горячая пища с маслом. В остальные дни – рыба, грибы, крупы с растительным маслом.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Успенский пост</h4>
                <p className="text-amber-800 block mb-1 font-semibold uppercase tracking-wider text-xs">14 августа – 27 августа</p>
                <p className="leading-relaxed mb-3">
                  Через месяц после Апостольского поста наступает многодневный Успенский пост. Он продолжается две недели – с 14 по 27 августа. Этим постом Церковь призывает нас к подражанию Божьей Матери, которая перед переселением своим на небо непрестанно пребывала в посте и молитве.
                </p>
                <p className="leading-relaxed mb-3">
                  Среда, пятница – сухоядение. Понедельник, вторник, четверг – горячая пища без масла. В субботу и воскресенье разрешается пища с растительным маслом.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В день праздника Преображения Господня (19 августа) разрешается рыба. Если праздник Успения Пресвятой Богородицы выпадает на среду или пятницу, то устав разрешает рыбу.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Рождественский пост</h4>
                <p className="text-amber-800 block mb-1 font-semibold uppercase tracking-wider text-xs">28 ноября – 6 января</p>
                <p className="leading-relaxed mb-3">
                  В конце осени, за 40 дней до великого праздника Рождества Христова, Церковь призывает нас к зимнему посту. Этот пост установлен для того, чтобы нам достойно подготовиться к благодатному единению с родившимся Спасителем.
                </p>
                <p className="leading-relaxed mb-3">
                  Если праздник Введения во Храм Пресвятой Богородицы (4 декабря) выпадает на среду или пятницу, то уставом разрешается рыба.
                </p>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  В сочельник не принято вкушать пищу до появления первой звезды, после чего вкушают сочиво – вареные в меду зерна пшеницы или отварной рис с изюмом (символом первой звезды является зажженная свеча, которая выносится в конце Литургии, совершаемой в Навечерие Рождества Христова, и перед которой поётся тропарь и кондак праздника Рождества Христова).
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Сплошные седмицы</h4>
                <p className="leading-relaxed mb-3">
                  Седмица – неделя с понедельника по воскресенье. В эти дни отсутствие поста в среду и пятницу.
                </p>
                <p className="leading-relaxed mb-3 font-semibold text-stone-700">
                  Сплошных седмиц пять:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-stone-700">
                  <li><strong>Святки</strong> – с 7 января до 18 января,</li>
                  <li><strong>Мытаря и фарисея</strong> – завершается за 2 недели до Великого Поста,</li>
                  <li><strong>Сырная (масленица)</strong> – неделя перед Великим Постом (без мяса),</li>
                  <li><strong>Пасхальная (Светлая)</strong> – неделя после Пасхи,</li>
                  <li><strong>Троицкая</strong> – неделя после Троицы.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Среда и пятница</h4>
                <p className="leading-relaxed">
                  Еженедельными постными днями являются среда и пятница (кроме сплошных седмиц). В среду пост установлен в воспоминание предательства Иудой Христа, в пятницу – в память крестных страданий и смерти Спасителя.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">Однодневные посты</h4>
                <ul className="list-disc pl-5 space-y-2 mb-3 leading-relaxed text-stone-700">
                  <li><strong>Крещенский сочельник</strong> – 18 января, накануне Крещения Господня.</li>
                  <li><strong>Усекновение главы Иоанна Предтечи</strong> – 11 сентября.</li>
                  <li><strong>Воздвижение Креста Господня</strong> – 27 сентября. Память о страданиях Спасителя на Кресте ради спасения рода человеческого.</li>
                </ul>
                <p className="leading-relaxed bg-amber-50/40 border-l-2 border-amber-300 p-3 rounded-r-lg text-stone-700">
                  Однодневные посты – дни строгого поста (кроме среды и пятницы). Запрещается рыба, но разрешается пища с растительным маслом.
                </p>
              </div>

              <div>
                <h4 className="font-izhitsa text-[var(--color-cinnabar)] text-lg mb-2 font-semibold">О трапезе в праздники</h4>
                <ul className="space-y-3 leading-relaxed text-stone-700">
                  <li className="border-l-2 border-stone-300 pl-3">
                    По церковному Уставу, в праздники Рождества Христова и Богоявления, случившиеся в среду и пятницу, поста нет.
                  </li>
                  <li className="border-l-2 border-stone-300 pl-3">
                    В Рождественский и Крещенский сочельники и в праздники Воздвижения Креста Господня и Усекновения главы Иоанна Предтечи разрешается пища с растительным маслом.
                  </li>
                  <li className="border-l-2 border-[var(--color-cinnabar)]/40 pl-3">
                    В праздники Сретения, Преображения Господня, Успения, Рождества и Покрова Пресвятой Богородицы, Введения Ее во Храм, Рождества Иоанна Предтечи, апостолов Петра и Павла, Иоанна Богослова, случившиеся в среду и пятницу, а также в период от Пасхи до Троицы в среду и пятницу <strong className="text-amber-850 text-amber-900 font-semibold">разрешается рыба</strong>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Item Modal (Native Pop-up Drawer for Azbyka content) */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-50 border border-[var(--color-cinnabar)]/20 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-[var(--color-cinnabar)]/10">
              <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] truncate pr-4">
                {selectedItem.title}
              </h4>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-500 hover:text-[var(--color-cinnabar)] transition-colors p-1"
                aria-label="Закрыть"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Context Loading and Iframe Container */}
            <div className="flex-1 bg-white relative flex flex-col">
              {/* Educational message and direct website links */}
              <div className="bg-amber-50 text-amber-950 px-4 py-2.5 text-xs border-b border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>Информация транслируется с официального источника azbyka.ru. В случае ограничений в браузере, откройте в новой вкладке:</span>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--color-cinnabar)] text-white px-3 py-1 rounded-md text-center hover:bg-red-700 transition-colors font-medium shrink-0 text-xs font-izhitsa"
                >
                  Открыть сайт Азбука.ру
                </a>
              </div>
              
              <iframe
                src={selectedItem.url}
                className="w-full h-full border-0 flex-1"
                title={selectedItem.title}
                referrerPolicy="no-referrer"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
