import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, FileText, List, Table, ChevronLeft, ChevronRight } from 'lucide-react';
import liturgiesData from '../data/liturgies.json';
import { BackToTopButton } from '../components/BackToTopButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

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
            <h4 className="font-izhitsa text-lg text-[var(--color-cinnabar)] mb-1">
              {item.title}
            </h4>
          )}
          <div className="text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap font-izhitsa">
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
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-cinnabar)]/40 font-izhitsa block mb-2">Перевод</span>
            <div className="text-[var(--color-ink)]/70 leading-relaxed italic whitespace-pre-wrap text-sm">
              {item.russian}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const explanationSections = [
  {
    title: "1. Понятие о Божественной Литургии и Храме",
    content: `Божественная Литургия (от греч. λειτουργία — «общее дело», «общественное служение») — самое главное богослужение Православной Церкви, во время которого совершается величайшее Таинство Евхаристии (Благодарения). На Литургии хлеб и вино таинственным образом пресуществляются силой и действием Святого Духа в истинные Тело и Кровь Господа Иисуса Христа. Причащаясь Их, верующие таинственно соединяются со Спасителем во очищение грехов и в жизнь вечную.

Православный Храм — это дом Божий, особое здание, воздвигнутое верующими и освященное епископом для совершения Таинств и соборной молитвы. Храм является видимым образом Неба на земле. Совместная молитва в храме имеет исключительное значение, так как, по слову Христа: «где двое или трое собраны во имя Мое, там Я посреди них» (Мф. 18:20).`
  },
  {
    title: "2. Три части храма и их символическое устройство",
    content: `Устройство храма символически отображает духовную жизнь христианина и восходит по своей структуре к ветхозаветной Скинии. Храм разделяется на три основные части, символизирующие духовный путь христианина от покаяния к вечному Царству Божию:

• Притвор (нартекс) — входная часть храма. В древности здесь стояли кающиеся, временно недопущенные к Причастию, а также оглашенные (готовившиеся принять Крещение) и странники. Духовно притвор символизирует падший земной мир, который только готовится к принятию Истины и ожидает искупления.

• Средняя часть храма (наос, или корабль) — основная часть храма, где стоят молящиеся. Символизирует земной путь Церкви к Богу, ковчег спасения, ведомый Самим Христом сквозь житейское море к вечной жизни.

• Алтарь — самая священная часть храма, отделенная иконостасом, символизирующая Горний мир, Царство Небесное. В центре алтаря находится святой Престол.`
  },
  {
    title: "3. Святой Престол и Жертвенник",
    content: `В алтаре находятся важнейшие священные места и предметы, вокруг которых сосредоточено все таинственное служение:

• Святой Престол — четырехугольный стол в центре алтаря, особо освященный архиереем. Престол знаменует собой Престол Самого Бога, на котором невидимо присутствует Царь славы, а также Гроб Господень. К Престолу разрешено прикасаться только священнослужителям. На нем всегда находятся:
  - Антиминс — шелковый плат с изображением положения Христа во гроб и зашитой частицей святых мощей, без которого невозможно совершение Литургии;
  - Напрестольное Евангелие и Святой Крест;
  - Дарохранительница — священный сосуд в виде храма, где хранятся Святые Дары для причащения больных на дому.

• Жертвенник — стол в левой (северной) части алтаря. Он знаменует Вифлеемские ясли, где родился Спаситель, а также Голгофу, где Он претерпел Крестные муки. На Жертвеннике совершается первая часть Литургии — Проскомидия. На нем подготавливают вещество• Епископ (архиерей) — высший чин в церковной иерархии. Епископ имеет полноту благодати, совершает все Таинства (включая рукоположение).
• Священник (иерей, пресвитер) — совершает все Таинства (кроме рукоположения) по благословению епископа.
• Диакон — помощник священника, сам совершать Таинства не может.

Священническое благословение — особый жест (перстосложение), при котором пальцы руки складываются так, чтобы образовать греческие буквы I, C, X, C, буквенно означающие имя Иисус Христос. Посредством этого знака молящимся преподается не человеческое благословение, а благословение Самого Господа Иисуса Христа. Ответ прихожан «И духови твоему» означает молитву о ниспослании душевного мира самому служащему пастырю.

• Поклоны (земные и поясные) — выражают величайшее смирение человека пред величием Божиим, раскаяние в грехах и благоговение перед святостью Таинств. На преклонение колен во время Литургии в воскресные дни налагается канонический запрет (кроме праздника Пятидесятницы), поскольку воскресенье — день радости о Воскресении Христовом.

• Тайные молитвы — молитвы, читаемые священником у Престола вполголоса или шепотом во время пения хором песнопений (например, Херувимской песни или Евхаристического канона). Эти молитвы выражают сокровенные прошения всей Церкви, обращенные к Отцу Небесному, и отражают духовное пребывание пастыря наедине с Богом в священной тишине алтаря.`
  }
];

