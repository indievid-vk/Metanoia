async function checkApi() {
  try {
    const res = await fetch('https://days.pravoslavie.ru/Days/20260407.html', { method: 'OPTIONS' });
    console.log('CORS:', res.headers.get('access-control-allow-origin'));
  } catch (e) {
    console.error(e);
  }
}
checkApi();
