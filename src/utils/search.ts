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

interface PreparedEntry {
  result: SearchResult;
  titleLower: string;
  bodyLower: string;
  paragraphs?: string[];
  minQueryLen?: number;
}

let CACHED_SEARCH_INDEX: PreparedEntry[] | null = null;

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function makeSnippet(text: string, maxLen = 160): string {
  const clean = stripHtmlTags(text);
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean;
}

function getSearchIndex(): PreparedEntry[] {
  if (CACHED_SEARCH_INDEX) return CACHED_SEARCH_INDEX;

  const entries: PreparedEntry[] = [];

  // 1. Static index
  for (const item of STATIC_INDEX) {
    entries.push({
      result: {
        id: item.id,
        title: item.title,
        category: item.category,
        snippet: item.snippet,
        url: item.url,
        type: item.url.includes('prayer') ? 'prayer' : item.url.includes('catechesis') ? 'catechesis' : 'page'
      },
      titleLower: item.title.toLowerCase(),
      bodyLower: `${item.category} ${item.snippet} ${item.keywords.join(' ')}`.toLowerCase()
    });
  }

  // 2. Temple rules
  if (templeRulesData && Array.isArray(templeRulesData.sections)) {
    for (const section of templeRulesData.sections) {
      const contentArr = Array.isArray(section.content) ? section.content : [];
      const fallbackSnippet = contentArr[0] ? makeSnippet(contentArr[0]) : 'Правила благочестивого поведения в православном храме.';
      entries.push({
        result: {
          id: `rule_${section.id}`,
          title: `Правила: ${section.title}`,
          category: 'В Храм',
          snippet: fallbackSnippet,
          url: `/temple/rules?sec=${section.id}`,
          type: 'page'
        },
        titleLower: section.title.toLowerCase(),
        bodyLower: contentArr.join(' ').toLowerCase(),
        paragraphs: contentArr
      });

      if (Array.isArray(section.subsections)) {
        for (const sub of section.subsections) {
          const subArr = Array.isArray(sub.content) ? sub.content : [];
          entries.push({
            result: {
              id: `rule_${sub.id}`,
              title: `Правила: ${section.title} → ${sub.title}`,
              category: 'В Храм',
              snippet: subArr[0] ? makeSnippet(subArr[0]) : 'Правила благочестивого поведения в православном храме.',
              url: `/temple/rules?sec=${sub.id}`,
              type: 'page'
            },
            titleLower: sub.title.toLowerCase(),
            bodyLower: subArr.join(' ').toLowerCase(),
            paragraphs: subArr
          });
        }
      }
    }
  }

  // 3. Treby
  if (trebyData && Array.isArray(trebyData.sections)) {
    for (const section of trebyData.sections) {
      const contentArr = Array.isArray(section.content) ? section.content : [];
      entries.push({
        result: {
          id: `treby_${section.id}`,
          title: `Записка церковная: ${section.title}`,
          category: 'В Храм',
          snippet: contentArr[0] ? makeSnippet(contentArr[0]) : 'О церковных записках, поминовениях и службах.',
          url: `/temple/treby?sec=${section.id}`,
          type: 'page'
        },
        titleLower: section.title.toLowerCase(),
        bodyLower: contentArr.join(' ').toLowerCase(),
        paragraphs: contentArr
      });

      if (Array.isArray(section.subsections)) {
        for (const sub of section.subsections) {
          const subArr = Array.isArray(sub.content) ? sub.content : [];
          entries.push({
            result: {
              id: `treby_${sub.id}`,
              title: `Записка церковная: ${sub.title}`,
              category: 'В Храм',
              snippet: subArr[0] ? makeSnippet(subArr[0]) : 'Подробности о правилах и значении церковного поминовения.',
              url: `/temple/treby?sec=${sub.id}`,
              type: 'page'
            },
            titleLower: sub.title.toLowerCase(),
            bodyLower: subArr.join(' ').toLowerCase(),
            paragraphs: subArr
          });
        }
      }
    }
  }

  // 4. Catechesis videos
  if (Array.isArray(catechesisData)) {
    for (const video of catechesisData) {
      entries.push({
        result: {
          id: `cat_${video.id}`,
          title: `Оглашение: ${video.title.replace(/\n/g, ' ')}`,
          category: 'Оглашение',
          snippet: makeSnippet(video.description || ''),
          url: `/gospel-life/catechesis?id=${video.id}`,
          type: 'catechesis'
        },
        titleLower: video.title.toLowerCase(),
        bodyLower: (video.description || '').toLowerCase()
      });
    }
  }

  // 5. Commandments
  if (Array.isArray(commandmentsData)) {
    commandmentsData.forEach((cmd, idx) => {
      entries.push({
        result: {
          id: `cmd_${idx}`,
          title: `Заповеди: ${cmd.title}`,
          category: 'Евангелие',
          snippet: cmd.content ? makeSnippet(cmd.content) : 'Наставления Спасителя и святых отцов о заповедях.',
          url: `/gospel-life/commandments?id=cmd-${idx}`,
          type: 'page'
        },
        titleLower: cmd.title.toLowerCase(),
        bodyLower: (cmd.content || '').toLowerCase()
      });
    });
  }

  // 6. Prayers
  if (prayersData && typeof prayersData === 'object') {
    for (const [key, list] of Object.entries(prayersData)) {
      if (Array.isArray(list)) {
        let currentHeader = '';
        list.forEach((item, idx) => {
          if (item.type === 'header') {
            currentHeader = item.text || item.slavonic || '';
          } else {
            const catTitle = PRAYER_TITLES[key] || 'Молитвослов';
            const prayerTitle = (currentHeader ? `${catTitle}: ${currentHeader}` : `${catTitle}: Молитва`).replace(/\n/g, ' ');
            const textCombined = `${item.slavonic || ''} ${item.russian || ''}`;
            entries.push({
              result: {
                id: `prayer_${key}_${idx}`,
                title: prayerTitle,
                category: 'Молитвы',
                snippet: makeSnippet(item.russian || item.slavonic || ''),
                url: `/prayer-book/${key}?id=prayer-item-${idx}`,
                type: 'prayer'
              },
              titleLower: prayerTitle.toLowerCase(),
              bodyLower: textCombined.toLowerCase()
            });
          }
        });
      }
    }
  }

  // 7. Catechesis questions
  if (Array.isArray(questionsData)) {
    questionsData.forEach((group, groupIdx) => {
      if (Array.isArray(group.items)) {
        group.items.forEach((qItem, qIdx) => {
          entries.push({
            result: {
              id: `q_${groupIdx}_${qIdx}`,
              title: `Вопрос: ${qItem.q}`,
              category: 'Оглашение (Вопросы)',
              snippet: makeSnippet(qItem.a || ''),
              url: `/gospel-life/catechesis/questions?q=${encodeURIComponent(qItem.q)}`,
              type: 'catechesis'
            },
            titleLower: qItem.q.toLowerCase(),
            bodyLower: (qItem.a || '').toLowerCase()
          });
        });
      }
    });
  }

  // 8. Sins
  for (const sin of ALL_SINS) {
    entries.push({
      result: {
        id: `sin_${sin.id}`,
        title: `${sin.passion}: ${sin.title}`,
        category: 'Исповедь (Дневник)',
        snippet: sin.description,
        url: `/temple/confession?passion=${encodeURIComponent(sin.passion)}&sinId=${sin.id}`,
        type: 'sin'
      },
      titleLower: `${sin.passion} ${sin.title}`.toLowerCase(),
      bodyLower: sin.description.toLowerCase(),
      minQueryLen: 3
    });
  }

  CACHED_SEARCH_INDEX = entries;
  return entries;
}

