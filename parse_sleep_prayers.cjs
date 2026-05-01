const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('sleep_prayers_html.txt', 'utf8');
const $ = cheerio.load(html);

const prayers = [];

// We will iterate through the children of the main container.
// Or we can just select all relevant tags.
// The structure is usually:
// <h2>Title</h2>
// <p class="paint">Slavonic text</p>
// <p class="translate">Russian text</p>
// Sometimes there are <p> without class, or <ol> with <li>.
// Let's just iterate over all children of the root.

const rootElements = $.root().children();

// Actually, cheerio.load(html) puts everything in <html><body>...
const bodyChildren = $('body').children();

let currentHeader = null;
let currentSlavonic = null;
let currentRussian = null;

// The page has two sections (for men and for women). We only need the first one.
// The second section starts with <h2>Молитва 1-я, прп. Макария Великого (†390), к Богу Отцу</h2> again around line 289.
// Let's stop when we see the second "Молитва 1-я".

let seenFirstPrayer = false;

$('.article-single-content').find('*').each((i, el) => {
  const tagName = el.tagName.toLowerCase();
  const $el = $(el);
  
  if (tagName === 'h2') {
    const text = $el.text().trim();
    if (text.includes('Молитва 1-я')) {
      if (seenFirstPrayer) {
        // Stop here, this is the women's section
        return false;
      }
      seenFirstPrayer = true;
    }
    prayers.push({
      type: 'header',
      text: text
    });
  } else if (tagName === 'p') {
    if ($el.hasClass('paint')) {
      currentSlavonic = $el.text().trim();
    } else if ($el.hasClass('translate')) {
      currentRussian = $el.text().trim();
      if (currentSlavonic && currentRussian) {
        prayers.push({
          slavonic: currentSlavonic,
          russian: currentRussian
        });
        currentSlavonic = null;
        currentRussian = null;
      }
    } else if (!$el.find('img').length && $el.text().trim() && !$el.hasClass('center')) {
      // Some other text, maybe introductory
      // Let's add it as headers.
      // But only if it's a direct child or similar
      if ($el.parent().hasClass('article-single-content')) {
        prayers.push({
          type: 'header',
          text: $el.text().trim()
        });
      }
    }
  }
});

// Read existing prayers.json
const prayersJson = JSON.parse(fs.readFileSync('src/data/prayers.json', 'utf8'));
prayersJson.evening = prayers;

fs.writeFileSync('src/data/prayers.json', JSON.stringify(prayersJson, null, 2));
console.log('Updated prayers.json with evening prayers');
