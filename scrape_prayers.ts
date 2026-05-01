import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function scrapePrayers(url: string, id: string) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const prayers: any[] = [];
  const table = $('table').first();
  
  if (table.length) {
    table.find('tr').each((i, row) => {
      const cols = $(row).find('td');
      
      if (cols.length === 1) {
        // It's a header or instruction
        const text = $(cols[0]).text().trim();
        if (text) {
          prayers.push({
            type: 'header',
            text: text
          });
        }
      } else if (cols.length >= 2) {
        // It's a prayer with translation
        const slavonic = $(cols[0]).text().trim();
        const russian = $(cols[1]).text().trim();
        
        if (slavonic || russian) {
          prayers.push({
            slavonic: slavonic,
            russian: russian
          });
        }
      }
    });
  }
  
  return prayers;
}

async function main() {
  const morning = await scrapePrayers('https://azbyka.ru/molitvoslov/molitvy-utrennie-s-parallelnym-perevodom.html', 'morning');
  const evening = await scrapePrayers('https://azbyka.ru/molitvoslov/molitvy-na-son-grjadushhim-s-parallelnym-perevodom.html', 'evening');
  
  const existingPrayers = JSON.parse(fs.readFileSync('src/data/prayers.json', 'utf8'));
  
  existingPrayers['morning'] = morning;
  existingPrayers['evening'] = evening;
  
  fs.writeFileSync('src/data/prayers.json', JSON.stringify(existingPrayers, null, 2));
  console.log('Updated prayers.json');
}

main();
