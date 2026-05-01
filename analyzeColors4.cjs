const sharp = require('sharp');
const path = require('path');

async function analyze() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'obrazec.webp');
    
    // Resize to 100x100 to get more pixels
    const { data, info } = await sharp(imagePath)
      .resize(100, 100)
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    let darkest = { r: 255, g: 255, b: 255, val: 255*3 };
    let reddest = { r: 0, g: 0, b: 0, val: 0 };
    
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      const brightness = r + g + b;
      if (brightness < darkest.val) {
        darkest = { r, g, b, val: brightness };
      }
      
      // Reddest: high R, low G and B
      const redScore = r - (g + b)/2;
      if (redScore > reddest.val) {
        reddest = { r, g, b, val: redScore };
      }
    }
    
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    
    console.log(`Darkest (Ink): #${toHex(darkest.r)}${toHex(darkest.g)}${toHex(darkest.b)}`);
    console.log(`Reddest (Cinnabar): #${toHex(reddest.r)}${toHex(reddest.g)}${toHex(reddest.b)}`);
    
  } catch (e) {
    console.error(e);
  }
}

analyze();
