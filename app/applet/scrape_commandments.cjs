import * as fs from 'fs';
import * as cheerio from 'cheerio';

async function scrape() {
  const baseUrl = 'https://uralzvon.site';
  const mainUrlPath = '/%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B0/evangelskie-zapovedi/';
  
  try {
    const res = await fetch(baseUrl + mainUrlPath);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // The main content is usually inside an element, maybe `<div class="entry-content">`
    const links = [];
    $('a').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        // Let's filter useful links
        if (title && href && href.startsWith(baseUrl)) {
            links.push({ title, href });
        }
    });

    fs.writeFileSync('links_dump.json', JSON.stringify(links, null, 2));
    console.log("Saved links to links_dump.json");
    console.log("Found " + links.length + " links");

  } catch (err) {
    console.error(err);
  }
}

scrape();
