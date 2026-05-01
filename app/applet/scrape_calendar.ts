import * as cheerio from 'cheerio';

async function scrape() {
  const res = await fetch('https://azbyka.ru/days/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('Title:', $('title').text());
  
  // Try to find readings
  const readings = [];
  $('.reading').each((i, el) => {
    readings.push($(el).text().trim());
  });
  console.log('Readings class .reading:', readings);
  
  // Try to find feast names
  const feasts = [];
  $('.feast').each((i, el) => {
    feasts.push($(el).text().trim());
  });
  console.log('Feasts class .feast:', feasts);

  // Let's print some general structure
  console.log('H1:', $('h1').text());
  console.log('H2:', $('h2').text());
}

scrape();
