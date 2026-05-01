const fs = require('fs');

const commandments = JSON.parse(fs.readFileSync('src/data/commandments.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('scraped_sections.json', 'utf8'));

// Find section 6.5
const section65Index = commandments.findIndex(c => c.title.includes('6.5. О конце света'));
if (section65Index !== -1) {
  let content = commandments[section65Index].content;
  // The junk text starts with "\r \t\t\t\t Просмотры:"
  const junkIndex = content.indexOf('\r \t\t\t\t Просмотры:');
  if (junkIndex !== -1) {
    commandments[section65Index].content = content.substring(0, junkIndex).trim();
  } else {
    // Try another pattern
    const junkIndex2 = content.indexOf('Просмотры:');
    if (junkIndex2 !== -1) {
      commandments[section65Index].content = content.substring(0, junkIndex2).trim();
    }
  }
}

// Append scraped sections
const newCommandments = [...commandments, ...scraped];

fs.writeFileSync('src/data/commandments.json', JSON.stringify(newCommandments, null, 2));
console.log('Updated commandments.json');
