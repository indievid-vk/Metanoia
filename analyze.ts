import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

async function analyzeImage() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const imagePath = path.join(process.cwd(), 'public', 'obrazec.webp');
    const imageBytes = fs.readFileSync(imagePath);
    const base64Image = imageBytes.toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/webp'
          }
        },
        "Describe the colors, fonts, and overall visual style of this image in detail. What are the exact hex codes of the main background, text, and accent colors? What font style is used (e.g., serif, sans-serif, old slavonic, modern)? Give me a brief summary."
      ]
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}

analyzeImage();
