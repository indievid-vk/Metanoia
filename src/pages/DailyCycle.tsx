import React, { useState } from 'react';
import { Maximize2, X, Clock, Sun, Moon, Sunset, Sparkles, AlertCircle, BookOpen, Layers, Users } from 'lucide-react';
import { getAssetPath } from '../utils';
import { DecorativeDivider } from '../components/DecorativeDivider';
import { BackToTopButton } from '../components/BackToTopButton';

interface ServiceDetail {
  title: string;
  hour: string;
  meaning: string;
  history: string;
  icon: React.ReactNode;
  eventSymbolism?: string;
  type?: string;
}

export default function DailyCycle() {
  const [zoomedImage, setZoomedImage] = useState<{ src: string, alt: string } | null>(null);

  const services: ServiceDetail[] = [
    {
      title: "Вечерня",
      hour: "вечером (в соответствии с временем года)",
      meaning: "Благодарение Бога за прошедший день, воспоминание ветхозаветных времен.",
      history: "Вечерня почти всегда совершается вечером (кроме тех случаев, когда она соединяется с литургией). Однако все три вида вечерни (малая, вседневная и великая) должны, согласно Уставу, совершаться в разное время. Малая вечерня бывает «прежде солнечного захождения» (Типикон, глава 1-я); великая вечерня на бдении начинается «по еже зайти солнцу мало» (Типикон, глава 2-я); тогда как вседневная вечерня – «пред вечером мало» (Типикон, глава 9-я). Как видно, Типикон указывает только приблизительное время для начала богослужений; конкретный же час определяется в соответствии с местом и временем года (скорее всего, это обстоятельство связано с тем, что в средние века люди вообще не имели обычая указывать конкретное время, так что даже минутная стрелка на часах долгое время отсутствовала).",
      icon: <Sunset className="text-[var(--color-cinnabar)]" size={24} />,
      type: "Вечерняя группа"
    },
    {
      title: "Повечерие",
      hour: "после вечерней трапезы (ужина)",
      meaning: "Молитвы о прощении грехов, совершенных в прошедший день, и о даровании спокойного сна.",
      history: "Повечерие совершается «по вечери», то есть после вечерней трапезы, после ужина, который бывает по окончании вечерни. В монастырском укладе повечерие еще играет роль богослужения на сон грядущий; в конце большерия/повечерия совершается ежедневный чин прощения: сначала священник просит прощения у братии, затем монашествующие просят друг у друга прощения за минувший день, после чего расходятся по кельям. Повечерие бывает двух типов: малое и великое. Малое полагается чаще всего, тогда как великое повечерие (более торжественная и продолжительная служба) совершается редко, всего 34 раза в году (седмичные дни Великого поста, накануне Рождества Христова и Богоявления, а также на сырной седмице во вторник и четверг).",
      icon: <Moon className="text-[var(--color-cinnabar)]" size={24} />,
      type: "Вечерняя группа"
    },
    {
      title: "Полунощница",
      hour: "полночь / рано утром",
      meaning: "Воспоминание о сошествии Спасителя во ад, Его полуночной молитве перед страданиями и ожидание Его Второго пришествия на Землю.",
      history: "Полунощница совершается рано утром, сразу после ночного сна. По своему идейному значению она может рассматриваться как общая утренняя молитва, а ее основу составляет чтение 17-й кафизмы (то есть 118-го псалма), в каждом стихе которой есть упоминание заповедей Господних, так что ежедневное чтение данной кафисмы служит напоминанием необходимости выстраивать свою жизнь в соответствии с законом Божиим. В настоящее время полунощница совершается только в монастырях (хотя есть и исключения, например, в Санкт-Петербургской духовной академии недавно появилась практика служить полунощницу на 1-й седмице Великого поста).",
      icon: <Moon className="text-blue-500" size={24} />,
      type: "Утренняя группа"
    },
    {
      title: "Утреня",
      hour: "рано утром (до восхода солнца)",
      meaning: "Благодарение Бога за свет нового дня, воспоминание Воскресения Спасителя.",
      history: "Утреня, если она не входит в состав всенощного бдения, совершается рано утром, почти сразу же после полунощницы (после небольшого перерыва). Интересно, что греческое название утрени «орфрос» связывают с глаголом «орфризо», который означает «с трудом различать» и указывает, что утреня должна начинаться еще затемно, но с таким расчетом, чтобы к концу утрени уже взошло солнце, так что возглас перед славословием «Слава Тебе, показавшему нам свет» уже должен произноситься после рассвета. В Неделю Пасхи утреня начинается ровно в полночь, а два дня в году – четверг 5-й седмицы Великого поста (день чтения Великого канона) и в Великую Пятницу – служение утрени назначается в вечернее время самим Уставом.",
      icon: <Sun className="text-amber-500" size={24} />,
      type: "Утренняя группа"
    },
    {
      title: "1-й час",
      hour: "≈ 06:00 утра (первый час дня)",
      meaning: "Освящение молитвой начала нового трудового дня.",
      history: "Соответствует началу утренней четверти дня. Часы напоминают о событиях Священной Истории, происходивших именно в эти временные отрезки. На службе первого часа вспоминается путь Иисуса Христа от первосвященника Каиафы в преторию к прокуратору Понтию Пилату и лжесвидетельства на Него. Служба призывает нас начинать день праведно с молитвой.",
      icon: <Clock className="text-zinc-500" size={24} />,
      type: "Утренняя группа"
    },
    {
      title: "3-й час",
      hour: "≈ 09:00 утра (третий час дня)",
      meaning: "Память о сошествии Святого Духа на святых апостолов.",
      history: "Совершается в 9 часов утра по нашему времени (третий час по древнему счислению). В Книге Деяний апостольских упоминается: «Петр и Иоанн шли вместе в храм в час молитвы девятый» (Деян. 3:1); «Петр около шестого часа взошел на верх дома помолиться» (Деян. 10:9). На третьем часе вспоминается суд Пилата над Господом, Его истязания, а также сошествие Святого Духа на апостолов в Сионской горнице в день Пятидесятницы.",
      icon: <Sparkles className="text-amber-600" size={24} />,
      type: "Дневная группа"
    },
    {
      title: "6-й час",
      hour: "≈ 12:00 дня (полдень)",
      meaning: "Воспоминание о добровольном распятии Спасителя на Кресте.",
      history: "Совершается в полдень (в 12 часов дня). На нем мы вспоминаем шествие Спасителя на Голгофу, Его распятие, Его немыслимые страдания за грехи мира и страшную тьму, покрывшую всю землю в этот полдневный час.",
      icon: <Clock className="text-red-600" size={24} />,
      type: "Дневная группа"
    },
    {
      title: "9-й час",
      hour: "≈ 15:00 дня (девятый час дня)",
      meaning: "Воспоминание о спасительной смерти Христа Спасителя.",
      history: "Девятый час совершается в 3 часа дня (в 15:00). На нем мы благоговейно вспоминаем крестную смерть Господа. Особенное внимание следует обратить на положение 9-го часа в схеме суточного круга: являясь началом вечернего богослужения, которое имеет отношение к грядущему дню, 9-й час сам завершает службу уходящего дня, так как на нем читаются тропарь и кондак уходящего дня. Это символизирует великолепную непрерывность богослужения в Православной Церкви.",
      icon: <Clock className="text-red-800" size={24} />,
      type: "Вечерняя группа"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 select-text">
      <BackToTopButton />
      
      {/* Page Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
          Суточный круг
        </h1>
        <DecorativeDivider className="mb-4" />
        <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
          (по материалам академических исследований и ресурса azbyka.ru)
        </p>
      </div>

      {/* Main text block 1 */}
      <div className="bg-white/40 border border-[var(--color-cinnabar)]/10 rounded-2xl p-6 sm:p-8 space-y-6 text-justify shadow-sm">
        <p className="text-[var(--color-ink)]/90 leading-relaxed text-[15px] sm:text-[17px] font-sans">
          <strong>Суточный круг богослужения</strong> составляют службы, совершаемые в течение суток, причем сутки по церковному счислению начинаются с вечера, так что каждый вечер в богослужебном смысле относится уже к завтрашнему дню. Это счисление перешло в Христианскую Церковь из Ветхого Завета. Евреи считали началом суток время солнечного заката (примерно 18.00), и поэтому сутками считался период между солнечным закатом настоящего дня и следующего дня.
        </p>

        <p className="text-[var(--color-ink)]/90 leading-relaxed text-[15px] sm:text-[17px] font-sans">
          В своем современном виде суточный круг богослужения Православной Церкви сформировался к XI в. Он включает в себя восемь отдельных служб: <strong>вечерню</strong>, <strong>повечерие</strong>, <strong>полунощницу</strong>, <strong>утреню</strong>, <strong>1-й час</strong>, <strong>3-й час</strong>, <strong>6-й час</strong> и <strong>9-й час</strong>. Каждая из указанных служб «привязана» к определенному времени суток, о чем подробнее будет сказано далее.
        </p>
      </div>

      {/* Main scheme image block */}
      <div 
        className="max-w-md mx-auto relative cursor-pointer group rounded-xl overflow-hidden border-2 border-[var(--color-cinnabar)]/20 shadow-md bg-white/40 p-1 mb-8 transition-all hover:border-[var(--color-cinnabar)]/40 hover:shadow-lg"
        onClick={() => setZoomedImage({ src: getAssetPath('/images/Sutoch_krug.webp'), alt: 'Схема суточного круга богослужения' })}
      >
        <div className="absolute top-3 right-3 text-white bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Maximize2 size={18} />
        </div>
        <img 
          src={getAssetPath('/images/Sutoch_krug.webp')} 
          alt="Схема суточного круга богослужения" 
          className="w-full h-auto rounded-lg object-contain max-h-[380px] transition-transform duration-300 group-hover:scale-[1.01]" 
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 text-center">
          <span className="text-white text-xs font-sans drop-shadow-sm font-medium">Нажмите на схему для детального увеличения</span>
        </div>
      </div>

      {/* Liturgy block with explanations */}
      <div className="bg-amber-50/45 border-l-4 border-amber-600 rounded-r-xl p-6 sm:p-8 space-y-4 shadow-sm font-sans">
        <h3 className="font-izhitsa text-xl sm:text-2xl text-amber-900 flex items-center gap-2">
          <Sparkles className="text-amber-700 shrink-0" size={24} />
          Особое место Божественной литургии
        </h3>
        <p className="text-[var(--color-ink)]/90 leading-relaxed text-[15px] sm:text-[16px] text-justify">
          Как видно, в этот перечень не включено самое главное богослужение Церкви – <strong>литургия</strong>, причем сделано это намеренно, так как, несмотря на почти ежедневное совершение литургии, есть серьезные основания против ее отнесения к суточному кругу богослужения:
        </p>
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="bg-white/70 p-4 rounded-lg border border-amber-600/10 space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Во-первых</span>
            <p className="text-sm text-[var(--color-ink)]/85 text-justify">
              Литургия никак не может считаться рядовым богослужением, но является величайшим таинством, более того, у святых отцов она именуется <strong>«таинством таинств»</strong>.
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-lg border border-amber-600/10 space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Во-вторых</span>
            <p className="text-sm text-[var(--color-ink)]/85 text-justify">
              Устав знает немало дней, когда литургия вовсе не совершается (среда и пятница сырной седмицы, понедельник, вторник и четверг 1-й, 2-й, 3-й, 4-й и 6-й седмиц Святой Четыредесятницы, понедельник и вторник 5-й седмицы, а также Великая Пятница). В то же время остальные службы (вечерня, утреня, повечерие, полунощница и часы) совершаются во все дни без единого исключения.
            </p>
          </div>

          <div className="bg-white/70 p-4 rounded-lg border border-amber-600/10 space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">В-третьих</span>
            <p className="text-sm text-[var(--color-ink)]/85 text-justify">
              Евхаристия в Уставе не связывается жестко с определенным часом суток; литургия может совершаться в различное время. Чаще она совершается утром (хотя и здесь возможны вариации: в воскресные дни и в великие праздники она по Типикону должна начинаться «в начале 3-го часа» (≈ 9.00), в субботу – «в начале 4-го часа» (около 10.00), во все остальные дни седмицы – «в начале 5-го часа» (≈ 11.00)), но в некоторые дни строгого поста она полагается после вечерни, то есть во второй половине дня.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Context of Hours */}
      <div className="bg-[var(--color-cinnabar)]/[0.02] border border-[var(--color-cinnabar)]/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm font-sans">
        <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] flex items-center gap-2">
          <BookOpen size={20} className="shrink-0 text-[var(--color-cinnabar)]" />
          Историческое разделение суток
        </h3>
        <p className="text-[var(--color-ink)]/85 leading-relaxed text-sm sm:text-base text-justify">
          Устав для совершения каждой службы назначает определенное время, причем различные виды одной и той же службы могут совершаться в разное время.
        </p>
        <p className="text-[var(--color-ink)]/85 leading-relaxed text-sm sm:text-base text-justify">
          Почему именно службы часов назначены Уставом на 1-й, 3-й, 6-й и 9-й часы дня? Нужно вспомнить, что римские сутки делились на две равные части: день и ночь. Каждая из половинок, в свою очередь, делилась на трехчасия. 1-й, 3-й, 6-й, 9-й – это первые часы каждой из четвертей дня; первый час соответствует шести часам утра.
        </p>
      </div>

      {/* Services List - Chronicling sequence */}
      <div className="space-y-6 pt-4">
        <h2 className="font-izhitsa text-2xl sm:text-3xl text-[var(--color-cinnabar)] text-center mb-6">
          Восемь богослужений церковного дня
        </h2>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/45 border border-[var(--color-cinnabar)]/10 rounded-xl p-5 hover:bg-white/65 hover:border-[var(--color-cinnabar)]/25 transition-all text-justify font-sans space-y-2 relative overflow-hidden group shadow-sm"
            >
              {/* Index indicator */}
              <div className="absolute -top-3 -right-3 text-5xl font-bold font-izhitsa text-[var(--color-cinnabar)]/5 pointer-events-none select-none group-hover:text-[var(--color-cinnabar)]/10 transition-colors">
                {index + 1}
              </div>

              <div className="flex items-center gap-3 border-b border-[var(--color-cinnabar)]/10 pb-2">
                <div className="p-1.5 bg-[var(--color-cinnabar)]/5 rounded">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] group-hover:translate-x-0.5 transition-transform">
                    {service.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--color-ink)]/55 tracking-wider uppercase font-semibold">
                    <span>Время: {service.hour}</span>
                    <span className="text-[var(--color-cinnabar)]/30">•</span>
                    <span className="text-[var(--color-cinnabar)]">{service.type}</span>
                  </div>
                </div>
              </div>

              <p className="font-semibold text-[var(--color-ink)]/90 text-sm sm:text-base italic pt-1">
                {service.meaning}
              </p>
              
              <p className="text-[var(--color-ink)]/80 text-sm sm:text-base leading-relaxed">
                {service.history}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Liturgical Grouping - Layout with columns */}
      <div className="bg-white/40 border border-[var(--color-cinnabar)]/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm font-sans">
        <h3 className="font-izhitsa text-xl sm:text-2xl text-[var(--color-cinnabar)] text-center flex items-center justify-center gap-2">
          <Layers className="text-[var(--color-cinnabar)] shrink-0" size={24} />
          Объединение служб в группы
        </h3>
        
        <p className="text-[var(--color-ink)]/90 leading-relaxed text-[15px] sm:text-[16px] text-justify">
          В древности, особенно в монастырях, каждая служба суточного круга совершалась отдельно от других. Но впоследствии Церковь, снисходя к житейским нуждам христиан, к их немощи, назначила отправлять по несколько служб вместе за один раз. В итоге сформировались три основные группы служб:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Ideal view according to Typicon */}
          <div className="bg-stone-50/70 border border-stone-200/50 rounded-xl p-5 space-y-4">
            <h4 className="font-izhitsa text-md sm:text-lg text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-1.5 flex items-center gap-2">
              <BookOpen size={18} />
              По уставу (Типикон)
            </h4>
            <div className="space-y-3.5 text-sm sm:text-[15px]">
              <div>
                <p className="font-bold text-[var(--color-ink)]/90 mb-1">Утренняя группа служб:</p>
                <p className="text-[var(--color-ink)]/75">Полунощница, утреня, 1-й час.</p>
              </div>
              <div>
                <p className="font-bold text-[var(--color-ink)]/90 mb-1">Дневная группа служб:</p>
                <p className="text-[var(--color-ink)]/75">3-й час, 6-й час и Божественная литургия.</p>
              </div>
              <div>
                <p className="font-bold text-[var(--color-ink)]/90 mb-1">Вечерняя группа служб:</p>
                <p className="text-[var(--color-ink)]/75">9-й час, вечерня и повечерие.</p>
              </div>
              <p className="text-xs text-[var(--color-ink)]/65 italic pt-1 text-justify">
                Особенное внимание следует обратить на положение 9-го часа: являясь началом вечернего богослужения, он сам завершает службу уходящего дня, что символизирует непрерывность богослужения.
              </p>
            </div>
          </div>

          {/* Modern parish practice */}
          <div className="bg-amber-50/20 border border-amber-600/10 rounded-xl p-5 space-y-4">
            <h4 className="font-izhitsa text-md sm:text-lg text-amber-800 border-b border-amber-600/10 pb-1.5 flex items-center gap-2">
              <Users size={18} />
              Современная приходская практика
            </h4>
            <div className="space-y-3.5 text-sm sm:text-[15px]">
              <div>
                <p className="font-bold text-[var(--color-ink)]/90 mb-1">Вечернее богослужение:</p>
                <p className="text-[var(--color-ink)]/75">9-й час, вечерня, утреня и 1-й час (совершаются вместе).</p>
              </div>
              <div>
                <p className="font-bold text-[var(--color-ink)]/90 mb-1">Утреннее богослужение:</p>
                <p className="text-[var(--color-ink)]/75">3-й час, 6-й час и Божественная литургия.</p>
              </div>
              <p className="text-xs text-[var(--color-ink)]/65 italic pt-1 text-justify">
                На приходах редко совершаются такие службы, как повечерие и полунощница. Великое повечерие совершается в Навечерие Рождества и Богоявления, а также в будни Великого поста. Полунощница в классическом виде не совершается вовсе.
              </p>
            </div>
          </div>
        </div>

        {/* Biblical Quote and modern times notes */}
        <div className="border-t border-[var(--color-cinnabar)]/10 pt-4 space-y-3 font-sans text-sm sm:text-base leading-relaxed text-justify text-[var(--color-ink)]/80">
          <p>
            Такое разделение суточного круга на три группы служб имеет своим основанием слова Псалмопевца: <em>«Вечер и заутра и полудне повем, и возвещу, и услышит глас мой»</em> (Пс. 54:18), а также слова церковной молитвы: <em>«Вечер, и заутра, и полудне, хвалим, благословим, благодарим и молимся Тебе, Владыко всех…»</em> (молитва входа на вечерне).
          </p>
          <p>
            Начало вечернего богослужения колеблется от 15.00 до 18.00 (в зависимости от времени года и возможностей прихожан), а утреннее богослужение начинается в 8.00–10.00. Ранние литургии, совершающиеся в больших соборных храмах, могут начинаться в 7.00. Такова современная богослужебная практика в течение большей части года (кроме периода Великого поста).
          </p>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)}
        >
          <button className="fixed top-4 right-4 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-[110]">
            <X size={24} />
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={zoomedImage.src} 
              alt={zoomedImage.alt} 
              className="max-w-full max-h-full object-contain shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
