import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // 1. Calendar API proxy
  app.get("/api/calendar", async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== "string") {
      res.status(400).json({ error: "date parameter is required in YYYY-MM-DD format" });
      return;
    }

    const calendarUrl = `https://azbyka.ru/days/api/day/${date}.json`;
    try {
      const response = await fetch(calendarUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "ru-RU,ru;q=0.9",
          "Referer": "https://azbyka.ru/"
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from azbyka.ru: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      res.json(json);
    } catch (error) {
      console.error(`Error fetching calendar for date ${date}:`, error);
      res.status(502).json({
        error: "Failed to fetch calendar data from upstream source",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // 2. Bible Readings API proxy
  app.get("/api/bible", async (req, res) => {
    const { date } = req.query;
    
    let bibleUrl = "https://azbyka.ru/biblia/days";
    if (date && typeof date === "string") {
      bibleUrl = `https://azbyka.ru/biblia/days/${date}`;
    }

    try {
      const response = await fetch(bibleUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9",
          "Referer": "https://azbyka.ru/"
        },
        signal: AbortSignal.timeout(12000) // 12s timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from azbyka.ru: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      res.send(html);
    } catch (error) {
      console.error(`Error fetching Bible readings for date ${date}:`, error);
      res.status(502).json({
        error: "Failed to fetch Bible readings from upstream source",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for rendering dev build assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
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
