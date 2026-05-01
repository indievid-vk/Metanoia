const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/treby.json', 'utf8'));

data.sections.forEach(sec => {
  if (sec.content) {
    sec.content = sec.content.filter(p => !p.includes('<ul id="toc"'));
  }
});

fs.writeFileSync('src/data/treby.json', JSON.stringify(data, null, 2));
console.log('Done');
