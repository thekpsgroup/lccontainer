// Container Image Mapping Verification
const fs = require('fs');
const path = require('path');

// Read inventory data
const inventoryPath = path.join(__dirname, 'src', 'data', 'inventory.ts');
const inventoryContent = fs.readFileSync(inventoryPath, 'utf8');

// Parse container data
const containers = [];
const containerRegex = /{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*size:\s*"([^"]+)",\s*height:\s*"([^"]+)",\s*condition:\s*"([^"]+)",[\s\S]*?photos:\s*\[([\s\S]*?)\]/g;

let match;
while ((match = containerRegex.exec(inventoryContent)) !== null) {
  const [_, id, title, size, height, condition, photosStr] = match;
  const photoPaths = photosStr.match(/'([^']+)'/g) || photosStr.match(/"([^"]+)"/g) || [];
  const photos = photoPaths.map(p => p.replace(/['"]/g, ''));

  containers.push({
    id,
    title,
    size,
    height,
    condition,
    photos,
    primaryImage: photos[0] || null
  });
}

console.log('🖼️  Container Image Mapping Verification');
console.log('======================================\n');

// Group by size
const bySize = {};
containers.forEach(container => {
  if (!bySize[container.size]) {
    bySize[container.size] = [];
  }
  bySize[container.size].push(container);
});

// Analyze each size
Object.keys(bySize).sort().forEach(size => {
  console.log(`${size} CONTAINERS:`);
  console.log('-'.repeat(50));

  const sizeContainers = bySize[size];
  const allImages = sizeContainers.flatMap(c => c.photos);
  const uniqueImages = [...new Set(allImages)];
  const primaryImages = sizeContainers.map(c => c.primaryImage);

  console.log(`📦 ${sizeContainers.length} containers`);
  console.log(`🖼️  ${uniqueImages.length} unique images\n`);

  sizeContainers.forEach(container => {
    console.log(`  ${container.title}:`);
    console.log(`    Primary: ${container.primaryImage}`);
    console.log(`    Gallery: ${container.photos.slice(1).length} additional images\n`);
  });

  // Check image naming patterns
  console.log('🔍 Image Analysis:');
  const standardImages = uniqueImages.filter(img => img.includes('/standard/'));
  const customImages = uniqueImages.filter(img => img.includes('/custom/'));

  console.log(`    Standard images: ${standardImages.length}`);
  standardImages.forEach(img => {
    const filename = img.split('/').pop();
    console.log(`      ✓ ${filename}`);
  });

  console.log(`    Custom images: ${customImages.length}`);
  customImages.forEach(img => {
    const filename = img.split('/').pop();
    console.log(`      ✓ ${filename}`);
  });

  console.log('');
});

// Summary
console.log('📊 SUMMARY:');
console.log('===========');
console.log(`Total containers: ${containers.length}`);
console.log(`Sizes available: ${Object.keys(bySize).join(', ')}\n`);

// Verify size-appropriate images
console.log('✅ VERIFICATION:');
console.log('================');

const sizeChecks = [
  { size: "10'", expected: ['10-ft.jpg', '10-ft-hc.jpg'] },
  { size: "20'", expected: ['20ft_'] },
  { size: "30'", expected: ['30-ft.jpg'] },
  { size: "40'", expected: ['40ft_', '40-ft.jpg'] }
];

sizeChecks.forEach(({ size, expected }) => {
  const sizeContainers = bySize[size] || [];
  if (sizeContainers.length === 0) return;

  const sizeImages = sizeContainers.flatMap(c => c.photos);
  const hasExpected = expected.some(pattern =>
    sizeImages.some(img => img.includes(pattern))
  );

  const status = hasExpected ? '✅' : '❌';
  console.log(`${status} ${size} containers have appropriate size images`);
});

console.log('\n🎉 Verification complete!');
