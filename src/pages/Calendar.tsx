import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, BookOpen, Info, Image as ImageIcon, Users } from 'lucide-react';

type AzbykaResponse = {
  saints: { title: string }[];
  holidays: { title: string }[];
  texts: { text: string }[];
  ikons: { title: string; clean_title?: string }[];
  fasting: {
    round_week: string;
    fasting: string;
    description: string | null;
    voice: number;
  };
};

export default function Calendar() {
  const [data, setData] = useState<AzbykaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        
        // Use local date instead of UTC to avoid timezone issues (e.g. showing yesterday's data)
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://azbyka.ru/days/api/day/${dateStr}.json`);
        if (!res.ok) {
          throw new Error('Failed to fetch calendar data');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  if (loading) {
    return <div className="p-4 text-center text-[var(--color-ink)]">Загрузка...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Ошибка: {error}</div>;
  }

  if (!data) {
    return null;
  }

  const oldStyleDate = new Date(currentDate);
  oldStyleDate.setDate(currentDate.getDate() - 13);
  
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return (
    <div className="pb-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)]">Православный календарь</h2>
        <p className="text-xs text-[var(--color-ink)] opacity-60 mt-1">(по материалам сайта azbyka.ru)</p>
        
        <div className="mt-6 flex flex-col items-center gap-2 font-serif text-lg text-[var(--color-ink)]/90 bg-white/40 p-4 rounded-lg border border-[var(--color-cinnabar)]/10 shadow-sm">
          <p className="capitalize font-kurale text-2xl text-[var(--color-cinnabar)]">
            {currentDate.toLocaleDateString('ru-RU', { weekday: 'long' })}
          </p>
          <div className="space-y-1 text-sm sm:text-base">
            <p>
              <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2">Новый стиль:</span>
              <span className="font-semibold">{currentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
            <p>
              <span className="text-[var(--color-ink)]/50 uppercase tracking-widest mr-2">Старый стиль:</span>
              <span className="font-semibold">{oldStyleDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
        </div>
        
        <div className="ornament-divider mt-6">☩</div>
      </div>

      <div className="space-y-8">
        {/* Week & Fasting */}
        <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
          <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
            <Info className="text-[var(--color-cinnabar)]" size={24} />
            <h3 className="font-kurale text-xl text-[var(--color-cinnabar)]">Седмица и Пост</h3>
          </div>
          <div className="space-y-4 font-sans text-[var(--color-ink)]">
            {data.fasting.round_week && (
              <div className="mb-4">
                <p dangerouslySetInnerHTML={{ __html: data.fasting.round_week }} className="prose prose-sm prose-a:text-[var(--color-cinnabar)] prose-a:no-underline hover:prose-a:underline text-xl font-kurale leading-relaxed text-[var(--color-cinnabar)]/90" />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {data.fasting.voice && (
                <div className="bg-white/40 p-3 rounded border border-[var(--color-ink)]/5">
                   <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Глас</span>
                   <span className="font-kurale text-2xl text-[var(--color-cinnabar)]">{data.fasting.voice}</span>
                </div>
              )}

              <div className="bg-white/40 p-3 rounded border border-[var(--color-ink)]/5">
                <span className="text-[var(--color-ink)]/50 text-xs uppercase tracking-widest block mb-1">Особенности дня</span>
                {data.fasting.fasting || data.fasting.description ? (
                  <div className="flex-1">
                    {data.fasting.fasting && (
                      <p dangerouslySetInnerHTML={{ __html: data.fasting.fasting }} className="text-lg font-kurale text-[var(--color-ink)] leading-tight" />
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-kurale text-[var(--color-ink)]">Поста нет</p>
                )}
              </div>
            </div>

            {data.fasting.description && (
              <div className="bg-white/40 p-4 rounded border border-[var(--color-ink)]/5 italic text-sm text-[var(--color-ink)]/80 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: data.fasting.description }} />
              </div>
            )}
          </div>
        </div>

        {/* Holidays */}
        {data.holidays && data.holidays.length > 0 && (
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <CalendarIcon className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-kurale text-xl text-[var(--color-cinnabar)]">Церковные праздники</h3>
            </div>
            <ul className="space-y-3">
              {data.holidays.map((holiday, i) => (
                <li key={i} className="font-kurale text-[var(--color-ink)] text-lg border-l-2 border-[var(--color-cinnabar)]/20 pl-4 py-1 leading-tight">{holiday.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Saints */}
        {data.saints && data.saints.length > 0 && (
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <Users className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-kurale text-xl text-[var(--color-cinnabar)]">Память святых</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.saints.map((saint, i) => (
                <span key={i} className="bg-white/40 border border-[var(--color-ink)]/10 px-3 py-1.5 rounded-lg font-kurale text-[var(--color-ink)]/90 text-sm hover:bg-white transition-colors">{saint.title}</span>
              ))}
            </div>
          </div>
        )}

        {/* Icons */}
        {data.ikons && data.ikons.length > 0 && (
          <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
              <ImageIcon className="text-[var(--color-cinnabar)]" size={24} />
              <h3 className="font-kurale text-xl text-[var(--color-cinnabar)]">Иконы дня</h3>
            </div>
            <ul className="space-y-2">
              {data.ikons.map((ikon, i) => (
                <li key={i} className="font-kurale text-[var(--color-ink)]/90 italic border-b border-[var(--color-ink)]/5 pb-2 last:border-0">{ikon.title || ikon.clean_title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Readings */}
        <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
          <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-cinnabar)]/10 pb-2">
            <BookOpen className="text-[var(--color-cinnabar)]" size={24} />
            <h3 className="font-kurale text-xl text-[var(--color-cinnabar)]">Богослужебные чтения</h3>
          </div>
          
          {data.texts && data.texts.length > 0 && (
            <div className="space-y-6 mb-8">
              {data.texts.map((textObj, i) => (
                <div key={i} className="relative bg-white/30 p-4 rounded-lg border border-[var(--color-ink)]/5">
                  <div className="font-serif text-[var(--color-ink)]/90 text-lg leading-relaxed azbyka-content"
                    dangerouslySetInnerHTML={{ __html: textObj.text }}
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="w-full h-[500px] overflow-hidden rounded-lg border border-[var(--color-ink)]/20 bg-white">
            <iframe 
              src={`https://azbyka.ru/biblia/days/${dateStr}`} 
              className="w-full h-full"
              title="Богослужебные чтения"
            />
          </div>
        </div>

        {/* Fasting Calendar */}
        <div className="bg-white/60 rounded-xl p-6 shadow-sm border border-[var(--color-ink)]/10">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-[var(--color-cinnabar)]" size={24} />
            <h3 className="font-kurale text-xl text-[var(--color-ink)]">Календарь постов и трапез</h3>
          </div>
          <div className="w-full h-[600px] overflow-hidden rounded-lg border border-[var(--color-ink)]/20 bg-white">
            <iframe 
              src="https://azbyka.ru/days/p-kalendar-postov-i-trapez" 
              className="w-full h-full"
              title="Календарь постов"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
