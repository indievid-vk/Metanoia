const sharp = require('sharp');
const path = require('path');

async function analyze() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'obrazec.webp');
    
    // Get image stats
    const stats = await sharp(imagePath).stats();
    
    // Get dominant color
    const dominant = stats.dominant;
    console.log(`Dominant color: rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`);
    
    // Convert to hex
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    console.log(`Hex: #${toHex(dominant.r)}${toHex(dominant.g)}${toHex(dominant.b)}`);
    
  } catch (e) {
    console.error(e);
  }
}

analyze();
