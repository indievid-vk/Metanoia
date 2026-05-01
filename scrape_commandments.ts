import * as fs from 'fs';
import * as cheerio from 'cheerio';

async function scrape() {
  const baseUrl = 'https://uralzvon.site';
  const mainUrlPath = '/%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B0/evangelskie-zapovedi/';
  
  try {
    const res = await fetch(baseUrl + mainUrlPath);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log("Page title:", $('title').text());
    
    $('a').each((i, el) => {
        const title = $(el).text().trim();
        const href = $(el).attr('href');
        if (title && href && href.includes('evangelskie-zapovedi/')) {
            console.log(`Link: ${title} -> ${href}`);
        }
    });

  } catch (err) {
    console.error(err);
  }
}

scrape();
