import React from 'react';
import { 
  Heart, Sun, Moon, ShieldAlert, Coffee, 
  Briefcase, Activity, CheckCircle2, Sparkles, Clock
} from 'lucide-react';

export default function AsceticsContent() {
  return (
    <div className="space-y-10 font-sans text-[var(--color-ink)] leading-relaxed text-left">
      
      {/* SECTION 1: Commandments / Repentance */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
          <Sparkles className="w-6 h-6 shrink-0" />
          <h2 className="font-izhitsa text-xl sm:text-2xl uppercase tracking-wide">Заповедь о покаянии</h2>
        </div>
        
        <p className="text-base sm:text-lg text-stone-800">
          Первая заповедь, данная Господом нашим Иисусом Христом в Евангелии — заповедь о покаянии:
        </p>
        
        <div className="my-4 bg-amber-50/40 p-5 border-l-4 border-[var(--color-cinnabar)] rounded-r-xl shadow-xs">
          <p className="italic text-lg sm:text-xl text-[var(--color-cinnabar)] font-serif leading-stable">
            «С того времени Иисус начал проповедывать и говорить: «Покайтесь, ибо приблизилось Царство Небесное»» 
            <span className="block text-right text-xs sm:text-sm font-sans mt-2 opacity-80 text-stone-700">（Мф. 4:17）</span>
          </p>
        </div>
        
        <p className="text-base sm:text-lg text-stone-800">
          Эта заповедь объемлет, заключает и совмещает в себе все прочие заповеди, пишет Святитель Игнатий Брянчанинов.
        </p>
      </div>

      {/* SECTION 2: First signs of repentance */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
          <Heart className="w-6 h-6 shrink-0" />
          <h2 className="font-izhitsa text-xl sm:text-2xl uppercase tracking-wide">Первые признаки покаяния</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] flex items-center gap-2">
              <span className="text-amber-500">✙</span> 1. Страх Божий
            </h3>
            <p className="text-base sm:text-lg text-stone-800 pl-6">
              Это чувство священного страха, чувство глубочайшего благоговения к Богу, искреннее переживание о своей будущей вечной участи. Шествие ко Христу начинается и совершается под водительством страха Божия.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] flex items-center gap-2">
              <span className="text-amber-500">✙</span> 2. Сокрушение сердца
            </h3>
            <p className="text-base sm:text-lg text-stone-800 pl-6">
              Это духовное состояние, рождающееся от осознания того, что всю жизнь прожил в грехах и страстях, во вражде с Богом. Сокрушение сердца — результат действия страха Божия.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-izhitsa text-base sm:text-lg text-[var(--color-cinnabar)] flex items-center gap-2">
              <span className="text-amber-500">✙</span> 3. Плач блаженный
            </h3>
            <p className="text-base sm:text-lg text-stone-800 pl-6">
              Внутреннее духовное состояние сокрушения о грехах, соединённое с надеждой на милосердие Божие. Выражается в искренней скорби о своих грехах и стремлении к исправлению.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Poverty of spirit */}
      <div className="bg-amber-50/20 p-6 rounded-2xl border border-amber-200/40 space-y-3">
        <p className="text-base sm:text-lg text-stone-800">
          Если Христианин будет постоянно упражняться в страхе Божьем, сокрушении сердца и искреннем сожалению о своих грехах, то со временем при содействии благодати Божией зародится в душе новое состояние, называемое <strong className="text-[var(--color-cinnabar)]">нищетой духа</strong>.
        </p>
        <div className="border-l-2 border-amber-500 pl-4 py-1">
          <p className="italic text-base sm:text-lg text-stone-700 leading-relaxed">
            «Нищета духа — блаженство первое в евангельском порядке, первая в порядке духовного преуспевания, первое состояние духовное, первая ступень в лестнице Блаженства».
          </p>
        </div>
      </div>

      {/* SECTION 4: Ascetics of the day */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <h2 className="font-izhitsa text-xl sm:text-2xl uppercase tracking-wide">Аскетическая практика на день</h2>
        </div>

        <div className="space-y-4">
          <p className="text-base sm:text-lg font-bold text-[var(--color-cinnabar)] flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span>В течение дня — постоянная борьба со страстями</span>
          </p>

          <div className="space-y-4 text-base sm:text-lg text-stone-800 pl-2">
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl leading-none mt-0.5">✦</span>
              <p>
                <strong>Трезвение и наблюдение за собой:</strong> Бдительно следим за движениями своего ума, сердца и чувств.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl leading-none mt-0.5">✦</span>
              <p>
                <strong>Хранение чувств:</strong> Стараемся избегать искушений (хранить зрение и слух от воздействия источников услаждений и праздности).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl leading-none mt-0.5">✦</span>
              <div className="space-y-2">
                <p>
                  <strong>Отклонение помыслов:</strong> При появлении греховных помыслов стараемся отклонять их с помощью молитвы свт. Игнатия Брянчанинова:
                </p>
                <p className="italic text-[var(--color-cinnabar)] bg-[#fdfbf7] border border-amber-200/40 p-3 rounded-lg text-base font-serif pl-4">
                  «Враже, предложение твое на главу твою. Матерь Божия, помоги мне...»
                </p>
                <p className="text-stone-700">и многократным чтением:</p>
                <p className="italic text-[var(--color-cinnabar)] text-base font-serif pl-4">
                  «Богородица, Дево, радуйся...»
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl leading-none mt-0.5">✦</span>
              <p>
                <strong>Самоукорение и покаяние:</strong> Если не успеваем отклонить и согрешаем, то, осознав согрешение, немедленно просим у Бога прощения, сокрушаемся сердцем, совершаем самоукорение, и фиксируем грех в <em>дневнике кающегося</em> для дальнейшего исповедания его на Таинстве Исповеди.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl leading-none mt-0.5">✦</span>
              <p>
                <strong>Памятование о смерти, об аде и рае, о мытарствах, о частном и страшном суде.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Daily Routine - Optimized, Flat structure without nested boxes */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
          <Clock className="w-6 h-6 shrink-0" />
          <h2 className="font-izhitsa text-xl sm:text-2xl uppercase tracking-wide">Пример практики дня</h2>
        </div>

        {/* Dynamic flat chronological blocks instead of 14 separate boxed cards */}
        <div className="space-y-12">
          
          {/* Chronological State 1: MORNING PATH */}
          <div className="relative pl-6 border-l-2 border-amber-200 space-y-6">
            <div className="absolute -left-[9px] top-0 bg-amber-100 rounded-full p-1 border border-amber-300 text-yellow-700">
              <Sun className="w-4 h-4" />
            </div>
            
            <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] uppercase tracking-wider pl-2">
              Утренний путь (Молитва и начало дня)
            </h3>

            <div className="space-y-4 pl-2 text-base sm:text-lg text-stone-800">
              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Утро:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Иисусова молитва с поклонами</li>
                  <li>Утреннее правило</li>
                  <li>Памятование о Боге, о смерти, самоукорение</li>
                  <li>Благодарение Бога за прошедшую ночь</li>
                  <li>Прошения у Бога благословения на новый день</li>
                  <li>Чтение Евангельских заповедей</li>
                </ul>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Завтрак:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Молитва перед едой</li>
                  <li>Иисусова молитва</li>
                </ul>
              </div>

              <div className="space-y-2">
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Выход на работу:</strong>
                <p className="text-stone-700 pl-2">
                  Молитва перед выходом из дома (по свт. Игнатию Брянчанинову):
                </p>
                <p className="italic text-[var(--color-cinnabar)] bg-[#fdfbf7] border-l-3 border-[var(--color-cinnabar)] p-3 pl-4 rounded-r-lg font-serif">
                  «Отрицаюсь тебе, сатана, гордыни твоей и служению тебе, и сочетаюсь Тебе, Христе, во имя Отца и Сына и Святаго Духа. Аминь»
                </p>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Путь на работу:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Пока идем к транспорту — поем или читаем молитвы, памятование о смерти, самоукорение</li>
                  <li>Пока едем в транспорте — слушаем или читаем Евангелие, Апостолов, Псалмы с толкованиями святых отцов</li>
                  <li>Пока идем от транспорта на работу — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
                  <li>Борьба со страстями</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chronological State 2: DAILY WORK */}
          <div className="relative pl-6 border-l-2 border-amber-200 space-y-6">
            <div className="absolute -left-[9px] top-0 bg-amber-100 rounded-full p-1 border border-amber-300 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>

            <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] uppercase tracking-wider pl-2">
              Дневные труды и трезвение
            </h3>

            <div className="space-y-4 pl-2 text-base sm:text-lg text-stone-800">
              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Труды на работе (До и после обеда):</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Иисусова молитва и постоянная борьба со страстями</li>
                  <li>В свободные минуты — памятование о Боге, смерти, самоукорение</li>
                </ul>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Обед:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Молитва перед едой</li>
                  <li>Иисусова молитва</li>
                </ul>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Путь с работы домой:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Пока идем к транспорту — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
                  <li>Пока едем в транспорте — слушаем или читаем Евангелие, Апостолов, Псалмы с толкованиями святых отцов</li>
                  <li>Пока идем от транспорта домой — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
                  <li>Борьба со страстями</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chronological State 3: EVENING & REST */}
          <div className="relative pl-6 border-l-2 border-amber-200 space-y-6">
            <div className="absolute -left-[9px] top-0 bg-amber-100 rounded-full p-1 border border-amber-300 text-slate-800">
              <Moon className="w-4 h-4" />
            </div>

            <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] uppercase tracking-wider pl-2">
              Вечернее правило и праведный покой
            </h3>

            <div className="space-y-4 pl-2 text-base sm:text-lg text-stone-800">
              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Вечер дома:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Иисусова молитва</li>
                  <li>Памятование о Боге, о смерти, самоукорение</li>
                  <li>Борьба со страстями</li>
                </ul>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Ужин:</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Молитва перед едой</li>
                  <li>Иисусова молитва</li>
                </ul>
              </div>

              <div>
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Вечернее Богослужение (Дома):</strong>
                <ul className="list-disc pl-6 space-y-1 text-stone-700 mt-1">
                  <li>Иисусова молитва с поклонами</li>
                  <li>Вечернее правило</li>
                  <li>Памятование о Боге, о смерти, самоукорение</li>
                  <li>Благодарение Бога за прошедший день</li>
                  <li>Прошения у Бога благословения на ночь</li>
                  <li>Чтение Евангельских заповедей</li>
                </ul>
              </div>

              <div className="space-y-2">
                <strong className="block text-[var(--color-cinnabar)] font-izhitsa text-base">✦ Сон:</strong>
                <p className="pl-2 text-stone-700">Со смирением перед Богом отходим ко сну молитвенным воздохом:</p>
                <p className="italic text-[var(--color-cinnabar)] bg-[#fdfbf7] border-l-3 border-[var(--color-cinnabar)] p-3 pl-4 rounded-r-lg font-serif">
                  «В руце Твои, Господи, предаю дух мой...»
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
