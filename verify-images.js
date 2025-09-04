const fs = require('fs');
const path = require('path');

// Import inventory data
const inventoryPath = path.join(__dirname, 'src', 'data', 'inventory.ts');
const inventoryContent = fs.readFileSync(inventoryPath, 'utf8');

// Extract photo arrays from the inventory file
const photoRegex = /photos:\s*\[([\s\S]*?)\]/g;
const photos = [];
let match;

while ((match = photoRegex.exec(inventoryContent)) !== null) {
  const photoArray = match[1];
  const photoPaths = photoArray.match(/'([^']+)'/g) || photoArray.match(/"([^"]+)"/g) || [];
  photoPaths.forEach(photo => {
    const cleanPath = photo.replace(/['"]/g, '');
    if (cleanPath.startsWith('/photos/')) {
      photos.push(cleanPath);
    }
  });
}

// Remove duplicates
const uniquePhotos = [...new Set(photos)];

console.log('🖼️  Inventory Image Verification');
console.log('================================');
console.log(`Total unique images found: ${uniquePhotos.length}`);
console.log('');

const publicDir = path.join(__dirname, 'public');
const results = {
  total: uniquePhotos.length,
  found: 0,
  missing: 0,
  errors: []
};

uniquePhotos.forEach((photoPath, index) => {
  const fullPath = path.join(publicDir, photoPath.substring(1)); // Remove leading slash

  try {
    const stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      console.log(`✅ ${index + 1}. ${photoPath}`);
      results.found++;
    } else {
      console.log(`❌ ${index + 1}. ${photoPath} (not a file)`);
      results.missing++;
      results.errors.push(`${photoPath} - not a file`);
    }
  } catch (error) {
    console.log(`❌ ${index + 1}. ${photoPath} (file not found)`);
    results.missing++;
    results.errors.push(`${photoPath} - file not found`);
  }
});

console.log('');
console.log('📊 Summary:');
console.log(`   ✅ Found: ${results.found}`);
console.log(`   ❌ Missing: ${results.missing}`);
console.log(`   📁 Total: ${results.total}`);

if (results.missing > 0) {
  console.log('');
  console.log('⚠️  Missing files:');
  results.errors.forEach(error => console.log(`   - ${error}`));
} else {
  console.log('');
  console.log('🎉 All inventory images verified successfully!');
}

console.log('');
console.log('📂 Directory structure check:');

const checkDir = (dirPath, indent = '') => {
  try {
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${item}/`);
        checkDir(fullPath, indent + '  ');
      } else if (item.endsWith('.jpg') || item.endsWith('.png')) {
        console.log(`${indent}🖼️  ${item}`);
      }
    });
  } catch (error) {
    console.log(`${indent}❌ Error reading directory: ${error.message}`);
  }
};

checkDir(path.join(publicDir, 'photos'));

console.log('');
console.log('✅ Verification complete!');
