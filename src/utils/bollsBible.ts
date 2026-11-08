// Client-side authentic Bible Readings fetcher using free open Bolls Bible API (Synodal translation) with CORS: *
// Guarantees authentic scripture readings in standalone PWAs, mobile devices, and offline/proxyless environments.

export interface BibleVerse {
  pk?: number;
  verse: number;
  text: string;
}

export interface BookMeta {
  id: number;
  title: string;
  abbr: string;
}

export const BOOK_METAS: Record<string, BookMeta> = {
  // New Testament
  Mt: { id: 40, title: "Евангелие от Матфея", abbr: "Мф." },
  Mk: { id: 41, title: "Евангелие от Марка", abbr: "Мк." },
  Lk: { id: 42, title: "Евангелие от Луки", abbr: "Лк." },
  Jn: { id: 43, title: "Евангелие от Иоанна", abbr: "Ин." },
  Act: { id: 44, title: "Деяния святых апостолов", abbr: "Деян." },
  Rom: { id: 45, title: "Послание к Римлянам", abbr: "Рим." },
  "1Cor": { id: 46, title: "Первое послание к Коринфянам", abbr: "1Кор." },
  "2Cor": { id: 47, title: "Второе послание к Коринфянам", abbr: "2Кор." },
  Gal: { id: 48, title: "Послание к Галатам", abbr: "Гал." },
  Eph: { id: 49, title: "Послание к Ефесянам", abbr: "Еф." },
  Phil: { id: 50, title: "Послание к Филиппийцам", abbr: "Флп." },
  Col: { id: 51, title: "Послание к Колоссянам", abbr: "Кол." },
  "1Thess": { id: 52, title: "Первое послание к Фессалоникийцам", abbr: "1Фес." },
  "1Thes": { id: 52, title: "Первое послание к Фессалоникийцам", abbr: "1Фес." },
  "2Thess": { id: 53, title: "Второе послание к Фессалоникийцам", abbr: "2Фес." },
  "2Thes": { id: 53, title: "Второе послание к Фессалоникийцам", abbr: "2Фес." },
  "1Tim": { id: 54, title: "Первое послание к Тимофею", abbr: "1Тим." },
  "2Tim": { id: 55, title: "Второе послание к Тимофею", abbr: "2Тим." },
  Tit: { id: 56, title: "Послание к Титу", abbr: "Тит." },
  Phlm: { id: 57, title: "Послание к Филимону", abbr: "Флм." },
  Heb: { id: 58, title: "Послание к Евреям", abbr: "Евр." },
  Hebr: { id: 58, title: "Послание к Евреям", abbr: "Евр." },
  Jas: { id: 59, title: "Соборное послание святого апостола Иакова", abbr: "Иак." },
  "1Pet": { id: 60, title: "Первое соборное послание святого апостола Петра", abbr: "1Пет." },
  "2Pet": { id: 61, title: "Второе соборное послание святого апостола Петра", abbr: "2Пет." },
  "1Jn": { id: 62, title: "Первое соборное послание святого апостола Иоанна", abbr: "1Ин." },
  "2Jn": { id: 63, title: "Второе соборное послание святого апостола Иоанна", abbr: "2Ин." },
  "3Jn": { id: 64, title: "Третье соборное послание святого апостола Иоанна", abbr: "3Ин." },
  Jud: { id: 65, title: "Соборное послание святого апостола Иуды", abbr: "Иуд." },
  Rev: { id: 66, title: "Откровение святого Иоанна Богослова (Апокалипсис)", abbr: "Откр." },
  Apoc: { id: 66, title: "Откровение святого Иоанна Богослова (Апокалипсис)", abbr: "Откр." },
  // Old Testament Paremias & Prophecies
  Gen: { id: 1, title: "Книга Бытия", abbr: "Быт." },
  Ex: { id: 2, title: "Книга Исход", abbr: "Исх." },
  Lev: { id: 3, title: "Книга Левит", abbr: "Лев." },
  Num: { id: 4, title: "Книга Числа", abbr: "Чис." },
  Deut: { id: 5, title: "Книга Второзаконие", abbr: "Втор." },
  Josh: { id: 6, title: "Книга Иисуса Навина", abbr: "Нав." },
  Judg: { id: 7, title: "Книга Судей", abbr: "Суд." },
  Ruth: { id: 8, title: "Книга Руфь", abbr: "Руфь" },
  "1Sam": { id: 9, title: "Первая книга Царств", abbr: "1Цар." },
  "2Sam": { id: 10, title: "Вторая книга Царств", abbr: "2Цар." },
  "1Kgs": { id: 11, title: "Третья книга Царств", abbr: "3Цар." },
  "2Kgs": { id: 12, title: "Четвертая книга Царств", abbr: "4Цар." },
  Job: { id: 18, title: "Книга Иова", abbr: "Иов" },
  Ps: { id: 19, title: "Псалтирь", abbr: "Пс." },
  Prov: { id: 20, title: "Книга притчей Соломоновых", abbr: "Притч." },
  Eccl: { id: 21, title: "Книга Екклесиаста", abbr: "Еккл." },
  Song: { id: 22, title: "Песнь песней Соломона", abbr: "Песн." },
  Isa: { id: 23, title: "Книга пророка Исаии", abbr: "Ис." },
  Jer: { id: 24, title: "Книга пророка Иеремии", abbr: "Иер." },
  Ezek: { id: 26, title: "Книга пророка Иезекииля", abbr: "Иез." },
  Dan: { id: 27, title: "Книга пророка Даниила", abbr: "Дан." },
  Joel: { id: 29, title: "Книга пророка Иоиля", abbr: "Иоил." },
  Jonah: { id: 32, title: "Книга пророка Ионы", abbr: "Ион." },
  Mic: { id: 33, title: "Книга пророка Михея", abbr: "Мих." },
  Hab: { id: 35, title: "Книга пророка Аввакума", abbr: "Авв." },
  Zeph: { id: 36, title: "Книга пророка Софонии", abbr: "Соф." },
  Zech: { id: 38, title: "Книга пророка Захарии", abbr: "Зах." },
  Mal: { id: 39, title: "Книга пророка Малахии", abbr: "Мал." },
  Wis: { id: 70, title: "Книга Премудрости Соломона", abbr: "Прем." },
  Sir: { id: 71, title: "Книга Премудрости Иисуса, сына Сирахова", abbr: "Сир." }
};

