import { ALL_SINS } from '../data/sins';
import templeRulesData from '../data/templeRules.json';
import catechesisData from '../data/catechesis.json';
import trebyData from '../data/treby.json';
import prayersData from '../data/prayers.json';
import commandmentsData from '../data/commandments.json';
import questionsData from '../data/catechesisQuestions.json';

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  snippet: string;
  url: string;
  type: 'page' | 'sin' | 'catechesis' | 'prayer';
}

export interface IndexItem {
  id: string;
  title: string;
  category: string;
  snippet: string;
  url: string;
  keywords: string[];
}

// Full application index covering every section and page
const STATIC_INDEX: IndexItem[] = [
  {
    id: 'calendar',
    title: 'Православный календарь',
    category: 'Календарь',
    snippet: 'Православные праздники, постные дни, особенности трапезы, глас дня и чтения Священного Писания.',
    url: '/calendar',
    keywords: ['пост', 'праздник', 'трапеза', 'рыба', 'елей', 'миряне', 'пасха', 'троица', 'рождество', 'сретение', 'чтения', 'глас', 'дата', 'сегодня']
  },
  {
    id: 'prayer-book',
    title: 'Молитвослов',
    category: 'Молитвы',
    snippet: 'Сборник утренних и вечерних молитв, молитв перед Святым Причащением и благодарственных молитв.',
    url: '/prayer-book',
    keywords: ['молитва', 'утренние', 'вечерние', 'молитвослов', 'сон', 'встав от сна', 'аминь', 'отче наш', 'вера', 'бог', 'слава']
  },
  {
    id: 'communion-prayers',
    title: 'Последование к Святому Причащению',
    category: 'Молитвы',
    snippet: 'Молитвенное правило перед Таинством Святого Евхаристии/Причащения.',
    url: '/prayer-book/communion',
    keywords: ['причастие', 'причащение', 'евхаристия', 'молитвы пред причастием', 'последование', 'чаша', 'христос']
  },
  {
    id: 'communion-warning',
    title: 'Предостережение перед причастием',
    category: 'Молитвы',
    snippet: 'Важные духовные наставления и предостережения святых отцов о причащении во осуждение и в суд.',
    url: '/prayer-book/communion/warning',
    keywords: ['причастие', 'предостережение', 'недостойно', 'суд', 'осуждение', 'подготовка', 'причащаться']
  },
  {
    id: 'various-prayers',
    title: 'Разные молитвы',
    category: 'Молитвы',
    snippet: 'Молитвы о живых (о здравии), об усопших (о упокоении), молитвы Иисусова, Иисусу Христу, Святому Духу.',
    url: '/prayer-book/various',
    keywords: ['разные', 'дополнительные', 'о здравии', 'о упокоении', 'усопших', 'живых', 'псалом 50', 'псалом 90', 'живый в помощи', 'иисусова молитва', 'ефрема сирина']
  },
  {
    id: 'temple',
    title: 'В Храм (Раздел)',
    category: 'В Храм',
    snippet: 'Всё о подготовке к посещению храма, церковных службах, записках, требах и покаянии.',
    url: '/temple',
    keywords: ['храм', 'церковь', 'алтарь', 'исповедь', 'литургия', 'записки', 'требы', 'просфора', 'священник', 'батюшка']
  },
  {
    id: 'temple-rules',
    title: 'Правила поведения в храме',
    category: 'В Храм',
    snippet: 'Касательно одежды, разговоров, свечей, поклонов и благочестивого настроения при входе в Божий Дом.',
    url: '/temple/rules',
    keywords: ['правила', 'поведение', 'одежда', 'свечи', 'поклон', 'как вести себя', 'женщины', 'платок', 'юбка', 'крест']
  },
  {
    id: 'confession-diary',
    title: 'Дневник кающегося (Исповедь)',
    category: 'В Храм',
    snippet: 'Интерактивный список грехов по 8 главным страстям. Помогает подготовиться к Таинству Исповеди.',
    url: '/temple/confession',
    keywords: ['исповедь', 'дневник', 'грехи', 'страсти', 'гордость', 'тщеславие', 'уныние', 'гнев', 'сокрушение', 'раскаяние', 'блуд', 'чревоугодие', 'сребролюбие', 'печаль']
  },
  {
    id: 'my-confession',
    title: 'Моя исповедь',
    category: 'В Храм',
    snippet: 'Ваш личный список грехов и личные обстоятельства для последующей беседы со священником на исповеди.',
    url: '/my-confession',
    keywords: ['моя исповедь', 'мой список', 'грехи записанные', 'подготовка к исповеди', 'что сказать батюшке']
  },
  {
    id: 'liturgy',
    title: 'Божественная Литургия',
    category: 'В Храм',
    snippet: 'Подробное объяснение хода Литургии: проскомидия, Литургия оглашенных, Литургия верных. Что нужно делать.',
    url: '/temple/liturgy',
    keywords: ['литургия', 'служба', 'проскомидия', 'оглашенных', 'верных', 'евхаристия', 'херувимская', 'символ веры']
  },
  {
    id: 'divine-services',
    title: 'Богослужения',
    category: 'В Храм',
    snippet: 'Общественные богослужения Православной Церкви: Суточный круг богослужения и Божественная Литургия.',
    url: '/temple/divine-services',
    keywords: ['богослужения', 'службы', 'суточный круг', 'литургия', 'всенощное бдение', 'часы', 'вечерня', 'утреня']
  },
  {
    id: 'daily-cycle',
    title: 'Суточный круг богослужения',
    category: 'В Храм',
    snippet: 'Исследование девяти служб суточного круга: полунощница, утреня, вечерня, повечерие, часы, литургия и их смысл.',
    url: '/temple/divine-services/daily',
    keywords: ['суточный круг', 'богослужение', 'девять служб', 'полунощница', 'утреня', 'вечерня', 'повечерие', 'часы', 'литургия', 'схема']
  },
  {
    id: 'treby',
    title: 'О церковных требах',
    category: 'В Храм',
    snippet: 'Как правильно подавать записки за здравие и упокой, что такое молебен, панихида, сорокоуст.',
    url: '/temple/treby',
    keywords: ['treby', 'записки', 'поминовение', 'молебен', 'панихида', 'сорокоуст', 'проскомидия', 'за здравие', 'за упокой']
  },
  {
    id: 'prosphora',
    title: 'О просфоре и святой воде',
    category: 'В Храм',
    snippet: 'Правила вкушения просфоры и святой воды дома, их духовное значение и помощь христианину.',
    url: '/temple/prosphora',
    keywords: ['просфора', 'святая вода', 'артос', 'антидор', 'вкушение', 'натощак', 'утром']
  },
  {
    id: 'gospel-life',
    title: 'Жизнь по Евангелию (Раздел)',
    category: 'Евангелие',
    snippet: 'Духовное просвещение, Евангельские заповеди, Огласительные беседы и наставления святых отцов.',
    url: '/gospel-life',
    keywords: ['евангелие', 'жизнь', 'христос', 'заповеди', 'оглашение', 'карта', 'литература', 'книги', 'ангелы']
  },
  {
    id: 'route-map',
    title: 'Земной путь Господа Иисуса Христа',
    category: 'Евангелие',
    snippet: 'Интерактивная карта ключевых событий земной жизни Спасителя от Благовещения до Распятия и Воскресения.',
    url: '/gospel-life/route-map',
    keywords: ['карта', 'земной путь', 'иерусалим', 'вифлеем', 'назарет', 'иордан', 'голгофа', 'галилея', 'воскресение', 'путешествие', 'история']
  },
  {
    id: 'catechesis',
    title: 'Огласительные беседы',
    category: 'Евангелие',
    snippet: 'Курс оглашения для понимания основ веры, Бога, сотворения мира, грехопадения и искупления.',
    url: '/gospel-life/catechesis',
    keywords: ['оглашение', 'беседы', 'вера', 'бог', 'троица', 'ангелы', 'человек', 'грехопадение', 'библия', 'крещение']
  },
  {
    id: 'catechesis-questions',
    title: 'Контрольные вопросы',
    category: 'Евангелие',
    snippet: 'Проверьте свои знания основ православной веры после прохождения огласительных бесед.',
    url: '/gospel-life/catechesis/questions',
    keywords: ['вопросы', 'контроль', 'проверка знаний', 'катехизис', 'викторина', 'экзамен']
  },
  {
    id: 'repentance-help',
    title: 'В помощь кающемуся (Изречения)',
    category: 'Евангелие',
    snippet: 'Мудрые изречения святых отцов о покаянии, борьбе с грехами, молитве и милосердии Божием.',
    url: '/gospel-life/repentance-help',
    keywords: ['изречения', 'святые отцы', 'цитаты', 'авва', 'милосердие', 'грех', 'помощь', 'покаяние']
  },
  {
    id: 'commandments',
    title: 'Евангельские заповеди блаженства',
    category: 'Евангелие',
    snippet: 'Заповеди Спасителя, произнесенные в Нагорной проповеди, открывающие путь к истинному вечному блаженству.',
    url: '/gospel-life/commandments',
    keywords: ['заповеди блаженства', 'блаженны', 'нагорная проповедь', 'нищие духом', 'кроткие', 'плачущие', 'чистые сердцем']
  },
  {
    id: 'dogmas',
    title: 'Догматы православного богословия',
    category: 'Евангелие',
    snippet: 'Систематическое изложение христианских догматов: учение о Боге в Самом Себе, о Святой Троице, о Творении, Искуплении, Церкви и вечной жизни.',
    url: '/gospel-life/dogmas',
    keywords: ['догматы', 'богословие', 'символ веры', 'троица', 'боговоплощение', 'творение', 'промысл', 'таинства', 'грехопадение', 'воскресение', 'дух святой']
  },
  {
    id: 'ascetics',
    title: 'Аскетика дня',
    category: 'Евангелие',
    snippet: 'Практические основы христианской жизни: страх Божий, сокрушение сердца, плач блаженный.',
    url: '/gospel-life/ascetics',
    keywords: ['аскетика', 'страх божий', 'сокрушение сердца', 'плач блаженный', 'памятование о смерти', 'нищета духа', 'практика']
  },
  {
    id: 'gospel-death',
    title: 'Мытарства и частный суд',
    category: 'Евангелие',
    snippet: 'Учение Православной Церкви о смерти, мытарствах души, частном и всеобщем страшном суде, аде и рае.',
    url: '/gospel-life/death',
    keywords: ['смерть', 'мытарства', 'ад', 'рай', 'суд', 'частный суд', 'страшный суд', 'душа', 'вечность']
  },
  {
    id: 'literature',
    title: 'Душеполезная литература (Библиотека)',
    category: 'Евангелие',
    snippet: 'Список рекомендованных книг для укрепления веры и искреннего покаяния.',
    url: '/gospel-life/literature',
    keywords: ['литература', 'книги', 'библиотека', 'читать', 'брянчанинов', 'лествица', 'затворник', 'духовное чтение']
  },
  {
    id: 'angels',
    title: 'Мир Ангелов и учение о злых духах',
    category: 'Евангелие',
    snippet: 'Священное Предание об ангельских чинах, о бесах и силах тьмы, и христианские методы защиты от них.',
    url: '/gospel-life/angels',
    keywords: ['ангелы', 'бесы', 'демоны', 'злые духи', 'сатана', 'денница', 'архангел', 'хранитель', 'искушение', 'крест']
  }
];