interface LiturgyStage {
  step: string;
  stage: string;
  actions: string;
  explanation: string;
  symbolism: string;
  prostrations: string;
}

const liturgyStages: LiturgyStage[] = [
  {
    step: "1",
    stage: "Проскомидия (совершается в алтаре до начала службы)",
    actions: "- Священник совершает три земных поклона перед жертвенником.\n- Берёт **агничную просфору**, копием делает на ней знамение креста, вырезает кубическую часть — Агнец, кладёт его на дискос, надрезает крестообразно и прокалывает в воспоминание страданий Христа.\n- Из **Богородичной просфоры** вынимает частицу в честь Богородицы.\n- Из **девятичинной** — 9 частиц за святых (9 чинов).\n- Из четвёртой просфоры — частицы за живых, из пятой — за усопших.\n- Частицы укладывает на дискосе вокруг Агнца.\n- В потир вливает вино, смешанное с водой.\n- Ставит звездицу, покрывает дискос и потир покровами («воздухом»), кадит Дары.",
    explanation: "Подготовка вещества для Таинства: хлеб и вино станут Телом и Кровью Христовыми. Изъятие частиц — молитвенное поминовение всей Церкви (живых и усопших) по поданным запискам. Смешение вина с водой — вспоминание о крови и воде, истёкших из ребра Спасителя.",
    symbolism: "- Агнец — образ Христа, приносимого в жертву.\n- Две части просфоры (верх и низ) — две природы Христа (Божественная и человеческая).\n- Дискос — Вифлеемская пещера, Голгофа и Гроб Господень.\n- Звездица — Вифлеемская звезда и крест.\n- Покровы — пелены Рождества и погребальные пелены.",
    prostrations: "Три земных поклона священника перед началом проскомидии."
  },
  {
    step: "2",
    stage: "Начало Литургии оглашенных",
    actions: "- Возглас: *«Благословенно Царство Отца и Сына и Святого Духа…»*.\n- **Великая ектения** с прошениями о мире, стране, властях, больных, путешествующих и т. д.; хор отвечает: *«Господи, помилуй»*.\n- Царские врата **открыты**.",
    explanation: "Общая молитва всей Церкви о нуждах мира. Начало общественного богослужения.",
    symbolism: "Открытые врата — знак, что Бог принимает наши прошения. Великая ектения — голос Церкви, ходатайствующей за весь мир.",
    prostrations: "—"
  },
  {
    step: "3",
    stage: "Антифоны (1‑й, 2‑й, 3‑й)",
    actions: "- Поются антифоны (часто псалмы 102, 145 и «Блаженны»).\n- Между ними — малые ектении.\n- В начале врата открыты; перед Малым входом их **закрывают**.",
    explanation: "Постепенное восхождение молящихся от благодарения к осознанию своей греховности и нужды в Спасителе.",
    symbolism: "Закрытие врат перед входом — переход к более сокровенной части службы; граница между «внешним» и «внутренним».",
    prostrations: "—"
  },
  {
    step: "4",
    stage: "Малый вход (вход с Евангелием)",
    actions: "- Врата **открывают**.\n- Диакон несёт Евангелие, священник следует за ним.\n- Возглас диакона: *«Премудрость, прости»*.\n- После входа врата **закрывают**.",
    explanation: "Вход с Евангелием — принесение слова Божия народу. Диакон и священник изображают служителей, приносящих весть о Христе.",
    symbolism: "Открытие врат — явление Господа миру; закрытие — указание на тайну, которая требует благоговейного внимания.",
    prostrations: "—"
  },
  {
    step: "5",
    stage: "Чтение Апостола и Евангелия",
    actions: "- Читают отрывок из **Апостольских посланий** (Деяния или послания апостолов) и **Евангелия** (по церковному календарю).\n- Перед чтением — сугубая ектения (в т. ч. по запискам).\n- Царские врата обычно **закрыты**.",
    explanation: "Назидание верующих через слово Божие: Апостол укрепляет в вере и учит жизни по Евангелию, Евангелие — прямое слово Христа.",
    symbolism: "Слово Божие — основа христианской жизни; сугубая ектения выражает особую заботу Церкви о конкретных нуждах людей.",
    prostrations: "—"
  },
  {
    step: "6",
    stage: "Ектения об оглашенных",
    actions: "- Прошения об оглашенных (готовящихся к Крещению): чтобы Господь просветил их и принял в Церковь.\n- Возглас: *«Оглашеннии, изыдите»*.\n- Врата **закрыты**.",
    explanation: "Разделение собрания: оглашенные (некрещёные) отделяются от верных (крещёных), чтобы далее совершалось Таинство Евхаристии только для членов Церкви.",
    symbolism: "Закрытые врата — граница между теми, кто ещё готовится к Церкви, и теми, кто уже в ней; знак перехода к самому главному.",
    prostrations: "—"
  },
  {
    step: "7",
    stage: "Литургия верных",
    actions: "- **Ектения о верных**.\n- Врата **открывают** перед Херувимской песнью.",
    explanation: "Сбор крещёных верующих перед величайшим Таинством; испрашивание мира, спасения и защиты для всей Церкви.",
    symbolism: "Открытие врат — доступ к Святому Святых; Церковь собирается как единое Тело Христово.",
    prostrations: "—"
  },
  {
    step: "8",
    stage: "Великий вход",
    actions: "- Хор поёт **Херувимскую песнь**.\n- Врата и завеса **открыты**.\n- Торжественный перенос дискоса и потира с жертвенника на престол.\n- После входа врата **закрывают**, завесу **задёргивают**.\n- Сразу следует **просительная ектения**.",
    explanation: "Перенос приготовленных Даров — шествие Христа на вольные страдания. Подготовка к Евхаристическому канону.",
    symbolism: "- Перенос — путь Христа на Голгофу.\n- Закрытие врат и завесы — запечатанный Гроб, приставление стражи.\n- Покров («воздух») — камень у дверей гроба.\n- Каждение — благовония, которыми умастили Тело Христово.\n- Вместе — сошествие во ад и тайна искупления.",
    prostrations: "—"
  },
  {
    step: "9",
    stage: "Евхаристический канон",
    actions: "- Тайные молитвы священника.\n- Призывание Святого Духа.\n- Произнесение установительных слов: *«Приимите, ядите…»*, *«Пийте от нея вси…»*.\n- Происходит преложение хлеба и вина в Тело и Кровь Христовы.\n- Врата **закрыты**, завеса **задёрнута**.",
    explanation: "Сердце Литургии: совершается величайшая Тайна пресуществления. Только Агнец становится Телом Христовым; остальные частицы освящаются силой Таинства.",
    symbolism: "Закрытые врата и завеса подчёркивают, что совершаемое непостижимо даже для ангелов; это момент высшего благоговения.",
    prostrations: "Священнослужители совершают земной поклон после преложения Даров (в разных традициях — в разных местах канона; часто — после слов «Преложив Духом Твоим Святым»)."
  },
  {
    step: "10",
    stage: "Приготовление к Причащению",
    actions: "- Поётся *«Достойно есть…»*, затем *«Отче наш»*.\n- Возглас: *«Святая святым»*.\n- Агнец дробится на нужное число частиц.\n- Частицы раздроблённого Агнца **погружают в потир с Кровью Христовой**.\n- Врата **открывают**.",
    explanation: "Подготовка Святых Даров к раздаче верующим. Погружение частиц Тела в Кровь — чин подачи Причастия на лжице.",
    symbolism: "Открытие врат — знак, что Гроб пуст, Христос воскрес, и спасение доступно каждому.",
    prostrations: "—"
  },
  {
    step: "11",
    stage: "Причащение",
    actions: "- Сначала причащаются священнослужители в алтаре, затем — миряне.\n- Причастники получают **антидор** (остатки агничной просфоры) и **запивку** (теплоту).",
    explanation: "Приобщение верующих Христу: через принятие Святых Даров человек соединяется с Богом. Запивка нужна, чтобы ни одна частица Тела не осталась во рту.",
    symbolism: "Причастие — высшее единство человека с Христом; антидор и теплота — знаки сопричастности Литургии даже для не причащавшихся.",
    prostrations: "Верующие делают земной поклон перед Чашей непосредственно перед тем, как подойти к Причастию."
  },
  {
    step: "12",
    stage: "Завершение поминовения",
    actions: "- После причащения мирян священник ссыпает с дискоса оставшиеся частицы (за Богородицу, святых, живых и усопших) в потир.\n- Молитва: *«Отмый, Господи, грехи поминавшихся зде Кровию Твоею честною, молитвами святых Твоих»*.\n- Врата ещё **открыты**.",
    explanation: "Высший акт поминовения: частицы, вынутые за людей, соприкасаются со Святой Кровью, и Церковь ходатайствует о прощении их грехов.",
    symbolism: "Погружение поминальных частиц в Кровь Христову — ходатайство всей Церкви за живых и усопших; символ победы Христа над смертью.",
    prostrations: "—"
  },
  {
    step: "13",
    stage: "Окончание Литургии",
    actions: "- Благодарственные молитвы, **просительная ектения**, заамвонная молитва, отпуст, целование креста.\n- В конце отпуста врата **закрывают**.\n- Остатки просфор потребляются в алтаре.",
    explanation: "Благодарение Богу за совершённое Таинство и благословение верующих на выход из храма.",
    symbolism: "Закрытие врат — завершение литургического «окна» в вечность; потребление остатков — знак благоговения: ничто святое не должно быть утеряно.",
    prostrations: "—"
  }
];