export interface PassageSegment {
  startCh: number;
  startV: number;
  endCh: number;
  endV: number;
}

export interface ParsedRef {
  bookInfo: BookMeta;
  segments: PassageSegment[];
  passageDisplay: string;
}

export function parseScriptureRef(refStr: string): ParsedRef | null {
  const cleanRef = refStr.trim().replace(/[–—]/g, "-").replace(/\*+$/, "");
  const dotIdx = cleanRef.indexOf(".");
  if (dotIdx === -1) return null;

  const bookCode = cleanRef.slice(0, dotIdx);
  const passagePart = cleanRef.slice(dotIdx + 1).trim();
  const bookInfo = BOOK_METAS[bookCode];
  if (!bookInfo) return null;

  try {
    const rawParts = passagePart.split(",").map(s => s.trim()).filter(Boolean);
    const segments: PassageSegment[] = [];
    let currentChapter = 1;

    for (const part of rawParts) {
      if (part.includes(":")) {
        const [chStr, vRange] = part.split(":");
        currentChapter = parseInt(chStr, 10) || currentChapter;
        if (vRange.includes("-")) {
          const [startVStr, endVStr] = vRange.split("-");
          if (endVStr.includes(":")) {
            // cross chapter e.g. 7:26-8:2
            const [endChStr, realEndV] = endVStr.split(":");
            const endCh = parseInt(endChStr, 10) || currentChapter;
            segments.push({
              startCh: currentChapter,
              startV: parseInt(startVStr, 10) || 1,
              endCh: endCh,
              endV: parseInt(realEndV, 10) || 999
            });
            currentChapter = endCh;
          } else {
            segments.push({
              startCh: currentChapter,
              startV: parseInt(startVStr, 10) || 1,
              endCh: currentChapter,
              endV: parseInt(endVStr, 10) || 999
            });
          }
        } else {
          const v = parseInt(vRange, 10) || 1;
          segments.push({
            startCh: currentChapter,
            startV: v,
            endCh: currentChapter,
            endV: v
          });
        }
      } else if (part.includes("-")) {
        const [startVStr, endVStr] = part.split("-");
        segments.push({
          startCh: currentChapter,
          startV: parseInt(startVStr, 10) || 1,
          endCh: currentChapter,
          endV: parseInt(endVStr, 10) || 999
        });
      } else {
        const v = parseInt(part, 10) || 1;
        segments.push({
          startCh: currentChapter,
          startV: v,
          endCh: currentChapter,
          endV: v
        });
      }
    }

    if (segments.length === 0) return null;

    return {
      bookInfo,
      segments,
      passageDisplay: passagePart
    };
  } catch {
    return null;
  }
}

