const { Jimp } = require('jimp');
const path = require('path');

async function analyze() {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'obrazec.webp');
    const image = await Jimp.read(imagePath);
    
    // Get dimensions
    console.log(`Dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
    
    // Sample a few pixels to get an idea of the colors
    // Let's check corners for background color
    const corners = [
      image.getPixelColor(10, 10),
      image.getPixelColor(image.bitmap.width - 10, 10),
      image.getPixelColor(10, image.bitmap.height - 10),
      image.getPixelColor(image.bitmap.width - 10, image.bitmap.height - 10),
    ];
    
    console.log('Corner colors (RGBA hex):', corners.map(c => c.toString(16)));
    
    // Sample center
    const center = image.getPixelColor(image.bitmap.width / 2, image.bitmap.height / 2);
    console.log('Center color (RGBA hex):', center.toString(16));
    
  } catch (e) {
    console.error(e);
  }
}

analyze();
