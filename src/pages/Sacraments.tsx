import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize2, X } from 'lucide-react';
import { getAssetPath } from '../utils';
import { DecorativeDivider } from '../components/DecorativeDivider';

export default function Sacraments() {
  const navigate = useNavigate();
  const [zoomedImage, setZoomedImage] = useState<{ src: string, alt: string } | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 px-4 select-text">
      {/* Back button */}
      <div className="flex justify-start relative z-10">
        <button
          onClick={() => navigate('/temple')}
          className="flex items-center gap-2 text-sm text-[var(--color-cinnabar)] hover:underline font-izhitsa transition-all"
        >
          <ArrowLeft size={16} /> Назад в раздел В Храм
        </button>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-cinnabar)]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

      {/* Main Title */}
      <div className="text-center mb-6 relative z-10">
        <h1 className="font-izhitsa text-3xl sm:text-4xl text-[var(--color-cinnabar)] mb-2 uppercase tracking-wide">
          Таинства Церкви
        </h1>
        <DecorativeDivider className="mb-4" />
      </div>

      {/* Main Image with Click-to-Zoom */}
      <div 
        className="max-w-md mx-auto relative cursor-pointer group rounded-lg overflow-hidden border border-[var(--color-cinnabar)]/20 shadow-md bg-white/50 p-1 mb-6"
        onClick={() => setZoomedImage({ src: getAssetPath('/images/Tainstva.webp'), alt: 'Таинства Церкви' })}
      >
        <div className="absolute top-2 right-2 text-white bg-black/40 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Maximize2 size={18} />
        </div>
        <img 
          src={getAssetPath('/images/Tainstva.webp')} 
          alt="Таинства Церкви" 
          className="w-full h-auto rounded object-contain max-h-[320px] transition-transform duration-300 group-hover:scale-[1.01]" 
        />
      </div>

      {/* Main Content Area: Simplified styling without multi-layered container boxes, nested cards or table of contents */}
      <div className="space-y-6 text-[var(--color-ink)]/90 leading-relaxed text-justify text-base sm:text-lg">
        <p className="font-sans">
          <strong className="font-izhitsa text-lg text-[var(--color-cinnabar)]">Та́инства</strong> – 
          (от <em>греч.</em> μυστήрион – тайна, таинство) – священнодействия Церкви, в результате которых верующим, по мере их веры, преподаются определенные Дары Святого Духа, осуществляется единение с Богом, причём, настолько полно, насколько это возможно в условиях земной жизни, с учётом характера Таинств и личной веры участников.
        </p>

        <p className="font-sans">
          Под таинствами в православном богословии понимаются священнодействия, в которых происходит встреча Бога с человеком и наиболее полно, насколько возможно в земной жизни, осуществляется единение с Ним. В таинствах благодать Бога нисходит на нас и освящает все наше естество – и душу, и плоть – приобщая его к Божественному естеству, оживотворяя, обоготворяя и воссозидая в жизнь вечную. В таинствах мы получаем опыт неба и предвкушаем Царство Божье, к которому всецело приобщиться, то есть войти в него и жить в нем, можно лишь после смерти.
        </p>

        <div className="my-8 py-4 px-5 bg-[var(--color-parchment)] border-l-4 border-[var(--color-cinnabar)]/50 rounded-r-md">
          <p className="font-izhitsa text-base mb-3 text-[var(--color-cinnabar)]">
            В настоящее время в Православной Церкви к таинствам относят:
          </p>
          <ol className="list-decimal list-inside space-y-1 font-sans text-base text-[var(--color-ink)]/85">
            <li>Таинство Крещения</li>
            <li>Таинство миропомазания</li>
            <li>Таинство Евхаристии</li>
            <li>Таинство священства</li>
            <li>Таинство брака</li>
            <li>Таинство покаяния</li>
            <li>Таинство елеосвящения</li>
          </ol>
        </div>

        {/* 1. Таинство Крещения */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство Крещения
          </h2>
          <p className="font-sans mb-3">
            <strong>Креще́ние</strong> (греч. βάπτισμα, буквально: погружение, окунание; в Септуагинте также: омовение от скверны) – Заповедь Бога (Мк.16:16) и Таинство Церкви, в котором человек через троекратное погружение в воду (в критической ситуации: через троекратное обливание водой) с призыванием Бога Отца и Сына и Святого Духа, благодатно очищается от грехов, умирает для жизни греховной, духовно рождается для жизни во Христе, усыновляется Богу, вводится в общение с Церковью (Мф.28:19-20).
          </p>
          <p className="font-sans">
            Крещение является духовным рождением (Ин.3:5-6), приобщением к Божественной жизни. После Крещения человек становится членом Церкви, и может принимать участие в Церковных Таинствах.
          </p>
        </div>

        {/* 2. Таинство Миропомазания */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство Миропомазания
          </h2>
          <p className="font-sans">
            <strong>Миропома́зание</strong> – это Таинство, в котором верующему при помазании освященным миром частей тела подаются особые дары Святого Духа, для укрепления его в духовной жизни, на его христианском пути. Миропомазание полагает первую печать и восстанавливает образ Божий, повреждённый в нас через преслушание. Точно так же оно возрождает в нас благодать, которую Бог вдунул в душу человеческую. Миропомазание содержит в себе силу Духа Святого. Оно – сокровищница Его благоухания, знамение и печать Христовы.
          </p>
        </div>

        {/* 3. Таинство Евхаристии */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство Евхаристии
          </h2>
          <p className="font-sans mb-3">
            <strong>Евхари́стия</strong> (от греч. Εὐχαριστία – благодарность, благодарение) – Церковное Таинство, в процессе совершения которого хлеб и вино прелагаются (претворяются) в Истинное Тело и Истинную Кровь Христовы, после чего эти Тело и Кровь потребляются верующими (под видом хлеба и вина) во оставление грехов и в жизнь вечную (Ин.6:48-54). Благодарение Бога составляет главное содержание этого богослужения.
          </p>
          <p className="font-sans">
            Евхаристия – главное Таинство Церкви, в нём осуществляется то, к чему призван христианин – единению с Господом, Богообщению. Евхаристия есть приобщение к любви Божией, ведь любовь выражается в жертве (Нет больше той любви, как если кто положит душу свою за друзей своих. Ин.15:13), а Жертву за грехи всех людей принёс Сам Господь Иисус Христос.
          </p>
        </div>

        {/* 4. Таинство священства */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство священства
          </h2>
          <p className="font-sans">
            <strong>Та́инство свяще́нства</strong> – таинство, в котором чрез святительское (архиерейское) возложение рук на правильно избранного нисходит Святой Дух и он поставляется во епископа – осуществлять архиерейское служение, или во священника – совершать таинства и духовно руководить вверенной ему паствой, или в диакона – помогать священнику в совершении богослужений и таинств.
          </p>
        </div>

        {/* 5. Таинство брака */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство брака
          </h2>
          <p className="font-sans mb-4">
            Этим Таинством утверждается и благословляется супружеский союз мужчины и женщины, основанный на взаимной любви и добровольном согласии, заключенный в лоне Церкви по образу духовного союза Христа и Его Церкви в целях создания семьи.
          </p>
          <blockquote className="pl-4 border-l-2 border-[var(--color-cinnabar)]/50 italic text-[var(--color-ink)]/80 my-4 bg-[var(--color-cinnabar)]/5 py-3 px-4 rounded-r-md">
            «...и будут два одною плотью, так что они уже не двое, но одна плоть. Итак, что Бог сочетал, того человек да не разлучает» <span className="font-sans not-italic text-sm text-[var(--color-ink)]/60">(Мф. 19:5-6)</span>
          </blockquote>
        </div>

        {/* 6. Таинство Покаяния */}
        <div className="pt-2">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство Покаяния
          </h2>
          <p className="font-sans mb-3">
            <strong>Покая́ние</strong> (μετάνοια (мета́нойя) – перерождение сознания, переосмысление, прозрение) - фундаментальная перемена в жизни: от произвольно-греховной, самолюбивой и самодостаточной – к жизни по заповедям Божиим, в любви и стремлении к Богу.
          </p>
          <p className="font-sans">
            Таинство Церкви, в котором, по искреннем исповедании грехов перед лицом священника, человек по милосердию Божию силой Божественной благодати освобождается от греховной нечистоты через глубокое раскаяние, сокрушение о грехах, характеризуемое печалью и скорбью, вызванной уязвлением совести, но главное, живым ощущением разлучения с Богом; сопровождаемое твердым желанием очищения, преображения жизни; упованием и надеждой на Господа.
          </p>
        </div>

        {/* 7. Таинство елеосвящения */}
        <div className="pt-2 font-sans">
          <h2 className="font-izhitsa text-2xl text-[var(--color-cinnabar)] border-b border-[var(--color-cinnabar)]/15 pb-1 mb-3">
            Таинство елеосвящения
          </h2>
          <p className="font-sans">
            <strong>Елеосвяще́ние, или Собо́рование</strong> – Таинство, совершаемое над больным человеком собором священников (в крайнем случае – одним священником), состоящее в призвании на болящего, посредством молитв и помазания его освященным елеем, исцеляющей, очищающей благодати, врачующей телесные и душевные немощи.
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
