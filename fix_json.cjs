const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/templeRules.json', 'utf8'));

data.sections.forEach(sec => {
  if (sec.title === 'О устройстве храма') {
    sec.title = 'Об устройстве Храма';
  }
  
  if (sec.content) {
    sec.content = sec.content.filter(p => !p.includes('<img'));
  }
  
  if (sec.subsections) {
    sec.subsections.forEach(sub => {
      if (sub.content) {
        sub.content = sub.content.filter(p => !p.includes('<img'));
      }
    });
  }
});

fs.writeFileSync('src/data/templeRules.json', JSON.stringify(data, null, 2));
console.log('Done');
