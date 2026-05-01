import fs from 'fs';
import * as cheerio from 'cheerio';

function extractByAnchors() {
  const toc = JSON.parse(fs.readFileSync('toc.json', 'utf8'));
  
  // We want to map each anchor to the data we want to parse
  const sections = toc.map(t => {
    return {
      title: t.title,
      id: t.href.split('#')[1],
      content: []
    }
  });

  const allHtml = fs.readFileSync('content_page1.html', 'utf8') + '\n\n' + fs.readFileSync('content_page2.html', 'utf8');
  const $ = cheerio.load(allHtml);
  
  let currentSection = null;
  const results = [];
  
  // It's tricky because the anchors might be `<h2 id="z-...">` or `<a name="z-...">`
  // We can just iterate over all elements in `.entry-content`
  $('.entry-content').children().each((i, el) => {
    const $el = $(el);
    let foundId = $el.attr('id') || $el.find('[name],[id]').attr('name') || $el.find('[name],[id]').attr('id');
    
    // Also if there's an anchor directly inside
    if (!foundId && el.tagName === 'a') {
      foundId = $el.attr('name') || $el.attr('id');
    }
    
    if (foundId && foundId.startsWith('z-')) {
      const sec = sections.find(s => s.id === foundId);
      if (sec) {
        if (currentSection && currentSection.content.length > 0) {
           results.push({ title: currentSection.title, content: currentSection.content.join('\n\n') });
        }
        currentSection = { ...sec, content: [] };
        
        // Sometimes the text of the heading is directly beside the anchor or inside it
        // We will just let the title handle it, but wait, the text inside the element itself shouldn't be duplicated?
        // Actually, let's keep the textual content of the element if it has extra text.
      }
    }
    
    if (currentSection) {
      // Avoid adding the heading text into the content? 
      // It's cleaner to remove the heading text to avoid duplication.
      // But it's risky if the heading has useful text. Let's just push text.
      // Wait, if it's the heading, its text will likely be `1.1. Пост` etc. 
      // The `title` property handles it. Let's just avoid the EXACT title text but it's fine if it's there.
      const text = $el.text().trim();
      // Remove the prefix "1. ВОЗДЕРЖАНИЕ" or "1.1. Пост" if it's exactly the title
      if (text && !text.includes(currentSection.title)) {
        currentSection.content.push(text);
      } else if (text && text.length > currentSection.title.length + 5) {
        // Sometimes the text contains the title and some extra text?
        currentSection.content.push(text);
      }
    }
  });

  if (currentSection && currentSection.content.length > 0) {
    results.push({ title: currentSection.title, content: currentSection.content.join('\n\n') });
  }

  fs.writeFileSync('parsed_by_anchors.json', JSON.stringify(results, null, 2));
  console.log(`Parsed ${results.length} sections by anchors.`);
}
extractByAnchors();
