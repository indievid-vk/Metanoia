import fs from 'fs';

const html = fs.readFileSync('page.html', 'utf8');
const regex = /<p[^>]*><strong>(.*?)<\/strong><\/p>([\s\S]*?)(?=<p[^>]*><strong>|$)/g;
let match;
const sections = [];
while ((match = regex.exec(html)) !== null) {
  const title = match[1].replace(/<[^>]+>/g, '').trim();
  const content = match[2].replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim();
  if (title && content && title.match(/^\d+\./)) {
    sections.push({ title, content });
  }
}
fs.writeFileSync('commandments.json', JSON.stringify(sections, null, 2));
