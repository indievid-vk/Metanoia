import fs from 'fs';
import * as cheerio from 'cheerio';

async function fetchAndSave() {
  const urls = [
    'https://uralzvon.site/%d1%85%d1%80%d0%b8%d1%81%d1%82%d0%b8%d0%b0%d0%bd%d1%81%d0%ba%d0%b8%d0%b5-%d0%b4%d0%be%d0%b1%d1%80%d0%be%d0%b4%d0%b5%d1%82%d0%b5%d0%bb%d0%b8-%d1%81%d0%be%d0%b3%d0%bb%d0%b0%d1%81%d0%bd%d0%be-%d0%b5-2/',
    'https://uralzvon.site/%d1%85%d1%80%d0%b8%d1%81%d1%82%d0%b8%d0%b0%d0%bd%d1%81%d0%ba%d0%b8%d0%b5-%d0%b4%d0%be%d0%b1%d1%80%d0%be%d0%b4%d0%b5%d1%82%d0%b5%d0%bb%d0%b8-%d1%81%d0%be%d0%b3%d0%bb%d0%b0%d1%81%d0%bd%d0%be-%d0%b5/'
  ];
  
  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i]);
    const html = await res.text();
    fs.writeFileSync(`content_page${i + 1}.html`, html);
    console.log(`Saved page ${i + 1}`);
  }
}

fetchAndSave();
