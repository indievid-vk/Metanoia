const fs = require('fs');
const cheerio = require('cheerio');

async function scrape() {
  const baseUrl = 'https://uralzvon.site';
  const mainUrlPath = '/%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B0/evangelskie-zapovedi/';
  
  try {
    const res = await fetch(baseUrl + mainUrlPath);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    fs.writeFileSync('commandments_page.html', html);
    console.log("HTML saved to commandments_page.html");

  } catch (err) {
    console.error(err);
  }
}

scrape();