// Russian book abbreviation to canonical code map
export const RU_ABBR_TO_CODE: Record<string, string> = {
  "Мф": "Mt", "Мк": "Mk", "Лк": "Lk", "Ин": "Jn", "Деян": "Act",
  "Иак": "Jas", "1Пет": "1Pet", "2Пет": "2Pet", "1Ин": "1Jn", "2Ин": "2Jn", "3Ин": "3Jn",
  "Иуд": "Jud", "Рим": "Rom", "1Кор": "1Cor", "2Кор": "2Cor", "Гал": "Gal",
  "Еф": "Eph", "Флп": "Phil", "Кол": "Col", "1Фес": "1Thess", "2Фес": "2Thess",
  "1Тим": "1Tim", "2Тим": "2Tim", "Тит": "Tit", "Флм": "Phlm", "Евр": "Heb",
  "Откр": "Rev", "Апок": "Apoc",
  "Быт": "Gen", "Исх": "Ex", "Лев": "Lev", "Чис": "Num", "Втор": "Deut",
  "Нав": "Josh", "Суд": "Judg", "Руфь": "Ruth", "1Цар": "1Sam", "2Цар": "2Sam",
  "3Цар": "1Kgs", "4Цар": "2Kgs", "Иов": "Job", "Пс": "Ps", "Притч": "Prov",
  "Еккл": "Eccl", "Песн": "Song", "Ис": "Isa", "Иер": "Jer", "Иез": "Ezek",
  "Дан": "Dan", "Иоил": "Joel", "Ион": "Jonah", "Мих": "Mic", "Авв": "Hab",
  "Соф": "Zeph", "Зах": "Zech", "Мал": "Mal", "Прем": "Wis", "Сир": "Sir"
};

// In-memory cache and in-flight request deduplication for chapters
const CHAPTER_MEMORY_CACHE = new Map<string, BibleVerse[]>();
const IN_FLIGHT_CHAPTERS = new Map<string, Promise<BibleVerse[]>>();

