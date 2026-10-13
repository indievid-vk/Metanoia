import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fetchReadingsFromRefs, extractRefsFromDayTexts } from "./src/utils/bollsBible";

const calendarCache = new Map<string, { data: any; expiresAt: number }>();
const bibleCache = new Map<string, { data: string; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchWithRetry(url: string, headers: Record<string, string>, retries = 2, timeoutMs = 12000): Promise<Response> {
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
    } catch (e) {
      lastError = e;
    }
    // Small backoff before retry
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // 1. Calendar API proxy with memory caching
  app.get("/api/calendar", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { date } = req.query;
    if (!date || typeof date !== "string") {
      res.status(400).json({ error: "date parameter is required in YYYY-MM-DD format" });
      return;
    }

    const cached = calendarCache.get(date);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json(cached.data);
      return;
    }

    const calendarUrl = `https://azbyka.ru/days/api/day/${date}.json`;
    try {
      const response = await fetchWithRetry(calendarUrl, {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Referer": "https://azbyka.ru/"
      });

      const json = await response.json();
      calendarCache.set(date, {
        data: json,
        expiresAt: Date.now() + CACHE_TTL_MS
      });

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json(json);
    } catch (error) {
      console.error(`Error fetching calendar for date ${date}:`, error);
      res.status(502).json({
        error: "Failed to fetch calendar data from upstream source",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // 2. Bible Readings API proxy with memory caching
  const BOOK_NAMES: Record<string, string> = {
    Mt: "Евангелие от Матфея",
    Mk: "Евангелие от Марка",
    Lk: "Евангелие от Луки",
    Jn: "Евангелие от Иоанна",
    Act: "Деяния святых апостолов",
    Jas: "Соборное послание святого апостола Иакова",
    "1Pet": "Первое послание апостола Петра",
    "2Pet": "Второе послание апостола Петра",
    "1Jn": "Первое послание апостола Иоанна",
    "2Jn": "Второе послание апостола Иоанна",
    "3Jn": "Третье послание апостола Иоанна",
    Jud: "Послание апостола Иуды",
    Rom: "Послание к Римлянам",
    "1Cor": "Первое послание к Коринфянам",
    "2Cor": "Второе послание к Коринфянам",
    Gal: "Послание к Галатам",
    Eph: "Послание к Ефесянам",
    Phil: "Послание к Филиппийцам",
    Col: "Послание к Колоссянам",
    "1Thess": "Первое послание к Фессалоникийцам",
    "2Thess": "Второе послание к Фессалоникийцам",
    "1Tim": "Первое послание к Тимофею",
    "2Tim": "Второе послание к Тимофею",
    Tit: "Послание к Титу",
    Phlm: "Послание к Филимону",
    Heb: "Послание к Евреям",
    Hebr: "Послание к Евреям",
    "1Thes": "Первое послание к Фессалоникийцам",
    "2Thes": "Второе послание к Фессалоникийцам",
    Apoc: "Откровение Иоанна Богослова",
    Rev: "Откровение Иоанна Богослова"
  };

  const BOOK_RU_ABBR: Record<string, string> = {
    Mt: "Мф.", Mk: "Мк.", Lk: "Лк.", Jn: "Ин.", Act: "Деян.", Jas: "Иак.",
    "1Pet": "1Пет.", "2Pet": "2Пет.", "1Jn": "1Ин.", "2Jn": "2Ин.", "3Jn": "3Ин.",
    Jud: "Иуд.", Rom: "Рим.", "1Cor": "1Кор.", "2Cor": "2Кор.", Gal: "Гал.",
    Eph: "Еф.", Phil: "Флп.", Col: "Кол.", "1Thess": "1Фес.", "2Thess": "2Фес.",
    "1Thes": "1Фес.", "2Thes": "2Фес.",
    "1Tim": "1Тим.", "2Tim": "2Тим.", Tit: "Тит.", Phlm: "Флм.", Heb: "Евр.", Hebr: "Евр.",
    Apoc: "Откр.", Rev: "Откр."
  };

  app.options(["/api/bible", "/api/calendar"], (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.sendStatus(204);
  });

  app.get("/api/bible", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { date } = req.query;
    
    let targetDate = typeof date === "string" && date ? date : new Date().toISOString().split("T")[0];

    const cached = bibleCache.get(targetDate);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(cached.data);
      return;
    }

    try {
      let readingCards: string[] = [];

      // Tier 1: Directly fetch and parse https://azbyka.ru/biblia/days/${targetDate}
      try {
        const bibliaDaysUrl = `https://azbyka.ru/biblia/days/${targetDate}`;
        const response = await fetchWithRetry(bibliaDaysUrl, {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Referer": "https://azbyka.ru/"
        }, 1, 8000);

        const html = await response.text();
        const readingSections = html.split(/<div\b(?=[^>]*\bclass="[^"]*days__book-title[^"]*")(?=[^>]*\bid="reading-\d+")[^>]*>/i);

        for (let i = 1; i < readingSections.length; i++) {
          const section = readingSections[i];
          const h2Match = section.match(/<h2>([\s\S]*?)<\/h2>/i);
          let titleText = "";
          let subtitleText = "";
          if (h2Match) {
            const h2 = h2Match[1];
            const subMatch = h2.match(/<span[^>]*class="[^"]*h2-subtitle[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
            subtitleText = subMatch ? subMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
            titleText = h2.replace(/<span[^>]*class="[^"]*h2-subtitle[^"]*"[^>]*>[\s\S]*?<\/span>/i, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          }

          const verseDivs = [...section.matchAll(/<div\b([^>]*)class="[^"]*\bverse\b[^"]*\blang-r\b[^"]*"([^>]*)>([\s\S]*?)<\/div>/gi)];
          const versesHtml: string[] = [];
          for (const m of verseDivs) {
            const attrs = m[1] + " " + m[2];
            const lineNum = attrs.match(/data-line="([^"]+)"/)?.[1] || "";
            let cleanText = m[3]
              .replace(/<span[^>]*class="[^"]*checkbox[^"]*"[^>]*><\/span>/gi, "")
              .replace(/<span[^>]*class="zachala"[^>]*>[\s\S]*?<\/span>/gi, "")
              .replace(/\[\s*\]/g, "")
              .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, "$1")
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim();
            if (cleanText) {
              versesHtml.push(`
                <p class="mb-3 leading-relaxed text-[var(--color-ink)]/90 text-sm sm:text-base">
                  <sup class="text-[var(--color-cinnabar)] font-mono font-bold mr-1.5 text-xs align-super">${lineNum}</sup>
                  <span>${cleanText}</span>
                </p>
              `);
            }
          }

          if (titleText && versesHtml.length > 0) {
            readingCards.push(`
              <div class="bg-[#fdfbf6] p-5 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm mb-6 space-y-3 hover:shadow-md transition-shadow">
                <div class="border-b border-[var(--color-cinnabar)]/10 pb-2 mb-4">
                  <h4 class="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] leading-tight">
                    ${titleText}
                  </h4>
                  <p class="font-sans text-xs text-[var(--color-ink)]/50 uppercase tracking-wider font-semibold mt-1">
                    ${subtitleText}
                  </p>
                </div>
                <div class="space-y-2 font-sans">
                  ${versesHtml.join("")}
                </div>
              </div>
            `);
          }
        }
      } catch (tier1Err) {
        console.warn(`Direct fetch of /biblia/days/${targetDate} failed, falling back to calendar refs:`, tier1Err);
      }

      // Tier 2: Fallback to calendar day metadata refs if Tier 1 returned no cards
      if (readingCards.length === 0) {
        const dayUrl = `https://azbyka.ru/days/api/day/${targetDate}.json`;
        const dayResponse = await fetchWithRetry(dayUrl, {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Referer": "https://azbyka.ru/"
        });

        const dayJson = await dayResponse.json();
        let rawRefs: string[] = dayJson.texts?.[0]?.refs || [];

        if (rawRefs.length === 0 && dayJson.texts?.[0]?.text) {
          const matches = [...(dayJson.texts[0].text as string).matchAll(/href="https:\/\/azbyka\.ru\/biblia\/\?([^"#]+)"/g)];
          rawRefs = matches.map(m => m[1]);
        }

        const uniqueRefs = Array.from(new Set(rawRefs)).slice(0, 10);
        for (const ref of uniqueRefs) {
          try {
            const bibUrl = `https://azbyka.ru/biblia/?${encodeURIComponent(ref)}`;
            const bibRes = await fetchWithRetry(bibUrl, {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "Referer": `https://azbyka.ru/days/${targetDate}`
            }, 1, 8000);

            const html = await bibRes.text();
            const verseDivs = [...html.matchAll(/<div\b([^>]*)class="[^"]*verse\s+lang-r[^"]*crossref-verse[^"]*"([^>]*)>([\s\S]*?)<\/div>/gi)];

            const dotIdx = ref.indexOf(".");
            const bookCode = dotIdx !== -1 ? ref.slice(0, dotIdx) : ref;
            const passagePart = dotIdx !== -1 ? ref.slice(dotIdx + 1) : "";
            const bookTitle = BOOK_NAMES[bookCode] || (bookCode.startsWith("Lk") || bookCode.startsWith("Mt") || bookCode.startsWith("Mk") || bookCode.startsWith("Jn") ? "Святое Евангелие" : "Апостольское чтение");
            const bookAbbr = BOOK_RU_ABBR[bookCode] || bookCode;
            const citationDisplay = `${bookAbbr} ${passagePart}`;

            const versesHtml: string[] = [];
            for (const m of verseDivs) {
              const attrs = m[1] + " " + m[2];
              const lineNum = attrs.match(/data-line="([^"]+)"/)?.[1] || "";
              let cleanText = m[3]
                .replace(/<span[^>]*class="[^"]*checkbox[^"]*"[^>]*><\/span>/gi, "")
                .replace(/<span[^>]*class="zachala"[^>]*>[\s\S]*?<\/span>/gi, "")
                .replace(/\[\s*\]/g, "")
                .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, "$1")
                .replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim();

              if (cleanText) {
                versesHtml.push(`
                  <p class="mb-3 leading-relaxed text-[var(--color-ink)]/90 text-sm sm:text-base">
                    <sup class="text-[var(--color-cinnabar)] font-mono font-bold mr-1.5 text-xs align-super">${lineNum}</sup>
                    <span>${cleanText}</span>
                  </p>
                `);
              }
            }

            if (versesHtml.length > 0) {
              readingCards.push(`
                <div class="bg-[#fdfbf6] p-5 rounded-2xl border border-[var(--color-cinnabar)]/10 shadow-sm mb-6 space-y-3 hover:shadow-md transition-shadow">
                  <div class="border-b border-[var(--color-cinnabar)]/10 pb-2 mb-4">
                    <h4 class="font-izhitsa text-lg sm:text-xl text-[var(--color-cinnabar)] leading-tight">
                      ${bookTitle}
                    </h4>
                    <p class="font-sans text-xs text-[var(--color-ink)]/50 uppercase tracking-wider font-semibold mt-1">
                      ${citationDisplay}
                    </p>
                  </div>
                  <div class="space-y-2 font-sans">
                    ${versesHtml.join("")}
                  </div>
                </div>
              `);
            }
          } catch (verseErr) {
            console.warn(`Could not load verses for ref ${ref}:`, verseErr);
          }
        }
      }

      // Tier 3: If Tier 1 & Tier 2 yielded no cards, fetch authentic Synodal lectionary via Bolls Bible
      if (readingCards.length === 0) {
        try {
          const dayUrl = `https://azbyka.ru/days/api/day/${targetDate}.json`;
          const dayRes = await fetchWithRetry(dayUrl, {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*"
          }, 1, 6000);
          const dayJson = await dayRes.json();
          const refs = extractRefsFromDayTexts(dayJson.texts);
          if (refs.length > 0) {
            const bollsHtml = await fetchReadingsFromRefs(refs, dayJson.texts?.[0]?.text || "");
            if (bollsHtml && bollsHtml.trim().length > 100) {
              readingCards.push(bollsHtml);
            }
          }
        } catch (tier3Err) {
          console.warn(`Tier 3 Bolls lectionary fetch failed for ${targetDate}:`, tier3Err);
        }
      }

      if (readingCards.length === 0) {
        throw new Error("Не удалось извлечь стихи богослужебных чтений");
      }

      const fullHtml = readingCards.join("\n");
      bibleCache.set(targetDate, {
        data: fullHtml,
        expiresAt: Date.now() + CACHE_TTL_MS
      });

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(fullHtml);
    } catch (error) {
      console.error(`Error fetching Bible readings for date ${targetDate}:`, error);
      res.status(502).json({
        error: "Failed to fetch Bible readings from upstream source",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const distPath = path.join(process.cwd(), "dist");

  // PWA Core handlers: Always serve ServiceWorker, Workbox, and Manifest with correct headers
  app.get(["/sw.js", "/dist/sw.js"], (req, res, next) => {
    const swPath = path.join(distPath, "sw.js");
    if (fs.existsSync(swPath)) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      res.setHeader("Service-Worker-Allowed", "/");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(swPath);
      return;
    }
    next();
  });

  app.get(["/registerSW.js", "/dist/registerSW.js"], (req, res) => {
    const regPath = path.join(distPath, "registerSW.js");
    const publicRegPath = path.join(process.cwd(), "public", "registerSW.js");
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    if (fs.existsSync(regPath)) {
      res.sendFile(regPath);
    } else if (fs.existsSync(publicRegPath)) {
      res.sendFile(publicRegPath);
    } else {
      res.send(`if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js'); }); }`);
    }
  });

  app.get(/^\/workbox-[a-zA-Z0-9]+\.js$/, (req, res, next) => {
    const cleanUrl = req.url.split("?")[0].replace(/^\//, "");
    const wbPath = path.join(distPath, cleanUrl);
    if (fs.existsSync(wbPath)) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.sendFile(wbPath);
      return;
    }
    next();
  });

  app.get(["/manifest.webmanifest", "/dist/manifest.webmanifest"], (req, res) => {
    const manifestPath = path.join(distPath, "manifest.webmanifest");
    const publicManifest = path.join(process.cwd(), "public", "manifest.json");
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    if (fs.existsSync(manifestPath)) {
      res.sendFile(manifestPath);
    } else if (fs.existsSync(publicManifest)) {
      res.sendFile(publicManifest);
    } else {
      res.status(404).send("Manifest not found");
    }
  });

  app.get(["/icon_256.png", "/public/icon_256.png"], (req, res) => {
    const iconPath = path.join(process.cwd(), "public", "icon_256.png");
    if (fs.existsSync(iconPath)) {
      res.setHeader("Content-Type", "image/png");
      res.sendFile(iconPath);
      return;
    }
    res.status(404).send("icon_256.png not found");
  });

  // Vite middleware for rendering dev build assets or static serving for production
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, "index.html"));
  if (process.env.NODE_ENV === "production" && hasDist) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
