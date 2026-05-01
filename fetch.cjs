const https = require('https');
https.get('https://uralzvon.site/%D1%85%D1%80%D0%B8%D1%81%D1%82%D0%B8%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B5-%D0%B4%D0%BE%D0%B1%D1%80%D0%BE%D0%B4%D0%B5%D1%82%D0%B5%D0%BB%D0%B8-%D1%81%D0%BE%D0%B3%D0%BB%D0%B0%D1%81%D0%BD%D0%BE-%D0%B5-2/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/<p>.*?<\/p>/g);
    if (matches) {
      const texts = matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 20);
      console.log(JSON.stringify(texts.slice(0, 20), null, 2));
    }
  });
}).on('error', (err) => {
  console.error(err);
});
