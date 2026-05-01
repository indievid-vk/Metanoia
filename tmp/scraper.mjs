import fs from 'fs';
import * as cheerio from 'cheerio';

async function scrape() {
  const baseUrl = 'https://uralzvon.site';
  const mainUrlPath = '/%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B0/evangelskie-zapovedi/';
  
  try {
    const res = await fetch(baseUrl + mainUrlPath);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Select the entry content where the table of contents is
    const toc = [];
    $('.entry-content a').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        if (title && href && href.startsWith('http')) {
            toc.push({ title, href });
        }
    });

    fs.writeFileSync('/tmp/links.json', JSON.stringify(toc, null, 2));
    console.log("Found " + toc.length + " links.");

  } catch (err) {
    console.error(err);
  }
}

scrape();