async function getChapterVerses(bookId: number, chapter: number): Promise<BibleVerse[]> {
  const cacheKey = `${bookId}-${chapter}`;
  if (CHAPTER_MEMORY_CACHE.has(cacheKey)) {
    return CHAPTER_MEMORY_CACHE.get(cacheKey)!;
  }

  // Try persistent localStorage cache on client
  const storageKey = `ortho_synod_ch_${cacheKey}`;
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const cachedStr = localStorage.getItem(storageKey);
      if (cachedStr) {
        const parsed: BibleVerse[] = JSON.parse(cachedStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          CHAPTER_MEMORY_CACHE.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch {
      // ignore storage read error
    }
  }

  if (IN_FLIGHT_CHAPTERS.has(cacheKey)) {
    return IN_FLIGHT_CHAPTERS.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const url = `https://bolls.life/get-chapter/SYNOD/${bookId}/${chapter}/`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Bolls API error: ${res.status}`);
      }
      const data: BibleVerse[] = await res.json();
      CHAPTER_MEMORY_CACHE.set(cacheKey, data);

      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch {
          // ignore quota error
        }
      }
      return data;
    } finally {
      IN_FLIGHT_CHAPTERS.delete(cacheKey);
    }
  })();

  IN_FLIGHT_CHAPTERS.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export function extractRefsFromDayTexts(texts?: { text: string; refs?: string[] }[]): string[] {
  if (!texts || texts.length === 0) return [];
  const refs: string[] = [];

  for (const t of texts) {
    if (Array.isArray(t.refs) && t.refs.length > 0) {
      refs.push(...t.refs);
    }
    if (t.text) {
      // 1. Azbyka bibref links: href="https://azbyka.ru/biblia/?Jn.10:9-16"
      const linkMatches = [...t.text.matchAll(/href="https:\/\/azbyka\.ru\/biblia\/\?([^"#]+)"/g)];
      for (const m of linkMatches) {
        refs.push(decodeURIComponent(m[1]));
      }
      // 2. Latin abbreviations: e.g. Jn.10:9-16
      const rawMatches = [...t.text.matchAll(/\b([1-3]?[A-Za-z]+)\.(\d+:\d+(?:[–-]\d+(?::\d+)?)?(?:,\s*\d+(?::\d+(?:[–-]\d+)?)?)*)/g)];
      for (const m of rawMatches) {
        refs.push(`${m[1]}.${m[2].replace(/\s+/g, '')}`);
      }
      // 3. Russian abbreviations: e.g. Ин. 10:9–16, Гал. 6:11–18, 1Кор. 16:13-24
      const cleanPlain = t.text.replace(/&ndash;/g, "-").replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, " ");
      const ruMatches = [...cleanPlain.matchAll(/(?:^|[\s(;—–-])([1-4]?[А-ЯЁ][а-яё]+)\.\s*(\d+:\d+(?:\s*[–-]\s*\d+(?::\d+)?)?(?:\s*,\s*\d+(?::\d+(?:\s*[–-]\s*\d+)?)?)*)/g)];
      for (const m of ruMatches) {
        const ruBook = m[1];
        const code = RU_ABBR_TO_CODE[ruBook];
        if (code) {
          refs.push(`${code}.${m[2].replace(/\s+/g, '')}`);
        }
      }
    }
  }

  return Array.from(new Set(refs.map(r => r.trim().replace(/[–—]/g, "-").replace(/\*+$/, "")).filter(Boolean)));
}

// In-memory cache for fetched reading cards by ref+summary signature
const REF_CARD_MEMORY_CACHE = new Map<string, BibleVerse[]>();

function buildVerseNumbers(startV: number, endV: number): number[] {
  const safeStart = Math.max(1, startV || 1);
  const safeEnd = Math.min(safeStart + 80, Math.max(safeStart, endV || safeStart));
  const arr: number[] = [];
  for (let v = safeStart; v <= safeEnd; v++) {
    arr.push(v);
  }
  return arr;
}

export async function fetchReadingsFromRefs(
  refs: string[],
  rawHtmlSummary: string = ""
): Promise<string> {
  const seenRefs = new Set<string>();
  const validParsed: { cleanRef: string; parsed: ParsedRef }[] = [];

  for (const rawRef of refs) {
    const cleanRef = rawRef.trim().replace(/[–—]/g, "-").replace(/\*+$/, "");
    if (!cleanRef || seenRefs.has(cleanRef)) continue;
    seenRefs.add(cleanRef);

    const parsed = parseScriptureRef(cleanRef);
    if (parsed) {
      validParsed.push({ cleanRef, parsed });
    }
  }

  if (validParsed.length === 0) return "";

  // Build batch queries for all uncached references in ONE single HTTP POST request to bolls.life/get-verses/
  interface BatchTask {
    refIndex: number;
    translation: string;
    book: number;
    chapter: number;
    verses: number[];
  }

  const refVersesMap = new Map<number, BibleVerse[]>();
  const batchTasks: BatchTask[] = [];

  validParsed.forEach(({ cleanRef, parsed }, idx) => {
    if (REF_CARD_MEMORY_CACHE.has(cleanRef)) {
      refVersesMap.set(idx, REF_CARD_MEMORY_CACHE.get(cleanRef)!);
      return;
    }

    // Check persistent localStorage cache for this specific ref
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const cached = localStorage.getItem(`ortho_synod_ref_${cleanRef}`);
        if (cached) {
          const parsedVerses: BibleVerse[] = JSON.parse(cached);
          if (Array.isArray(parsedVerses) && parsedVerses.length > 0) {
            REF_CARD_MEMORY_CACHE.set(cleanRef, parsedVerses);
            refVersesMap.set(idx, parsedVerses);
            return;
          }
        }
      } catch {
        // ignore storage error
      }
    }

    refVersesMap.set(idx, []);
    for (const seg of parsed.segments) {
      if (seg.startCh === seg.endCh) {
        batchTasks.push({
          refIndex: idx,
          translation: "SYNOD",
          book: parsed.bookInfo.id,
          chapter: seg.startCh,
          verses: buildVerseNumbers(seg.startV, seg.endV)
        });
      } else {
        for (let ch = seg.startCh; ch <= seg.endCh; ch++) {
          if (ch === seg.startCh) {
            batchTasks.push({
              refIndex: idx,
              translation: "SYNOD",
              book: parsed.bookInfo.id,
              chapter: ch,
              verses: buildVerseNumbers(seg.startV, seg.startV + 65)
            });
          } else if (ch === seg.endCh) {
            batchTasks.push({
              refIndex: idx,
              translation: "SYNOD",
              book: parsed.bookInfo.id,
              chapter: ch,
              verses: buildVerseNumbers(1, seg.endV)
            });
          } else {
            batchTasks.push({
              refIndex: idx,
              translation: "SYNOD",
              book: parsed.bookInfo.id,
              chapter: ch,
              verses: buildVerseNumbers(1, 70)
            });
          }
        }
      }
    }
  });

  if (batchTasks.length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch("https://bolls.life/get-verses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          batchTasks.map(t => ({
            translation: t.translation,
            book: t.book,
            chapter: t.chapter,
            verses: t.verses
          }))
        ),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Bolls batch API error: ${res.status}`);
      }

      const batchResults: BibleVerse[][] = await res.json();
      batchResults.forEach((versesArr, taskIdx) => {
        const task = batchTasks[taskIdx];
        if (task && Array.isArray(versesArr)) {
          const list = refVersesMap.get(task.refIndex) || [];
          list.push(...versesArr);
          refVersesMap.set(task.refIndex, list);
        }
      });

      // Cache newly fetched refs in memory & localStorage
      validParsed.forEach(({ cleanRef }, idx) => {
        const fetched = refVersesMap.get(idx);
        if (fetched && fetched.length > 0 && !REF_CARD_MEMORY_CACHE.has(cleanRef)) {
          REF_CARD_MEMORY_CACHE.set(cleanRef, fetched);
          if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            try {
              localStorage.setItem(`ortho_synod_ref_${cleanRef}`, JSON.stringify(fetched));
            } catch {
              // ignore storage quota
            }
          }
        }
      });
    } catch (err) {
      console.warn("Bolls batch get-verses failed, falling back to chapter text:", err);
      // Fallback to individual get-text if batch POST fails
      for (let idx = 0; idx < validParsed.length; idx++) {
        const { cleanRef, parsed } = validParsed[idx];
        if ((refVersesMap.get(idx)?.length || 0) > 0) continue;
        try {
          const verses: BibleVerse[] = [];
          for (const seg of parsed.segments) {
            for (let ch = seg.startCh; ch <= seg.endCh; ch++) {
              const chData = await getChapterVerses(parsed.bookInfo.id, ch);
              if (seg.startCh === seg.endCh) {
                verses.push(...chData.filter(v => v.verse >= seg.startV && v.verse <= seg.endV));
              } else if (ch === seg.startCh) {
                verses.push(...chData.filter(v => v.verse >= seg.startV));
              } else if (ch === seg.endCh) {
                verses.push(...chData.filter(v => v.verse <= seg.endV));
              } else {
                verses.push(...chData);
              }
            }
          }
          if (verses.length > 0) {
            refVersesMap.set(idx, verses);
            REF_CARD_MEMORY_CACHE.set(cleanRef, verses);
          }
        } catch (fallbackErr) {
          console.warn(`Could not fetch fallback chapter for ${cleanRef}:`, fallbackErr);
        }
      }
    }
  }

  const cards: string[] = [];

  validParsed.forEach(({ parsed }, idx) => {
    const verses = refVersesMap.get(idx) || [];
    if (verses.length === 0) return;

    const { bookInfo, passageDisplay } = parsed;

    // Extract liturgical subtitle & zachalo if available in day summary
    let subtitle = `${bookInfo.abbr} ${passageDisplay}`;
    if (rawHtmlSummary) {
      const escapedAbbr = bookInfo.abbr.replace(".", "\\.");
      const reg = new RegExp(
        `([^>.;*]+\\b${escapedAbbr}\\s*\\d+:[^<*]+?(?:\\([^)]*зач[^)]*\\))?)`,
        "i"
      );
      const match = rawHtmlSummary.match(reg);
      if (match) {
        subtitle = match[1]
          .replace(/&ndash;/g, "–")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }

    const versesHtml = verses
      .map(
        v => `
        <p class="mb-3 leading-relaxed text-[var(--color-ink)]/90 text-sm sm:text-base">
          <sup class="text-[var(--color-cinnabar)] font-mono font-bold mr-1.5 text-xs align-super">${v.verse}</sup>
          <span>${v.text.replace(/<[^>]+>/g, "")}</span>
        </p>
      `
      )
      .join("");

    cards.push(`
        <div class="bg-[#fdfbf6] p-5 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm mb-6 space-y-3 hover:shadow-md transition-shadow">
          <div class="border-b border-[var(--color-cinnabar)]/10 pb-2 mb-4">
            <h4 class="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] leading-tight">
              ${bookInfo.title}
            </h4>
            <p class="font-sans text-xs text-[var(--color-ink)]/50 uppercase tracking-wider font-semibold mt-1">
              ${subtitle}
            </p>
          </div>
          <div class="space-y-2 font-sans">
            ${versesHtml}
          </div>
        </div>
      `);
  });

  return cards.join("\n");
}