const formatText = (text: string) => {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('-');
    const content = isBullet ? trimmed.substring(1).trim() : line;
    
    const boldParts = content.split('**');
    const renderedParts = boldParts.flatMap((boldPart, bIdx) => {
      const isBold = bIdx % 2 === 1;
      const italicParts = boldPart.split('*');
      const elements = italicParts.map((italicPart, iIdx) => {
        const isItalic = iIdx % 2 === 1;
        if (isItalic) {
          return (
            <em key={`${bIdx}-${iIdx}`} className="italic text-[var(--color-cinnabar)]/90 font-medium">
              {italicPart}
            </em>
          );
        }
        return italicPart;
      });

      if (isBold) {
        return (
          <strong key={bIdx} className="font-semibold text-[var(--color-cinnabar)]">
            {elements}
          </strong>
        );
      }
      return elements;
    });

    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc pl-1 leading-relaxed text-sm mb-1.5 text-[var(--color-ink)]/90">
          {renderedParts}
        </li>
      );
    }
    return (
      <p key={i} className="leading-relaxed text-sm sm:text-base mb-2.5 text-[var(--color-ink)]/90 whitespace-pre-wrap">
        {renderedParts}
      </p>
    );
  });
};

export default function Liturgy() {
  const [subTab, setSubTab] = useState<'explanation' | 'text'>('explanation');
  const [activeTab, setActiveTab] = useState<'chrysostom' | 'basil'>('chrysostom');
  const [openExplanationIndex, setOpenExplanationIndex] = useState<number | null>(0);
  const [explainView, setExplainView] = useState<'interactive' | 'table'>('interactive');
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <BackToTopButton />
      <div className="pb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="font-izhitsa text-3xl sm:text-5xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
            {subTab === 'explanation' ? 'Объяснение Литургии' : (activeTab === 'chrysostom' ? 'Литургия свт. Иоанна Златоуста' : 'Литургия свт. Василия Великого')}
          </h1>
          <DecorativeDivider className="mb-4" />
          <p className="text-xs text-[var(--color-ink)]/60 italic mb-4">
            (по материалам книги «Всенощное бдение и Литургия. Разъяснение церковного богослужения», azbyka.ru)
          </p>
          <div className="font-izhitsa text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            {subTab === 'explanation' 
              ? 'Библиотека катехизиса: О храме, устройстве алтаря, иконостасе, чинах священства и о Божественной Литургии.'
              : 'Последование Божественной Литургии с параллельным переводом на русский язык.'
            }
          </div>
        </div>

        {/* Main Subsection Switcher */}
        <div className="flex bg-white/50 border border-[var(--color-cinnabar)]/10 rounded-lg p-1.5 max-w-lg mx-auto shadow-sm mb-8 relative z-10 font-izhitsa">
          <button
            onClick={() => setSubTab('explanation')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm sm:text-base rounded-md transition-all ${
              subTab === 'explanation'
                ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/30'
            }`}
          >
            <BookOpen size={16} />
            Объяснение Литургии
          </button>
          <button
            onClick={() => setSubTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm sm:text-base rounded-md transition-all ${
              subTab === 'text'
                ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/30'
            }`}
          >
            <FileText size={16} />
            Последование службы
          </button>
        </div>

        {subTab === 'explanation' ? (
          /* Subsection: Explanation of Liturgy starting with "О храме и Богослужении" */
          <div className="space-y-6 relative z-10">
            <div className="space-y-4">
              {explanationSections.map((section, idx) => {
                const isOpen = openExplanationIndex === idx;
                return (
                  <div 
                    key={idx} 
                    id={`liturgy-explain-sec-${idx}`}
                    className="bg-white/40 border border-[var(--color-cinnabar)]/10 rounded-lg overflow-hidden transition-all hover:bg-white/60"
                  >
                    <button
                      onClick={() => {
                        const next = isOpen ? null : idx;
                        setOpenExplanationIndex(next);
                        if (next !== null) {
                          setTimeout(() => {
                             document.getElementById(`liturgy-explain-sec-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 130);
                        }
                      }}
                      className="w-full p-4 flex items-center justify-between text-left group"
                    >
                      <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)]">
                        {section.title}
                      </h3>
                      <div className="text-[var(--color-cinnabar)]/40 group-hover:text-[var(--color-cinnabar)] transition-colors ml-4 shrink-0">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-[var(--color-cinnabar)]/5 bg-white/20">
                        <div className="text-[var(--color-ink)] leading-relaxed text-sm sm:text-base whitespace-pre-line font-izhitsa drop-cap">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Секция с таблицей и интерактивной хронологией последовательности */}
            <div className="mt-12 pt-6 border-t border-[var(--color-cinnabar)]/10 space-y-6">
              <div className="text-center">
                <h2 className="font-izhitsa text-2xl sm:text-3xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wider">
                  13 ключевых этапов Божественной Литургии
                </h2>
                <DecorativeDivider className="mb-4" />
                <p className="text-sm text-[var(--color-ink)]/70 max-w-2xl mx-auto font-izhitsa leading-relaxed mb-6">
                  Подробное разъяснение последовательности службы, таинственных действий священнослужителей, евхаристического пресуществления частиц и глубокого символизма.
                </p>
              </div>

              {/* Переключатель режимов просмотра */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-[var(--color-parchment)]/60 border border-[var(--color-cinnabar)]/15 p-1 rounded-lg shadow-sm font-izhitsa text-sm">
                  <button
                    onClick={() => setExplainView('interactive')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${
                      explainView === 'interactive'
                        ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                        : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/40'
                    }`}
                  >
                    <List size={16} />
                    Интерактивная Хроника
                  </button>
                  <button
                    onClick={() => setExplainView('table')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${
                      explainView === 'table'
                        ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm font-semibold'
                        : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)] hover:bg-white/40'
                    }`}
                  >
                    <Table size={16} />
                    Табличный вид
                  </button>
                </div>
              </div>

              {explainView === 'interactive' ? (
                /* ИНТЕРАКТИВНЫЙ РЕЖИМ */
                <div className="space-y-6">
                  {/* Шаги-круглешки */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto p-2 bg-white/20 rounded-xl border border-[var(--color-cinnabar)]/5">
                    {liturgyStages.map((stageItem, index) => {
                      const isActive = activeStep === index;
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveStep(index)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-izhitsa text-sm border transition-all ${
                            isActive
                              ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] border-[var(--color-cinnabar)] shadow-md transform scale-110 font-bold'
                              : 'bg-white/40 border-[var(--color-cinnabar)]/15 text-[var(--color-ink)]/80 hover:bg-white/80 hover:border-[var(--color-cinnabar)]/40'
                          }`}
                          title={stageItem.stage}
                        >
                          {stageItem.step}
                        </button>
                      );
                    })}
                  </div>

                  {/* Карточка активного шага */}
                  <div className="bg-white/60 border border-[var(--color-cinnabar)]/15 rounded-xl shadow-lg p-5 sm:p-6 transition-all relative overflow-hidden backdrop-blur-sm">
                    {/* Текстура или фоновое обозначение на заднем плане */}
                    <div className="absolute top-2 right-4 text-8xl font-izhitsa text-[var(--color-cinnabar)]/5 select-none pointer-events-none">
                      {liturgyStages[activeStep].step}
                    </div>

                    <div className="mb-5 border-b border-[var(--color-cinnabar)]/10 pb-4">
                      <span className="text-xs font-semibold text-[var(--color-cinnabar)] font-izhitsa uppercase tracking-widest bg-[var(--color-cinnabar)]/5 py-1 px-3 rounded-full">
                        Этап {liturgyStages[activeStep].step} из 13
                      </span>
                      <h3 className="font-izhitsa text-xl sm:text-2xl text-[var(--color-cinnabar)] mt-2">
                        {liturgyStages[activeStep].stage}
                      </h3>
                    </div>

                    {/* Сетка описания 4 колонок */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* Колонка 1: Действия */}
                      <div className="bg-[var(--color-parchment)]/10 border border-[var(--color-cinnabar)]/10 rounded-lg p-4 space-y-2 hover:bg-[var(--color-parchment)]/20 transition-all">
                        <div className="flex items-center gap-1.5 border-b border-[var(--color-cinnabar)]/10 pb-2 mb-2">
                          <span className="text-base">🚪</span>
                          <h4 className="font-izhitsa text-sm font-semibold text-[var(--color-cinnabar)] uppercase">Действия</h4>
                        </div>
                        <div className="text-[var(--color-ink)] font-izhitsa text-xs sm:text-sm leading-relaxed">
                          {formatText(liturgyStages[activeStep].actions)}
                        </div>
                      </div>

                      {/* Колонка 2: Объяснение */}
                      <div className="bg-amber-50/20 border border-amber-500/15 rounded-lg p-4 space-y-2 hover:bg-amber-50/40 transition-all">
                        <div className="flex items-center gap-1.5 border-b border-amber-500/15 pb-2 mb-2">
                          <span className="text-base text-amber-600">✨</span>
                          <h4 className="font-izhitsa text-sm font-semibold text-amber-700 uppercase">Объяснение</h4>
                        </div>
                        <div className="text-[var(--color-ink)] font-izhitsa text-xs sm:text-sm leading-relaxed">
                          {formatText(liturgyStages[activeStep].explanation)}
                        </div>
                      </div>

                      {/* Колонка 3: Символика */}
                      <div className="bg-emerald-50/10 border border-emerald-500/10 rounded-lg p-4 space-y-2 hover:bg-emerald-50/20 transition-all">
                        <div className="flex items-center gap-1.5 border-b border-emerald-500/10 pb-2 mb-2">
                          <span className="text-base text-emerald-600">🕊️</span>
                          <h4 className="font-izhitsa text-sm font-semibold text-emerald-700 uppercase">Символика</h4>
                        </div>
                        <div className="text-[var(--color-ink)] text-xs sm:text-sm leading-relaxed italic">
                          {formatText(liturgyStages[activeStep].symbolism)}
                        </div>
                      </div>

                      {/* Колонка 4: Земные поклоны */}
                      <div className="bg-rose-50/10 border border-rose-500/10 rounded-lg p-4 space-y-2 hover:bg-rose-50/20 transition-all">
                        <div className="flex items-center gap-1.5 border-b border-rose-500/10 pb-2 mb-2">
                          <span className="text-base text-rose-600">🙇</span>
                          <h4 className="font-izhitsa text-sm font-semibold text-rose-700 uppercase">Земные поклоны</h4>
                        </div>
                        <div className="text-[var(--color-ink)] text-xs sm:text-sm leading-relaxed italic">
                          {formatText(liturgyStages[activeStep].prostrations)}
                        </div>
                      </div>
                    </div>

                    {/* Навигационные кнопки */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--color-cinnabar)]/10">
                      <button
                        onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : 12))}
                        className="flex items-center gap-1 py-2 px-3 text-xs sm:text-sm font-izhitsa text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/5 rounded-md transition-all border border-[var(--color-cinnabar)]/10"
                      >
                        <ChevronLeft size={16} />
                        Назад
                      </button>

                      <div className="text-xs text-[var(--color-ink)]/50 font-mono">
                        {liturgyStages[activeStep].step} / 13
                      </div>

                      <button
                        onClick={() => setActiveStep(prev => (prev < 12 ? prev + 1 : 0))}
                        className="flex items-center gap-1 py-2 px-3 text-xs sm:text-sm font-izhitsa text-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar)]/5 rounded-md transition-all border border-[var(--color-cinnabar)]/10"
                      >
                        Вперед
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ТАБЛИЧНЫЙ РЕЖИМ */
                <div className="overflow-x-auto border border-[var(--color-cinnabar)]/15 rounded-xl shadow-lg bg-white/40 backdrop-blur-sm">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[var(--color-cinnabar)]/5 border-b border-[var(--color-cinnabar)]/15">
                        <th className="py-4 px-3 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[40px] text-center">№</th>
                        <th className="py-4 px-4 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[160px]">Часть литургии</th>
                        <th className="py-4 px-4 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[280px]">Действия внутри этой части</th>
                        <th className="py-4 px-4 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[200px]">Объяснение действий</th>
                        <th className="py-4 px-4 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[200px]">Что символизируют</th>
                        <th className="py-4 px-4 font-izhitsa text-[var(--color-cinnabar)] font-semibold text-xs sm:text-sm uppercase tracking-wider w-[150px]">Земные поклоны</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-cinnabar)]/10">
                      {liturgyStages.map((stageItem, index) => (
                        <tr key={index} className="hover:bg-white/30 transition-colors">
                          <td className="py-3.5 px-3 text-center font-mono text-xs text-[var(--color-cinnabar)] font-semibold bg-[var(--color-parchment)]/10">
                            {stageItem.step}
                          </td>
                          <td className="py-3.5 px-4 font-izhitsa text-xs sm:text-sm font-semibold text-[var(--color-cinnabar)] align-top border-l border-[var(--color-cinnabar)]/5">
                            {stageItem.stage}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[var(--color-ink)] leading-relaxed font-izhitsa align-top border-l border-[var(--color-cinnabar)]/5">
                            {formatText(stageItem.actions)}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[var(--color-ink)] leading-relaxed font-izhitsa align-top border-l border-[var(--color-cinnabar)]/5 bg-amber-50/5">
                            {formatText(stageItem.explanation)}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[var(--color-ink)]/90 leading-relaxed italic align-top border-l border-[var(--color-cinnabar)]/5">
                            {formatText(stageItem.symbolism)}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[var(--color-ink)]/90 leading-relaxed align-top border-l border-[var(--color-cinnabar)]/5 bg-rose-50/5">
                            {formatText(stageItem.prostrations)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Subsection: Liturgical Services with parallel translation */
          <div className="relative z-10 flex flex-col space-y-8">
            <div className="flex bg-white/40 border border-[var(--color-ink)]/10 rounded-lg p-1 shrink-0 w-full max-w-sm mx-auto shadow-sm">
              <button
                onClick={() => setActiveTab('chrysostom')}
                className={`flex-1 px-2 sm:px-4 py-2 font-izhitsa text-center text-sm sm:text-base rounded-md transition-all ${
                  activeTab === 'chrysostom'
                    ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm'
                    : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                Иоанна Златоуста
              </button>
              <button
                onClick={() => setActiveTab('basil')}
                className={`flex-1 px-2 sm:px-4 py-2 font-izhitsa text-center text-sm sm:text-base rounded-md transition-all ${
                  activeTab === 'basil'
                    ? 'bg-[var(--color-cinnabar)] text-[var(--color-parchment)] shadow-sm'
                    : 'text-[var(--color-ink)]/70 hover:text-[var(--color-cinnabar)]'
                }`}
              >
                 Василия Великого
              </button>
            </div>

            <div className="space-y-4">
              {(liturgiesData as any)[activeTab].map((item: any, index: number) => (
                <LiturgySection key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
