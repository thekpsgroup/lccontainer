#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate WebP versions of all JPEG/PNG images in the photos directory
 * This ensures proper WebP support with fallbacks
 */

const photoDir = path.join(__dirname, '../public/photos');
const supportedExtensions = ['.jpg', '.jpeg', '.png'];

function checkWebPSupport() {
  try {
    execSync('cwebp -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.log('❌ cwebp not found. Installing webp...');
    try {
      // Try to install webp
      execSync('sudo apt-get update && sudo apt-get install -y webp', { stdio: 'inherit' });
      console.log('✅ WebP tools installed successfully');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install WebP tools:', installError.message);
      return false;
    }
  }
}

function findImages(dir) {
  const images = [];

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          if (!fs.existsSync(webpPath)) {
            images.push({
              source: fullPath,
              target: webpPath,
              ext: ext
            });
          }
        }
      }
    }
  }

  walkDir(dir);
  return images;
}

function generateWebP(imagePath, outputPath, quality = 85) {
  try {
    const command = `cwebp -q ${quality} "${imagePath}" -o "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`❌ Failed to convert ${imagePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🖼️  WebP Image Generator');
  console.log('======================');

  // Check if WebP tools are available
  if (!checkWebPSupport()) {
    console.log('Cannot proceed without WebP tools. Exiting...');
    process.exit(1);
  }

  if (!fs.existsSync(photoDir)) {
    console.log('❌ Photos directory not found:', photoDir);
    process.exit(1);
  }

  // Find all images that need WebP conversion
  const images = findImages(photoDir);

  if (images.length === 0) {
    console.log('✅ All images already have WebP versions');
    return;
  }

  console.log(`Found ${images.length} images to convert:`);

  let successful = 0;
  let failed = 0;

  for (const image of images) {
    const relativePath = path.relative(photoDir, image.source);
    process.stdout.write(`Converting ${relativePath}... `);

    if (generateWebP(image.source, image.target)) {
      process.stdout.write('✅\n');
      successful++;
    } else {
      process.stdout.write('❌\n');
      failed++;
    }
  }

  console.log('\n📊 Conversion Summary:');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (successful > 0) {
    console.log('\n🎉 WebP images generated successfully!');
    console.log('Your site now supports modern WebP format with proper fallbacks.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { findImages, generateWebP };
