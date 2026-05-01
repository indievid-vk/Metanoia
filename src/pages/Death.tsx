import React, { useState } from 'react';
import { Maximize2, Minimize2, BookText, ChevronRight } from 'lucide-react';

export default function Death() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-4 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            О смерти
          </h1>
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (учение Православной Церкви)
          </p>
          <div className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Святоотеческое учение о переходе в вечность и памяти смертной.
          </div>

          <div className="mt-6 grid gap-4 max-w-xl mx-auto">
            <a 
              href="/books/Слово о смерти.gen.epub"
              download="Слово о смерти.gen.epub"
              className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group text-left"
            >
              <BookText className="group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex-1">
                <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                <div className="text-lg leading-tight">Слово о смерти</div>
              </div>
              <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
            </a>
            <a 
              href="/books/Прибавление к _Слову о смерти_.gen.epub"
              download="Прибавление к _Слову о смерти_.gen.epub"
              className="flex items-center gap-4 bg-[var(--color-cinnabar)] text-[var(--color-parchment)] p-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-kurale group text-left"
            >
              <BookText className="group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex-1">
                <div className="text-xs opacity-80 font-sans uppercase tracking-wider">Скачать EPUB</div>
                <div className="text-lg leading-tight">Прибавление к «Слову о смерти»</div>
              </div>
              <ChevronRight className="group-hover:translate-x-1 transition-transform shrink-0" />
            </a>
          </div>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="relative z-10">
          <div className="space-y-6">
        <div className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm leading-relaxed italic text-center">
          Смерть — это великое таинство и рождение человека из временной земной жизни в вечность. В первый посмертный период, длящийся 40 дней, решается предварительная участь души до всеобщих Воскресения и Страшного Суда.
        </div>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">Разлучение души с телом</h3>
          <p className="leading-relaxed">
            В час кончины болезненно расторгается союз души и тела. При исходе из тела душу встречают духовные существа — святые Ангелы и мрачные демоны. Для праведников этот переход исполнен мира, их души Ангелы with любовью относят в райские обители. Для грешников же смерть люта: к ним приступают полчища демонов (эфиопов), чей вид бывает страшнее самой геенны огненной. Демоны предъявляют списки грехов души и пытаются тотчас поглотить её.
          </p>
        </section>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">Первые три дня и воздушные мытарства</h3>
          <div className="space-y-4 leading-relaxed">
            <p>
              В течение первых двух дней душа, сопровождаемая Ангелами, обычно пребывает на земле, скитаясь около гроба или посещая те места, где имела обыкновение творить правду. На третий день в подражание Воскресению Христову душа начинает восхождение к небу через воздушное пространство, где проходит мытарства.
            </p>
            <p>
              Мытарства — это 20 своеобразных судилищ и застав на пути от земли к небу, на которых падшие духи (мытари) задерживают и истязуют душу в содеянных ею грехах. Каждое мытарство соответствует определенной страсти: от празднословия, лжи и чревоугодия до воровства, лихвы, блуда, прелюбодеяния, ересей и немилосердия. Святые Ангелы противопоставляют обвинениям бесов добрые дела души и её искреннее покаяние. Если грехи были исповеданы и омыты раскаянием, они невидимо заглаживаются, и демоны не находят их в своих свитках.
            </p>
          </div>
        </section>

        {/* Image Section */}
        <section className="bg-white/50 p-4 rounded-lg border border-[var(--color-cinnabar)]/20 shadow-md">
          <div 
            className="w-full max-w-md mx-auto border-2 border-[var(--color-ink)]/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg relative cursor-pointer transition-all duration-300"
            onClick={() => setIsExpanded(true)}
          >
            <div className="absolute top-2 right-2 text-[var(--color-ink)] bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors">
              <Maximize2 size={20} />
            </div>
            <img 
              src="/images/mitarstva.webp" 
              alt="20 мытарств: путь души к Царствию Небесному" 
              className="w-full h-auto object-contain"
              
            />
            <div className="bg-[var(--color-parchment)] p-3 text-sm text-center text-[var(--color-ink)]/80 border-t border-[var(--color-ink)]/10">
              20 мытарств: путь души к Царствию Небесному (нажмите для увеличения)
            </div>
          </div>
        </section>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">С 3-го по 9-й день</h3>
          <p className="leading-relaxed">
            После первого поклонения Ангелы показывают душе различные обители святых и неизреченную красоту рая. В течение шести дней душа созерцает это благолепие, забывая земные скорби, а на девятый день возносится для второго поклонения Творцу. Поминовение в девятый день совершается Церковью с молитвой о причислении усопшего к девяти ликам ангельским.
          </p>
        </section>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">С 9-го по 40-й день и частный суд</h3>
          <p className="leading-relaxed">
            После второго поклонения Владыка повелевает показать душе ад со всеми его муками. В течение тридцати дней душу водят по адским отделениям, где она видит плач, стон и скрежет зубов грешников, трепеща, чтобы и самой не оказаться там. На сороковой день душа в третий раз предстает пред Богом для свершения частного суда, на котором Праведный Судья определяет место её пребывания до всеобщего воскресения мертвых. Этот день имеет великое значение: как Господь вознесся на сороковой день, так и души усопших получают свой загробный жребий.
          </p>
        </section>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2 text-red-800">Какие души идут в ад без прохождения мытарств</h3>
          <div className="space-y-4 leading-relaxed">
            <p>
              Путем воздушных мытарств восходят и подвергаются испытанию только люди, просвещенные христианской верой и омытые святым Крещением. Прямо в адскую бездну без всякого испытания нисходят:
            </p>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong>Неверующие и идолослужители:</strong> Все чуждые Бога, магометане и не познавшие истины.</li>
              <li><strong>Еретики и отступники:</strong> Искажавшие православную веру и умершие в заблуждении без раскаяния.</li>
              <li><strong>Христиане в смертных грехах:</strong> Те, кто впал в смертные грехи и не уврачевал свою душу искренним покаянием до разлучения с телом.</li>
            </ul>
          </div>
        </section>

        <section className="bg-white/50 p-6 rounded-lg border border-[var(--color-ink)]/10 shadow-sm space-y-4">
          <h3 className="font-kurale text-xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/10 pb-2">Помощь душам молитвами со стороны Церкви и родных</h3>
          <div className="space-y-4 leading-relaxed">
            <p>
              Участь душ за гробом не является абсолютно неизменной до Страшного Суда. Души людей, впавших в грехи, но покаявшихся перед смертью и не успевших принести плоды покаяния, нисходят в ад, но сохраняют надежду на облегчение и освобождение.
            </p>
            <p className="font-kurale text-lg text-[var(--color-cinnabar)]">Средства помощи:</p>
            <ol className="space-y-3 list-decimal list-inside">
              <li><strong>Бескровная Жертва (Божественная Литургия):</strong> Самое сильное средство умилостивления Бога.</li>
              <li><strong>Молитвы Церкви и близких:</strong> Искренняя молитва преклоняет милосердие Божие.</li>
              <li><strong>Милостыня и благотворения:</strong> Дела милосердия в память об усопшем.</li>
            </ol>
            <p className="italic text-sm opacity-80 border-t border-[var(--color-ink)]/10 pt-4">
              Важно помнить, что ходатайство живых приносит пользу только тем, кто умер в вере, не отчаявшись, и имел в себе хотя бы начатки покаяния.
            </p>
          </div>
        </section>
      </div>
      </div>
      </div>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 overflow-auto"
          onClick={() => setIsExpanded(false)}
        >
          <button className="fixed top-4 right-4 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md z-[110]">
            <Minimize2 size={24} />
          </button>
          <div className="w-max min-w-full min-h-full p-4 sm:p-8 flex items-start justify-start">
            <img 
              src="/images/mitarstva.webp" 
              alt="20 мытарств: путь души к Царствию Небесному (увеличено)" 
              className="max-w-none w-[200vw] sm:w-[150vw] md:w-auto h-auto"
              onClick={(e) => e.stopPropagation()}
              
            />
          </div>
        </div>
      )}
    </div>
  );
}
