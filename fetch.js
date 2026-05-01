const https = require('https');

https.get('https://rutube.ru/plst/140950/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/\/video\/([a-zA-Z0-9]+)\//g);
    if (matches) {
      console.log([...new Set(matches)].slice(0, 25));
    } else {
      console.log('No links found');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
