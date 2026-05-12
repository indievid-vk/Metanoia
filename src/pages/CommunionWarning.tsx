import React from 'react';
import DownloadButton from '../components/DownloadButton';
import { getAssetPath } from '../utils';
import { BackToTopButton } from '../components/BackToTopButton';
import { DecorativeDivider } from '../components/DecorativeDivider';

export default function CommunionWarning() {
  return (
    <div className="space-y-8 pb-12 px-2 max-w-2xl mx-auto">
      <BackToTopButton />
      <div className="text-center">
        <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] leading-tight">
          Предостережение причащающемуся
        </h2>
        <DecorativeDivider className="mt-4" />
        <p className="text-sm italic text-[var(--color-ink)]/70 mt-2">
          (по труду святителя Игнатия Брянчанинова "Слово в Великий четверток. О Святых Христовых Тайнах")
        </p>
      </div>

      <div className="pb-8">
        <h3 className="font-izhitsa text-lg text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/20 pb-2">
          Апостол Павел. Первое послание к Коринфянам
        </h3>
        <div className="space-y-3 italic text-[var(--color-ink)] leading-relaxed">
          <p>
            Посему, кто будет есть хлеб сей или пить чашу Господню недостойно, виновен будет против Тела и Крови Господней.
          </p>
          <p>
            Да испытывает же себя человек, и таким образом пусть ест от хлеба сего и пьет из чаши сей.
          </p>
          <p>
            Ибо, кто ест и пьет недостойно, тот ест и пьет осуждение себе, не рассуждая о Теле Господнем.
          </p>
          <p>
            Оттого многие из вас немощны и больны и немало умирает.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-[var(--color-ink)] leading-relaxed text-justify">
        <p>
          Иное значение имеет недостойное причащение Святых Тайн при произвольно и намеренно греховной жизни, при впадении в смертные грехи, при неверии и при зловерии. Причащающиеся в таком состоянии совершают преступление, навлекающее казни уже не исправительные, казни решительные, навлекающее вечную муку. 
        </p>
        <p>
          Преступление это равно преступлению, которое совершили убийцы Богочеловека, осыпавшие Его поруганиями, ударявшие по ланитам, покрывавшие заплеваниями Его лице, истерзавшие тело Его жестоким биением, гвоздями, распятием. «Иже аще яст, – сказал великий Павел, – хлеб сей, или пиет чашу Господню недостойне, повинен будет телу и крови Господни» (1Кор. 11:27).
        </p>
      </div>

      <div className="pb-8">
        <h3 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">
          Препятствия к принятию Святых Христовых Тайн:
        </h3>
        <ul className="space-y-3 list-decimal list-inside text-[var(--color-ink)] font-medium">
          <li>Не крещеный</li>
          <li>Неверие</li>
          <li>Зловерие (следование ересям)</li>
          <li>Впадение в смертные грехи (даже один нераскаянный и не прекращенный смертный грех делает причащение недостойным)</li>
          <li>Произвольно и намеренно греховная жизнь</li>
        </ul>
      </div>

      <div className="flex justify-center pt-4">
        <DownloadButton 
          title="Слово в Великий четверток"
          subtitle="Святитель Игнатий Брянчанинов"
          downloadUrl={getAssetPath("/books/Slovo_v_Velikiy_4etvertok.epub")}
          fileName="Slovo_v_Velikiy_4etvertok.epub"
          className="max-w-md"
        />
      </div>
    </div>
  );
}
