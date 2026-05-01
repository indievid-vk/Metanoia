import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const urls = [
  { id: 'morning', url: 'https://azbyka.ru/molitvoslov/molitvy-utrennie-s-parallelnym-perevodom.html' },
  { id: 'evening', url: 'https://azbyka.ru/molitvoslov/molitvy-na-son-grjadushhim-s-parallelnym-perevodom.html' },
  { id: 'canon-repentance', url: 'https://azbyka.ru/molitvoslov/kanon-pokayannyj-ko-gospodu-nashemu-iisusu-xristu.html' },
  { id: 'canon-theotokos', url: 'https://azbyka.ru/molitvoslov/kanon-molebnyj-ko-presvyatoj-bogorodice.html' },
  { id: 'canon-guardian-angel', url: 'https://azbyka.ru/molitvoslov/kanon-angelu-xranitelyu.html' },
  { id: 'communion-prayers', url: 'https://azbyka.ru/molitvoslov/posledovanie-ko-svyatomu-prichashheniyu.html' },
  { id: 'thanksgiving', url: 'https://azbyka.ru/molitvoslov/blagodarstvennye-molitvy-po-svyatom-prichashhenii.html' }
];

async function scrape() {
  const result: Record<string, any[]> = {};

  for (const item of urls) {
    console.log(`Fetching ${item.id}...`);
    try {
      const res = await fetch(item.url);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const prayers: any[] = [];
      
      // Look for tables first as they might be used in some pages
      const tables = $('table.parallel, table');
      
      if (tables.length > 0 && item.id === 'morning') { // Just an example, let's use the paragraph logic for all if possible
        // Actually, morning and evening might use tables or paragraphs.
        // Let's check if the page has <p class="translate">
      }
      
      const translates = $('.translate');
      if (translates.length > 0) {
        // It uses the paragraph structure
        let currentSlavonic = '';
        let currentHeader = '';
        
        $('.article-single-content').find('p, h2, h3, h4').each((i, el) => {
          const tagName = el.tagName.toLowerCase();
          const text = $(el).text().trim().replace(/\s+/g, ' ');
          const className = $(el).attr('class') || '';
          
          if (!text || text.includes('{"@context"')) return;
          
          if (tagName.startsWith('h') || className.includes('title')) {
            if (currentSlavonic) {
              prayers.push({ slavonic: currentSlavonic, russian: '' });
              currentSlavonic = '';
            }
            prayers.push({ type: 'header', text });
          } else if (className.includes('translate')) {
            if (currentSlavonic) {
              prayers.push({ slavonic: currentSlavonic, russian: text.replace(/^Перевод:\s*/, '') });
              currentSlavonic = '';
            } else {
              // Sometimes translation comes without slavonic?
            }
          } else {
            if (currentSlavonic) {
              // Multiple slavonic paragraphs before translation?
              prayers.push({ slavonic: currentSlavonic, russian: '' });
            }
            currentSlavonic = text;
          }
        });
        
        if (currentSlavonic) {
          prayers.push({ slavonic: currentSlavonic, russian: '' });
        }
      } else if (tables.length > 0) {
        tables.each((i, table) => {
          $(table).find('tr').each((j, tr) => {
            const tds = $(tr).find('td');
            if (tds.length >= 2) {
              const slavonic = $(tds[0]).text().trim().replace(/\s+/g, ' ');
              const russian = $(tds[1]).text().trim().replace(/\s+/g, ' ');
              if (slavonic && russian) {
                prayers.push({ slavonic, russian });
              }
            } else if (tds.length === 1) {
              const text = $(tds[0]).text().trim().replace(/\s+/g, ' ');
              if (text) prayers.push({ type: 'header', text });
            }
          });
        });
      } else {
        // Fallback
        $('.article-single-content p').each((i, p) => {
          const text = $(p).text().trim().replace(/\s+/g, ' ');
          if (text && !text.includes('{"@context"')) {
            prayers.push({ slavonic: text, russian: '' });
          }
        });
      }
      
      result[item.id] = prayers;
      console.log(`Found ${prayers.length} items for ${item.id}`);
    } catch (e) {
      console.error(`Error fetching ${item.id}:`, e);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'src/data/prayers.json'), JSON.stringify(result, null, 2));
  console.log('Done!');
}

scrape();
