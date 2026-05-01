const sharp = require('sharp');
const path = require('path');

async function analyze() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'obrazec.webp');
    
    // Resize to 5x5 to get a palette of 25 colors
    const { data, info } = await sharp(imagePath)
      .resize(5, 5)
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    const colors = [];
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      colors.push(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    }
    
    console.log('Palette:', colors);
    
  } catch (e) {
    console.error(e);
  }
}

analyze();
