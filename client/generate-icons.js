/**
 * Generate PWA app icons from logo.png
 * Run: node generate-icons.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceLogoPath = path.join(__dirname, 'src/assets/logo.png');
const publicDir = path.join(__dirname, 'public');

const sizes = [192, 512];

(async () => {
  console.log('📦 Generating PWA app icons from logo.png...\n');

  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
    try {
      await sharp(sourceLogoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✨ PWA icons ready! Start your dev server: npm run dev');
})();
