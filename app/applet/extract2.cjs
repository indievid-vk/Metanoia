const fs = require('fs');
const data = JSON.parse(fs.readFileSync('output3.json', 'utf8'));
const videos = [];

function traverse(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.id && obj.title && obj.description && typeof obj.id === 'string' && obj.id.length === 32) {
      videos.push({ id: obj.id, title: obj.title, description: obj.description });
    }
    Object.values(obj).forEach(traverse);
  }
}

traverse(data);

const uniqueVideos = [];
const seen = new Set();
for (const v of videos) {
  if (!seen.has(v.id)) {
    seen.add(v.id);
    uniqueVideos.push(v);
  }
}

// Sort videos by title or just reverse them if they are in reverse order
// Looking at the titles, they are "ОГЛАШЕНИЕ. Часть 1...", "Часть 2..." etc.
// Let's try to sort them by the part number if possible, or keep original order.
// The original order seems to be 1, 2, 3... wait, let's check.
// Actually, let's just save them and I'll sort them in the app or here.

fs.writeFileSync('src/data/catechesis.json', JSON.stringify(uniqueVideos, null, 2));
