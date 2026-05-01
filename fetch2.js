const https = require('https');
const fs = require('fs');

https.get('https://rutube.ru/api/playlist/140950/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('output2.txt', data);
  });
}).on('error', (err) => {
  fs.writeFileSync('output2.txt', 'Error: ' + err.message);
});
