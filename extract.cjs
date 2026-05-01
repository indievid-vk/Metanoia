const fs = require('fs');
const data = JSON.parse(fs.readFileSync('output3.json', 'utf8'));
const videos = [];

function traverse(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj.videoId && obj.title) {
      videos.push({ id: obj.videoId, title: obj.title });
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

fs.writeFileSync('videos.json', JSON.stringify(uniqueVideos, null, 2));
