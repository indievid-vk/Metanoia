import { ALL_SINS } from '../data/sins';

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
    id: 'treby',
    title: 'О церковных требах',
    category: 'В Храм',
    snippet: 'Как правильно подавать записки за здравие и упокой, что такое молебен, панихида, сорокоуст.',
    url: '/temple/treby',
    keywords: ['требы', 'записки', 'поминовение', 'молебен', 'панихида', 'сорокоуст', 'проскомидия', 'за здравие', 'за упокой']
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
      // Determine match strength
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

  // 2. Search in Sins database dynamically
  // If the query is relevant to sins/confession (or is 3+ characters)
  if (trimmed.length >= 3) {
    const matchingSins = ALL_SINS.filter(sin => {
      const titleMatch = sin.title.toLowerCase().includes(trimmed);
      const descMatch = sin.description.toLowerCase().includes(trimmed);
      const passionMatch = sin.passion.toLowerCase().includes(trimmed);
      return titleMatch || descMatch || passionMatch;
    });

    // Add up to 8 matched sins to results so we don't overflow
    matchingSins.slice(0, 8).forEach((sin) => {
      results.push({
        id: `sin_${sin.id}`,
        title: `${sin.passion}: ${sin.title}`,
        category: 'Исповедь (Дневник)',
        snippet: sin.description,
        url: '/temple/confession',
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
