import fs from 'fs';
import * as cheerio from 'cheerio';

function parseHtml(htmlFile) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const $ = cheerio.load(html);
  
  const results = [];
  let currentTitle = null;
  let currentContent = [];
  
  // The structure seems to have anchors for each section, e.g. <a id="z-1-1"></a> или <h2 id="z-1-1">...
  // Let's iterate over ALL elements inside the main content area (e.g. .entry-content)
  $('.entry-content').children().each((i, el) => {
    const text = $(el).text().trim();
    
    // Check if it's a heading for a section
    // E.g. <h2><strong>1. ВОЗДЕРЖАНИЕ</strong></h2> or similar
    // Or it has an id like id="z-..."
    // We can just rely on the text pattern "1. " or "1.1. " 
    const isHeadingTag = ['h2', 'h3', 'h4', 'h5'].includes(el.tagName.toLowerCase());
    
    // Some titles might be in <p><strong>...</strong></p>
    const isStrongP = el.tagName.toLowerCase() === 'p' && $(el).find('strong').length > 0 && $(el).text().trim().match(/^[0-9]+(\.[0-9]+)*\./);
    
    // Let's assume ANY element that has an `id` starting with `z-` is a target anchor? Sometimes the anchor is an empty `<a name="z-1-1"></a>` PRECEDING the title.
    
    if (isHeadingTag || isStrongP) {
      if (currentTitle) {
        results.push({ title: currentTitle, content: currentContent.join('\n\n') });
      }
      currentTitle = text;
      currentContent = [];
    } else {
      if (text) {
        currentContent.push(text);
      }
    }
  });

  if (currentTitle) {
    results.push({ title: currentTitle, content: currentContent.join('\n\n') });
  }
  
  return results;
}

const page1 = parseHtml('content_page1.html');
const page2 = parseHtml('content_page2.html');

const allContent = [...page1, ...page2];
fs.writeFileSync('all_content.json', JSON.stringify(allContent, null, 2));
console.log(`Parsed ${allContent.length} sections`);
