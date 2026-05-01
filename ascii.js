import { Jimp } from 'jimp';

async function main() {
  const image = await Jimp.read('public/home-bg.jpg');
  image.resize({ w: 40, h: 80 });
  
  const chars = ' .:-=+*#%@';
  let ascii = '';
  
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 40; x++) {
      const color = image.getPixelColor(x, y);
      const r = (color >> 24) & 255;
      const g = (color >> 16) & 255;
      const b = (color >> 8) & 255;
      const brightness = (r + g + b) / 3;
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[charIdx];
    }
    ascii += '\n';
  }
  console.log(ascii);
}

main();
