import React from 'react';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAssetPath } from '../utils';

export default function Prosphora() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4">
      <div className="bg-[var(--color-parchment)] p-6 sm:p-8 rounded-lg border border-[var(--color-ink)]/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16"></div>
        
        <div className="text-center mb-8 relative">
          <h1 className="font-kurale text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-4">
            О просфорах
          </h1>
          <p className="font-serif text-[var(--color-ink)]/80 max-w-2xl mx-auto">
            Священный хлеб Православной Церкви: значение, виды, правила употребления и благоговейного хранения.
          </p>
          <div className="ornament-divider mt-6">☩</div>
        </div>

        <div className="space-y-10 text-[var(--color-ink)]">
          
          <section className="space-y-4">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
              Просфора — знамение Божьей благодати
            </h2>
            <div className="font-serif leading-relaxed space-y-4">
              <p>
                <strong>Просфора́</strong> (от греч. «приношение») — это особый богослужебный хлеб, используемый в таинстве Евхаристии (Причащения) и для поминовения живых и усопших на Проскомидии. Своим происхождением она уходит в раннехристианские времена, когда верующие сами приносили из дома хлеб и вино для Литургии и последующих совместных трапез любви (агап).
              </p>
              <p>
                Просфора выпекается исключительно из квасного теста (пшеничная мука, вода, соль и закваска/дрожжи) с добавлением святой воды. Она состоит из <strong>двух частей</strong>, выпекаемых раздельно, а затем соединяемых, что символизирует два естества Иисуса Христа — Божественное и человеческое.
              </p>
              <p>
                На верхней части ставится круглая печать с равноконечным крестом и греческой надписью <strong>IC XC NIKA</strong> («Иисус Христос Победитель») или изображением Богородицы и святых. 
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)]">Служебные и поминальные просфоры</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <img src={getAssetPath("/images/Prosfora_collage.webp")} alt="Виды просфор" className="sm:w-1/2 w-full rounded-lg object-cover shadow-sm border border-[var(--color-ink)]/10 bg-white/50 p-1" />
              <img src={getAssetPath("/images/prosfori_proskomidiya1.webp")} alt="Просфоры на проскомидии" className="sm:w-1/2 w-full rounded-lg object-cover shadow-sm border border-[var(--color-ink)]/10 bg-white/50 p-1" />
            </div>
            <div className="font-serif leading-relaxed space-y-4 bg-white/40 p-5 rounded-lg border border-[var(--color-cinnabar)]/10">
              <p>Для совершения Божественной литургии (на Проскомидии) священником используются <strong>пять особых больших служебных просфор</strong>:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-ink)]/5">
                  <img src={getAssetPath("/images/Prosfora_Agnechnaya.webp")} alt="Агничная" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Агничная</h4>
                    <p className="text-sm">Самая большая просфора with крестом. Из ее центра вырезается кубическая часть — Святой Агнец.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-ink)]/5">
                  <img src={getAssetPath("/images/Prosfora_Bogorodichnaya.webp")} alt="Богородичная" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Богородичная</h4>
                    <p className="text-sm">С печатью МАРИЯ или образом Божией Матери. Из нее вынимается частица в честь Пресвятой Богородицы.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-ink)]/5">
                  <img src={getAssetPath("/images/Prosfora_9.webp")} alt="Девятичинная" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Девятичинная</h4>
                    <p className="text-sm">Посвящена всем святым. Из нее вынимается 9 частиц в честь девяти чинов святых.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-ink)]/5">
                  <img src={getAssetPath("/images/Prosfora_Zdravie.webp")} alt="Заздравная" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Заздравная</h4>
                    <p className="text-sm">Из нее вынимаются две частицы за всех участников Литургии и всех живых.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-ink)]/5">
                  <img src={getAssetPath("/images/Prosfora_Upokoenie.webp")} alt="Заупокойная" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Заупокойная</h4>
                    <p className="text-sm">Из нее вынимается частица за всех усопших православных христиан.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-white/60 p-3 rounded-md border border-[var(--color-cinnabar)]/20 shadow-sm">
                  <img src={getAssetPath("/images/Prosfora_malaya.webp")} alt="Малая просфора" className="w-20 h-20 rounded object-cover border border-[var(--color-ink)]/10 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[var(--color-cinnabar)]">Малая (поминальная)</h4>
                    <p className="text-sm">Раздается верующим. Частицы из нее вынимаются при поминовении имен о здравии или упокоении.</p>
                  </div>
                </div>
              </div>

              <p className="pt-4 text-sm italic border-t border-[var(--color-ink)]/10">
                В конце Литургии все вынутые из этих просфор мелкие частицы ссыпаются в Потир со Святой Кровью со словами: <em>«Отмый, Господи, грехи поминавшихся зде Кровию Твоею Честною...»</em>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
              Антидор: «Вместо Дара»
            </h2>
            <div className="font-serif leading-relaxed space-y-4">
              <div className="sm:float-right sm:w-1/3 sm:ml-6 mb-4">
                <img src={getAssetPath("/images/Antidor_min.webp")} alt="Антидор" className="w-full rounded-lg object-cover shadow-sm border border-[var(--color-ink)]/10 bg-white/50 p-1" />
              </div>
              <p>
                <strong>Антидо́р</strong> (греч. ἀντίδωρον — «вместо дара») — это остатки главной Агничной просфоры, из которой был вырезан Агнец для Причастия. Поскольку эта просфора участвовала в важнейшем тайнодействии, она исполнена особой Божией благодати.
              </p>
              <p>
                По древнему уставу антидор раздается в конце Литургии тем верующим, которые готовились, постились, но по какой-то причине не смогли причаститься Святых Тайн, чтобы и они получили духовное утешение и освящение. Принимать антидор могут только крещеные люди и строго натощак. В храме его едят благоговейно, сложив ладони крестообразно, следя за тем, чтобы ни одна крошка не упала на пол.
              </p>
            </div>
            <div className="clear-both"></div>
          </section>

          <section className="space-y-4">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
              Артос: Хлеб Воскресения
            </h2>
            <div className="font-serif leading-relaxed space-y-4">
              <div className="sm:float-right sm:w-1/3 sm:ml-6 mb-4">
                <img src={getAssetPath("/images/Artos.webp")} alt="Артос" className="w-full rounded-lg object-cover shadow-sm border border-[var(--color-ink)]/10 bg-white/50 p-1" />
              </div>
              <p>
                <strong>А́ртос</strong> (греч. «квасной хлеб») — особый всецелый хлеб, освящаемый в день Святой Пасхи. В русской традиции это большая высокая просфора цилиндрической формы с изображением Креста или Воскресения Христова. Артос символизирует Самого Христа — Хлеб Вечной Жизни.
              </p>
              <p>
                Всю Светлую (Пасхальную) седмицу артос стоит в храме на аналое перед Царскими вратами. Каждый день с ним совершаются крестные ходы. В Светлую субботу читается специальная молитва на раздробление артоса, после чего его разрезают на части и раздают верующим.
              </p>
              <p>
                Артос хранится в домах верующих весь год как великая святыня. Его вкушают (обычно смешав с богоявленской святой водой) в случаях тяжелых болезней, духовной скорби или сильных искушений со словами радости: <strong>«Христос Воскресе! — Воистину Воскресе!»</strong>.
              </p>
            </div>
            <div className="clear-both"></div>
          </section>

          <section className="space-y-6 pt-4">
            <h2 className="font-kurale text-2xl text-[var(--color-cinnabar)] text-center">
              Сравнение просфор
            </h2>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-ink)]/10 font-serif shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#e8dfcf] text-[var(--color-ink)]">
                  <tr>
                    <th className="p-4 font-semibold border-b border-[var(--color-ink)]/10 w-1/4">Просфора</th>
                    <th className="p-4 font-semibold border-b border-[var(--color-ink)]/10">Происхождение и суть</th>
                    <th className="p-4 font-semibold border-b border-[var(--color-ink)]/10">Как и когда употреблять</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-ink)]/5 bg-white/40">
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="p-4 font-bold text-[var(--color-cinnabar)] align-top">
                      Служебные просфоры
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Пять больших просфор (Агничная, Богородичная, Девятичинная, Заздравная, Заупокойная), участвующих в Литургии.
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Мирянам не раздаются. Агничная пресущественена в Тело Христово. Из остальных вынимаются частицы за святых, живых и усопших.
                    </td>
                  </tr>
                  <tr className="bg-[var(--color-parchment)]/30 hover:bg-white/60 transition-colors">
                    <td className="p-4 font-bold text-[var(--color-cinnabar)] align-top">
                      Малая (поминальная) просфора
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Хлеб, из которого священник вынул частицу в алтаре, когда вы подавали записку «О здравии» или «О упокоении».
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Раздается после окончания службы за свечным ящиком. Как правило, её уносят домой, нарезают и кушают утром <strong>натощак</strong> со святой водой и специальной молитвой на принятие святыни.
                    </td>
                  </tr>
                  <tr className="bg-[var(--color-parchment)]/30 hover:bg-white/60 transition-colors">
                    <td className="p-4 font-bold text-[var(--color-cinnabar)] align-top">
                      Антидор
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Остатки Главной (Агничной) просфоры. Раздается как "замена дара" тем, кто соблюдал Литургический пост, но не причащался.
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Раздается в храме в конце службы после целования креста. Принимают в храме, на сложенные крестом ладони (правая поверх левой), целуя руку дающего. Потребляют сразу на ходу <strong>натощак</strong>, следя, чтобы не уронить крошки.
                    </td>
                  </tr>
                  <tr className="hover:bg-white/60 transition-colors">
                    <td className="p-4 font-bold text-[var(--color-cinnabar)] align-top">
                      Артос
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Большая общецерковная Пасхальная просфора. Символизирует Самого Воскресшего Христа.
                    </td>
                    <td className="p-4 align-top text-sm leading-relaxed">
                      Раздается один раз в году — в Светлую Субботу (субботу после Пасхи). Хранится весь год, употребляется понемногу <strong>натощак</strong> (можно размочить в святой воде) при болезнях и скорбях со словами <em>«Христос Воскресе!»</em>.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <section className="bg-white/60 p-6 rounded-lg border border-green-600/20 space-y-4">
              <h2 className="font-kurale text-xl text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Как правильно хранить
              </h2>
              <ul className="list-inside space-y-3 font-serif text-[var(--color-ink)]/90 text-sm">
                <li className="flex gap-2 items-start">
                  <span className="text-green-600/70 shrink-0 mt-0.5">•</span> 
                  <span>Хранить святой хлеб нужно отдельно от обычных продуктов, лучше всего — в красном (святом) углу возле икон, в холщовом мешочке или чистой коробочке.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-green-600/70 shrink-0 mt-0.5">•</span> 
                  <span>Так как просфора печется из обычного квасного теста без консервантов, при комнатной температуре она может испортиться или заплесневеть.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-green-600/70 shrink-0 mt-0.5">•</span> 
                  <span>Чтобы сохранить святыню надолго, её следует сразу <strong>нарезать на мелкие кусочки и высушить</strong> в сухарики. Резать нужно на чистом листе белой бумаги, чтобы не обронить ни одной святой крошки. Сухарики хранят в сухом месте в полотняном мешочке или бумажной коробке (не в целлофане, чтобы не задохнулись).</span>
                </li>
              </ul>
            </section>

            <section className="bg-[var(--color-cinnabar)]/5 p-6 rounded-lg border border-[var(--color-cinnabar)]/20 space-y-4">
              <h2 className="font-kurale text-xl text-[var(--color-cinnabar)] flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Если просфора испортилась
              </h2>
              <div className="font-serif leading-relaxed text-[var(--color-ink)]/90 text-sm space-y-4">
                <p>
                  <strong>Категорически не допускается</strong> выбрасывать испорченную, заплесневевшую просфору в мусорное ведро, канализацию, или скармливать ее домашним/уличным животным или птицам! Это является грехом небрежения к святыне.
                </p>
                <p>Если хлеб все же испортился, его утилизируют непопираемым способом:</p>
                <ul className="list-disc list-inside pl-1 space-y-2">
                  <li><strong>Отнести в храм.</strong> В большинстве храмов есть специальные жаровни или печи для сжигания святынь.</li>
                  <li><strong>Сжечь самостоятельно.</strong> Пепел от сожжения нельзя выбрасывать в ведро. Его нужно высыпать в проточную реку или закопать в чистом месте.</li>
                  <li><strong>Бросить в реку.</strong> Обязательно в текущую (проточную) воду, привязав к святыне или мешочку камешек, чтобы хлеб опустился на дно и не был выброшен на грязный берег.</li>
                  <li><strong>Закопать в непопираемом месте.</strong> Там, где не ходят люди и животные (например, глубоко под деревом в саду).</li>
                </ul>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
