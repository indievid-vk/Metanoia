import Tesseract from 'tesseract.js';

Tesseract.recognize(
  'public/home-bg.jpg',
  'rus',
  { logger: m => {} }
).then((res) => {
  console.log(res.data.text);
});
