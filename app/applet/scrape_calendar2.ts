import * as cheerio from 'cheerio';

async function scrape() {
  const res = await fetch('https://azbyka.ru/days/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // Find the container for readings
  console.log('Readings text:', $('a[href*="biblia"]').parent().text());
  
  // Find the container for feasts
  console.log('Feasts:', $('a[href*="svyat"]').parent().text());
}

scrape();
