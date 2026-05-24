import React from 'react';
import { 
  Heart, BookOpen, Sun, Moon, ShieldAlert, Coffee, 
  Briefcase, Activity, CheckCircle2, Bookmark, Sparkles, EyeOff, FileText, Clock
} from 'lucide-react';

export default function AsceticsContent() {
  return (
    <div className="space-y-6 sm:space-y-8 font-izhitsa text-[var(--color-ink)] text-justify leading-relaxed">
      
      {/* Intro section: Repentance */}
      <div className="bg-white/45 p-5 rounded-2xl border border-[var(--color-cinnabar)]/15 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[var(--color-cinnabar)]">
          <Sparkles size={20} className="shrink-0" />
          <h4 className="text-lg font-bold uppercase tracking-wide">Заповедь о покаянии</h4>
        </div>
        <p className="text-sm sm:text-base">
          Первая заповедь, данная Господом нашим Иисусом Христом в Евангелии — заповедь о покаянии: 
          <span className="italic block my-2 text-[var(--color-cinnabar)] bg-[var(--color-parchment)] p-3 border-l-4 border-[var(--color-cinnabar)] rounded-r-lg font-sans text-xs sm:text-sm">
            «С того времени Иисус начал проповедывать и говорить: «Покайтесь, ибо приблизилось Царство Небесное»» (Мф. 4:17).
          </span>
          Эта заповедь объемлет, заключает и совмещает в себе все прочие заповеди, пишет Святитель Игнатий Брянчанинов.
        </p>
      </div>

      {/* First signs of repentance */}
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-1 flex items-center gap-2">
          <Heart size={18} />
          <span>Первые признаки покаяния</span>
        </h4>
        <dl className="space-y-3 font-sans text-sm">
          <div className="flex gap-2 items-start bg-white/30 p-3 rounded-xl border border-stone-200/40">
            <span className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] font-bold px-2 py-0.5 rounded-lg text-xs font-mono shrink-0">1</span>
            <div>
              <strong className="text-[var(--color-cinnabar)] block font-izhitsa text-sm">Страх Божий</strong>
              <span className="text-stone-700">Это искреннее переживание о своей будущей вечной участи.</span>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-white/30 p-3 rounded-xl border border-stone-200/40">
            <span className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] font-bold px-2 py-0.5 rounded-lg text-xs font-mono shrink-0">2</span>
            <div>
              <strong className="text-[var(--color-cinnabar)] block font-izhitsa text-sm">Сокрушение духа</strong>
              <span className="text-stone-700">Это постоянная борьба с мыслями и ощущениями, которыми обнаруживает себя сокровенная в сердце греховная страсть, обуздание телесных чувств и чрева в смиренной молитве, в частой исповеди.</span>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-white/30 p-3 rounded-xl border border-stone-200/40">
            <span className="bg-[var(--color-cinnabar)]/10 text-[var(--color-cinnabar)] font-bold px-2 py-0.5 rounded-lg text-xs font-mono shrink-0">3</span>
            <div>
              <strong className="text-[var(--color-cinnabar)] block font-izhitsa text-sm">Блаженный плач</strong>
              <span className="text-stone-700">Это благостливая печаль верной души о своих грехах или искреннее сожаление о них.</span>
            </div>
          </div>
        </dl>
      </div>

      {/* Poverty of spirit */}
      <div className="bg-amber-50/15 p-5 rounded-2xl border border-amber-350/20 text-sm">
        <p className="mb-2">
          Если Христианин будет постоянно упражняться в страхе Божьем, сокрушении духа и искреннем сожалению о своих грехах, то со временем при содействии благодати Божией зародится в душе новое состояние, называемое <strong className="text-[var(--color-cinnabar)]">нищетой духа</strong>.
        </p>
        <p className="italic text-stone-600 border-l-2 border-amber-400 pl-3">
          «Нищета духа — блаженство первое в евангельском порядке, первая в порядке духовного преуспевания, первое состояние духовное, первая ступень в лестнице Блаженства».
        </p>
      </div>

      {/* Ascetics of the day */}
      <div className="space-y-4">
        <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] border-b-2 border-[var(--color-cinnabar)]/30 pb-1.5 flex items-center gap-2">
          <ShieldAlert size={20} className="text-[var(--color-cinnabar)] shrink-0 animate-pulse" />
          <span>Аскетическая практика на день</span>
        </h3>
        
        <div className="bg-white/40 p-4 rounded-xl border border-stone-200/50 space-y-3">
          <h4 className="font-bold text-[var(--color-cinnabar)] flex items-center gap-1 text-sm sm:text-base">
            <Activity size={16} />
            <span>В течение дня — постоянная борьба со страстями</span>
          </h4>
          <ul className="space-y-2.5 font-sans text-xs sm:text-sm pl-1">
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-cinnabar)] shrink-0 mt-1">●</span>
              <span><strong>Трезвение и наблюдение за собой:</strong> Бдительно следим за движениями своего ума, сердца и чувств.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-cinnabar)] shrink-0 mt-1">●</span>
              <span><strong>Хранение чувств:</strong> Стараемся избегать искушений (хранить зрение и слух от воздействия источников услаждений и праздности).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-cinnabar)] shrink-0 mt-1">●</span>
              <span><strong>Отклонение помыслов:</strong> При появлении греховных помыслов стараемся отклонять их с помощью молитвы свт. Игнатия Брянчанинова: 
                <span className="block italic text-[var(--color-cinnabar)] mt-1.5 bg-stone-50 border-l border-[var(--color-cinnabar)]/30 p-2 text-xs leading-relaxed font-serif rounded">
                  «Враже, предложение твое на главу твою. Матерь Божия, помоги мне...» 
                </span>
                и многократным чтением: 
                <span className="italic block text-[var(--color-cinnabar)] mt-1 font-serif text-xs">
                  «Богородица, Дево, радуйся...»
                </span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-cinnabar)] shrink-0 mt-1">●</span>
              <span><strong>Самоукорение и покаяние:</strong> Если не успеваем отклонить и согрешаем, то, осознав согрешение, немедленно просим у Бога прощения, сокрушаемся сердцем, совершаем самоукорение, и фиксируем грех в <em>дневнике кающегося</em> для дальнейшего исповедания его на Таинстве Исповеди.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Daily Routine Example */}
      <div className="space-y-4">
        <h3 className="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] border-b-2 border-[var(--color-cinnabar)]/30 pb-1.5 flex items-center gap-2">
          <Clock size={20} className="shrink-0" />
          <span>Пример практики дня</span>
        </h3>

        <div className="space-y-4 font-sans text-sm">
          
          {/* 1. Утро */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Sun size={18} className="text-yellow-600 animate-spin-slow" />
              <span>1. Утро</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Иисусова молитва с поклонами</li>
              <li>Утреннее правило</li>
              <li>Памятование о Боге, о смерти, самоукорение</li>
              <li>Благодарение Бога за прошедшую ночь</li>
              <li>Прошения у Бога благословения на новый день</li>
              <li>Чтение Евангельских заповедей</li>
            </ul>
          </div>

          {/* 2. Завтрак */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Coffee size={18} className="text-amber-700" />
              <span>2. Завтрак</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Молитва перед едой</li>
              <li>Иисусова молитва</li>
            </ul>
          </div>

          {/* 3. Выход на работу */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>3. Выход на работу</span>
            </h5>
            <p className="text-xs sm:text-sm pl-2 text-stone-700">
              Молитва перед выходом из дома (по свт. Игнатию Брянчанинову):
              <span className="block bg-stone-50 border-l-2 border-[var(--color-cinnabar)] p-2 mt-1 italic text-xs font-serif text-[var(--color-cinnabar)]">
                «Отрицаюсь тебе, сатана, гордыни твоей и служению тебе, и сочетаюсь Тебе, Христе, во имя Отца и Сына и Святаго Духа. Аминь»
              </span>
            </p>
          </div>

          {/* 4. Путь на работу */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Activity size={18} className="text-rose-600" />
              <span>4. Путь на работу</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Пока идем к транспорту — поем или читаем молитвы, памятование о смерти, самоукорение</li>
              <li>Пока едем в транспорте — слушаем или читаем Евангелие, Апостолов, Псалмы с толкованиями святых отцов</li>
              <li>Пока идем от транспорта на работу — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
              <li>Борьба со страстями</li>
            </ul>
          </div>

          {/* 7. Работа до обеда */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              <span>7. Работа до обеда</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Иисусова молитва</li>
              <li>Борьба со страстями</li>
              <li>В свободные минуты — памятование о Боге, смерти, самоукорение</li>
            </ul>
          </div>

          {/* 8. Обед */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Coffee size={18} className="text-amber-700" />
              <span>8. Обед</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Молитва перед едой</li>
              <li>Иисусова молитва</li>
            </ul>
          </div>

          {/* 9. Работа после обеда */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              <span>9. Работа после обеда</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Иисусова молитва</li>
              <li>Борьба со страстями</li>
              <li>В свободные минуты — памятование о Боге, смерти, самоукорение</li>
            </ul>
          </div>

          {/* 10. Путь с работы домой */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Activity size={18} className="text-rose-600" />
              <span>10. Путь с работы домой</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Пока идем к транспорту — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
              <li>Пока едем в транспорте — слушаем или читаем Евангелие, Апостолов, Псалмы с толкованиями святых отцов</li>
              <li>Пока идем от транспорта домой — поем или читаем молитвы, памятование о Боге, о смерти, самоукорение</li>
              <li>Борьба со страстями</li>
            </ul>
          </div>

          {/* 11. Дом вечер */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Moon size={18} className="text-indigo-900" />
              <span>11. Дом вечер</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Иисусова молитва</li>
              <li>Памятование о Боге, о смерти, самоукорение</li>
              <li>Борьба со страстями</li>
            </ul>
          </div>

          {/* 12. Ужин */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Coffee size={18} className="text-amber-700" />
              <span>12. Ужин</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Молитва перед едой</li>
              <li>Иисусова молитва</li>
            </ul>
          </div>

          {/* 13. Вечернее Богослужение */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Moon size={18} className="text-indigo-950" />
              <span>13. Вечернее Богослужение</span>
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 text-xs sm:text-sm">
              <li>Иисусова молитва с поклонами</li>
              <li>Вечернее правило</li>
              <li>Памятование о Боге, о смерти, самоукорение</li>
              <li>Благодарение Бога за прошедший день</li>
              <li>Прошения у Бога благословения на ночь</li>
              <li>Чтение Евангельских заповедей</li>
            </ul>
          </div>

          {/* 14. Сон */}
          <div className="bg-amber-50/20 p-4 rounded-xl border border-stone-200/50 space-y-2">
            <h5 className="font-izhitsa text-base text-[var(--color-cinnabar)] flex items-center gap-2">
              <Moon size={18} className="text-stone-500 animate-pulse" />
              <span>14. Сон</span>
            </h5>
            <p className="text-xs sm:text-sm pl-2 text-stone-600 italic">
              «В руце Твои, Господи, предаю дух мой...» Со смирением отходим ко сну.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
