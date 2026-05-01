const cheerio = require('cheerio');
const fs = require('fs');

async function fetchContent() {
  const res = await fetch('https://azbyka.ru/zapiska-cerkovnaya');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const sections = [];
  let currentSection = null;
  let currentSubsection = null;
  
  const contentNode = $('.article-single-content');
  
  contentNode.children().each((i, el) => {
    const tag = el.tagName.toLowerCase();
    const text = $(el).text().trim();
    const htmlContent = $(el).html() ? $(el).html().trim() : '';
    
    if (tag === 'h2') {
      if (text === 'Ещё статьи о воспитании' || text.includes('комментари')) return false; // stop
      currentSection = {
        id: 'sec_' + sections.length,
        title: text,
        content: [],
        subsections: []
      };
      sections.push(currentSection);
      currentSubsection = null;
    } else if (tag === 'h3') {
      if (currentSection) {
        currentSubsection = {
          id: 'subsec_' + currentSection.subsections.length,
          title: text,
          content: []
        };
        currentSection.subsections.push(currentSubsection);
      }
    } else if (tag === 'p' || tag === 'ul' || tag === 'ol' || tag === 'div') {
      // Avoid empty paragraphs or utility divs
      // The user requested NO images, so we strip out <img> tags
      if (text) {
        // Remove img tags from htmlContent
        const cleanHtml = htmlContent.replace(/<img[^>]*>/g, '');
        if (cleanHtml.trim()) {
          if (currentSubsection) {
            currentSubsection.content.push(cleanHtml);
          } else if (currentSection) {
            currentSection.content.push(cleanHtml);
          } else {
            // If there's no section yet, create a default one
            currentSection = {
              id: 'sec_' + sections.length,
              title: 'Введение',
              content: [cleanHtml],
              subsections: []
            };
            sections.push(currentSection);
          }
        }
      }
    }
  });
  
  fs.writeFileSync('src/data/treby.json', JSON.stringify({
    title: "Записка церковная (по материалам сайта azbyka.ru)",
    sections: sections
  }, null, 2));
  
  console.log('Successfully saved to src/data/treby.json');
}

fetchContent().catch(console.error);
