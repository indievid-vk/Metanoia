import https from 'https';

https.get('https://rutube.ru/plst/140950/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/"videoId":"([a-zA-Z0-9]+)"/g);
    if (matches) {
      console.log(matches.slice(0, 25));
    } else {
      console.log('No matches found');
      // Let's try to find any video links
      const links = data.match(/\/video\/([a-zA-Z0-9]+)\//g);
      if (links) {
        console.log([...new Set(links)].slice(0, 25));
      } else {
        console.log('No links found');
      }
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
