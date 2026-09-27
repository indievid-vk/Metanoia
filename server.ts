import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

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
  app.get("/api/bible", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { date } = req.query;
    
    let targetDate = typeof date === "string" && date ? date : new Date().toISOString().split("T")[0];
    const bibleUrl = `https://azbyka.ru/biblia/days/${targetDate}`;

    const cached = bibleCache.get(targetDate);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(cached.data);
      return;
    }

    try {
      const response = await fetchWithRetry(bibleUrl, {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Referer": "https://azbyka.ru/"
      });

      const html = await response.text();
      bibleCache.set(targetDate, {
        data: html,
        expiresAt: Date.now() + CACHE_TTL_MS
      });

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(html);
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

  // Vite middleware for rendering dev build assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
