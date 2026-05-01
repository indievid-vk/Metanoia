import * as cheerio from 'cheerio';

async function test() {
  const res = await fetch('https://azbyka.ru/molitvoslov/posledovanie-ko-svyatomu-prichashheniyu.html');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const article = $('article');
  
  // Find tables or divs that contain the text
  console.log('Tables:', article.find('table').length);
  console.log('Divs with row:', article.find('.row').length);
  
  // Let's just print the first few elements with text inside the article
  article.find('p, div').slice(0, 20).each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const className = $(el).attr('class');
    if (text && text.length > 20) {
      console.log(`[${el.tagName}] class="${className}": ${text.substring(0, 100)}...`);
    }
  });
}

test();