const PRAYER_TITLES: Record<string, string> = {
  'morning': 'Молитвы утренние',
  'evening': 'Молитвы на сон грядущим',
  'canon-repentance': 'Канон покаянный ко Господу',
  'canon-theotokos': 'Канон ко Пресвятой Богородице',
  'canon-guardian-angel': 'Канон Ангелу-Хранителю',
  'communion-prayers': 'Последование пред Причащением',
  'thanksgiving': 'Благодарственные молитвы',
  'sick': 'Молитвы о болящих',
  'children': 'Молитвы о детях',
  'theotokos-various': 'Молитвы ко Богородице',
  'homeland': 'Молитвы за Отечество',
  'spiritual-warfare': 'Молитвы на брань духовную'
};

export function performGlobalSearch(query: string): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: SearchResult[] = [];

  // 1. Search in static index
  for (const item of STATIC_INDEX) {
    const titleMatch = item.title.toLowerCase().includes(trimmed);
    const categoryMatch = item.category.toLowerCase().includes(trimmed);
    const snippetMatch = item.snippet.toLowerCase().includes(trimmed);
    const keywordMatch = item.keywords.some(kw => kw.includes(trimmed));

    if (titleMatch || categoryMatch || snippetMatch || keywordMatch) {
      results.push({
        id: item.id,
        title: item.title,
        category: item.category,
        snippet: item.snippet,
        url: item.url,
        type: item.url.includes('prayer') ? 'prayer' : item.url.includes('catechesis') ? 'catechesis' : 'page'
      });
    }
  }

  // 2. Search in templeRulesData (sections & subsections)
  if (templeRulesData && Array.isArray(templeRulesData.sections)) {
    for (const section of templeRulesData.sections) {
      const secTitleLower = section.title.toLowerCase();
      const contentText = Array.isArray(section.content) ? section.content.join(' ') : '';
      const contentTextLower = contentText.toLowerCase();

      if (secTitleLower.includes(trimmed) || contentTextLower.includes(trimmed)) {
        let snippet = section.content && section.content[0] ? section.content[0] : '';
        if (trimmed.length > 2) {
          const matchParagraph = section.content?.find(p => p.toLowerCase().includes(trimmed));
          if (matchParagraph) snippet = matchParagraph;
        }
        snippet = snippet.replace(/<[^>]*>/g, '');
        if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

        results.push({
          id: `rule_${section.id}`,
          title: `Правила: ${section.title}`,
          category: 'В Храм',
          snippet: snippet || 'Правила благочестивого поведения в православном храме.',
          url: `/temple/rules?sec=${section.id}`,
          type: 'page'
        });
      }

      if (Array.isArray(section.subsections)) {
        for (const sub of section.subsections) {
          const subTitleLower = sub.title.toLowerCase();
          const subContentText = Array.isArray(sub.content) ? sub.content.join(' ') : '';
          const subContentTextLower = subContentText.toLowerCase();

          if (subTitleLower.includes(trimmed) || subContentTextLower.includes(trimmed)) {
            let snippet = sub.content && sub.content[0] ? sub.content[0] : '';
            if (trimmed.length > 2) {
              const matchParagraph = sub.content?.find(p => p.toLowerCase().includes(trimmed));
              if (matchParagraph) snippet = matchParagraph;
            }
            snippet = snippet.replace(/<[^>]*>/g, '');
            if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

            results.push({
              id: `rule_${sub.id}`,
              title: `Правила: ${section.title} → ${sub.title}`,
              category: 'В Храм',
              snippet: snippet || 'Правила благочестивого поведения в православном храме.',
              url: `/temple/rules?sec=${sub.id}`,
              type: 'page'
            });
          }
        }
      }
    }
  }

  // 3. Search in trebyData (sections & subsections)
  if (trebyData && Array.isArray(trebyData.sections)) {
    for (const section of trebyData.sections) {
      const secTitleLower = section.title.toLowerCase();
      const contentText = Array.isArray(section.content) ? section.content.join(' ') : '';
      const contentTextLower = contentText.toLowerCase();

      if (secTitleLower.includes(trimmed) || contentTextLower.includes(trimmed)) {
        let snippet = section.content && section.content[0] ? section.content[0] : '';
        if (trimmed.length > 2) {
          const matchParagraph = section.content?.find(p => p.toLowerCase().includes(trimmed));
          if (matchParagraph) snippet = matchParagraph;
        }
        snippet = snippet.replace(/<[^>]*>/g, '');
        if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

        results.push({
          id: `treby_${section.id}`,
          title: `Записка церковная: ${section.title}`,
          category: 'В Храм',
          snippet: snippet || 'О церковных записках, поминовениях и службах.',
          url: `/temple/treby?sec=${section.id}`,
          type: 'page'
        });
      }

      if (Array.isArray(section.subsections)) {
        for (const sub of section.subsections) {
          const subTitleLower = sub.title.toLowerCase();
          const subContentText = Array.isArray(sub.content) ? sub.content.join(' ') : '';
          const subContentTextLower = subContentText.toLowerCase();

          if (subTitleLower.includes(trimmed) || subContentTextLower.includes(trimmed)) {
            let snippet = sub.content && sub.content[0] ? sub.content[0] : '';
            if (trimmed.length > 2) {
              const matchParagraph = sub.content?.find(p => p.toLowerCase().includes(trimmed));
              if (matchParagraph) snippet = matchParagraph;
            }
            snippet = snippet.replace(/<[^>]*>/g, '');
            if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

            results.push({
              id: `treby_${sub.id}`,
              title: `Записка церковная: ${sub.title}`,
              category: 'В Храм',
              snippet: snippet || 'Подробности о правилах и значении церковного поминовения.',
              url: `/temple/treby?sec=${sub.id}`,
              type: 'page'
            });
          }
        }
      }
    }
  }

  // 4. Search in catechesisData (video items)
  if (Array.isArray(catechesisData)) {
    for (const video of catechesisData) {
      const titleLower = video.title.toLowerCase();
      const descLower = video.description.toLowerCase();

      if (titleLower.includes(trimmed) || descLower.includes(trimmed)) {
        let snippet = video.description;
        if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

        results.push({
          id: `cat_${video.id}`,
          title: `Оглашение: ${video.title.replace(/\n/g, ' ')}`,
          category: 'Оглашение',
          snippet: snippet,
          url: `/gospel-life/catechesis?id=${video.id}`,
          type: 'catechesis'
        });
      }
    }
  }

  // 5. Search in commandmentsData (commandments sections)
  if (Array.isArray(commandmentsData)) {
    commandmentsData.forEach((cmd, idx) => {
      const titleLower = cmd.title.toLowerCase();
      const contentLower = (cmd.content || '').toLowerCase();

      if (titleLower.includes(trimmed) || contentLower.includes(trimmed)) {
        let snippet = cmd.content || '';
        if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

        results.push({
          id: `cmd_${idx}`,
          title: `Заповеди: ${cmd.title}`,
          category: 'Евангелие',
          snippet: snippet || 'Наставления Спасителя и святых отцов о заповедях.',
          url: `/gospel-life/commandments?id=cmd-${idx}`,
          type: 'page'
        });
      }
    });
  }

  // 6. Search in prayersData
  if (prayersData && typeof prayersData === 'object') {
    for (const [key, list] of Object.entries(prayersData)) {
      if (Array.isArray(list)) {
        let currentHeader = '';
        list.forEach((item, idx) => {
          if (item.type === 'header') {
            currentHeader = item.text || item.slavonic || '';
          } else {
            const slavonicLower = (item.slavonic || '').toLowerCase();
            const russianLower = (item.russian || '').toLowerCase();

            if (slavonicLower.includes(trimmed) || russianLower.includes(trimmed)) {
              let snippet = item.russian || item.slavonic || '';
              if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

              const catTitle = PRAYER_TITLES[key] || 'Молитвослов';
              const prayerTitle = currentHeader ? `${catTitle}: ${currentHeader}` : `${catTitle}: Молитва`;

              results.push({
                id: `prayer_${key}_${idx}`,
                title: prayerTitle.replace(/\n/g, ' '),
                category: 'Молитвы',
                snippet: snippet,
                url: `/prayer-book/${key}?id=prayer-item-${idx}`,
                type: 'prayer'
              });
            }
          }
        });
      }
    }
  }

  // 7. Search in questionsData
  if (Array.isArray(questionsData)) {
    questionsData.forEach((group, groupIdx) => {
      if (Array.isArray(group.items)) {
        group.items.forEach((qItem, qIdx) => {
          const qLower = qItem.q.toLowerCase();
          const aLower = qItem.a.toLowerCase();

          if (qLower.includes(trimmed) || aLower.includes(trimmed)) {
            let snippet = qItem.a;
            if (snippet.length > 160) snippet = snippet.slice(0, 160) + '...';

            results.push({
              id: `q_${groupIdx}_${qIdx}`,
              title: `Вопрос: ${qItem.q}`,
              category: 'Оглашение (Вопросы)',
              snippet: snippet,
              url: `/gospel-life/catechesis/questions?q=${encodeURIComponent(qItem.q)}`,
              type: 'catechesis'
            });
          }
        });
      }
    });
  }

  // 8. Search in Sins database dynamically
  if (trimmed.length >= 3) {
    const matchingSins = ALL_SINS.filter(sin => {
      const titleMatch = sin.title.toLowerCase().includes(trimmed);
      const descMatch = sin.description.toLowerCase().includes(trimmed);
      const passionMatch = sin.passion.toLowerCase().includes(trimmed);
      return titleMatch || descMatch || passionMatch;
    });

    matchingSins.slice(0, 8).forEach((sin) => {
      results.push({
        id: `sin_${sin.id}`,
        title: `${sin.passion}: ${sin.title}`,
        category: 'Исповедь (Дневник)',
        snippet: sin.description,
        url: `/temple/confession?passion=${encodeURIComponent(sin.passion)}&sinId=${sin.id}`,
        type: 'sin'
      });
    });
  }

  // Deduplicate results by URL + Title combination
  const seen = new Set<string>();
  return results.filter(item => {
    const uniqueKey = `${item.url}_${item.title}`;
    if (seen.has(uniqueKey)) return false;
    seen.add(uniqueKey);
    return true;
  });
}