export function performGlobalSearch(query: string): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const index = getSearchIndex();
  const titleMatches: SearchResult[] = [];
  const bodyMatches: SearchResult[] = [];
  const seen = new Set<string>();
  let sinCount = 0;
  const MAX_RESULTS = 60;

  for (const entry of index) {
    if (entry.minQueryLen && trimmed.length < entry.minQueryLen) continue;
    if (entry.result.type === 'sin' && sinCount >= 8) continue;

    const isTitleHit = entry.titleLower.includes(trimmed);
    const isBodyHit = !isTitleHit && entry.bodyLower.includes(trimmed);
    if (!isTitleHit && !isBodyHit) continue;

    const uniqueKey = `${entry.result.url}_${entry.result.title}`;
    if (seen.has(uniqueKey)) continue;
    seen.add(uniqueKey);

    let res = entry.result;
    if (entry.paragraphs && trimmed.length > 2) {
      const matchParagraph = entry.paragraphs.find(p => p.toLowerCase().includes(trimmed));
      if (matchParagraph) {
        res = { ...res, snippet: makeSnippet(matchParagraph) };
      }
    }

    if (res.type === 'sin') sinCount += 1;

    if (isTitleHit) {
      titleMatches.push(res);
    } else if (bodyMatches.length < MAX_RESULTS) {
      bodyMatches.push(res);
    }

    if (titleMatches.length >= MAX_RESULTS) break;
  }

  return [...titleMatches, ...bodyMatches].slice(0, MAX_RESULTS);
}
