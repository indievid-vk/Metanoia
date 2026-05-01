const fs = require('fs');
const cheerio = require('cheerio');

async function fetchSleepPrayers() {
  try {
    const response = await fetch('https://azbyka.ru/molitvoslov/molitvy-na-son-gryadushhim-bez-tolkovanij.html');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const prayers = [];
    
    // The content is usually inside an article or main content area.
    // We need to find the pairs of slavonic and russian text.
    // Often azbyka uses <p class="cs"> for slavonic and <p class="ru"> for russian, or similar.
    // Let's just dump the HTML of the main content to see its structure.
    const mainContent = $('.entry-content').html() || $('.content').html() || $('article').html();
    fs.writeFileSync('sleep_prayers_html.txt', mainContent);
    console.log('HTML saved to sleep_prayers_html.txt');
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchSleepPrayers();
