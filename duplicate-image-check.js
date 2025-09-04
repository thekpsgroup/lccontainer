// Check for duplicate images across containers
const fs = require('fs');
const path = require('path');

// Read inventory data
const inventoryPath = path.join(__dirname, 'src', 'data', 'inventory.ts');
const inventoryContent = fs.readFileSync(inventoryPath, 'utf8');

// Parse all photos and their container associations
const photoUsage = new Map();
const containers = [];

// Extract container data with photos
const containerRegex = /{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?photos:\s*\[([\s\S]*?)\]/g;

let match;
while ((match = containerRegex.exec(inventoryContent)) !== null) {
  const [_, id, title, photosStr] = match;
  const photoPaths = photosStr.match(/'([^']+)'/g) || photosStr.match(/"([^"]+)"/g) || [];
  const photos = photoPaths.map(p => p.replace(/['"]/g, ''));

  containers.push({
    id,
    title,
    photos
  });

  // Track which containers use each photo
  photos.forEach(photo => {
    if (!photoUsage.has(photo)) {
      photoUsage.set(photo, []);
    }
    photoUsage.get(photo).push({ id, title });
  });
}

console.log('🔍 Image Duplicate Analysis');
console.log('==========================\n');

// Find duplicates
const duplicates = new Map();
const uniquePhotos = new Set();

photoUsage.forEach((containers, photo) => {
  if (containers.length > 1) {
    duplicates.set(photo, containers);
  }
  uniquePhotos.add(photo);
});

console.log(`📊 Summary:`);
console.log(`   Total unique images: ${uniquePhotos.size}`);
console.log(`   Total containers: ${containers.length}`);
console.log(`   Images with duplicates: ${duplicates.size}\n`);

if (duplicates.size > 0) {
  console.log('⚠️  DUPLICATE IMAGES FOUND:');
  console.log('==========================');

  duplicates.forEach((usedBy, photo) => {
    const filename = photo.split('/').pop();
    console.log(`\n🖼️  ${filename}`);
    console.log(`   Path: ${photo}`);
    console.log(`   Used by ${usedBy.length} containers:`);

    usedBy.forEach(container => {
      console.log(`     - ${container.title} (${container.id})`);
    });
  });

  console.log('\n❌ ISSUE: Duplicate images detected!');
} else {
  console.log('✅ No duplicate images found - all photos are unique!');
}

// Show detailed breakdown by container
console.log('\n📋 Container Photo Breakdown:');
console.log('==============================');

containers.forEach(container => {
  console.log(`\n${container.title} (${container.id}):`);
  console.log(`   Photos: ${container.photos.length}`);

  container.photos.forEach((photo, index) => {
    const filename = photo.split('/').pop();
    const isDuplicate = photoUsage.get(photo).length > 1;
    const status = isDuplicate ? '🔄' : '✅';
    const type = index === 0 ? 'PRIMARY' : 'gallery';

    console.log(`     ${status} ${filename} (${type})`);
  });
});

console.log('\n📈 Image Usage Statistics:');
console.log('==========================');

const usageStats = {
  usedOnce: 0,
  usedMultiple: 0
};

photoUsage.forEach((containers, photo) => {
  if (containers.length === 1) {
    usageStats.usedOnce++;
  } else {
    usageStats.usedMultiple++;
  }
});

console.log(`   Images used by 1 container: ${usageStats.usedOnce}`);
console.log(`   Images used by multiple containers: ${usageStats.usedMultiple}`);

if (duplicates.size > 0) {
  console.log('\n💡 RECOMMENDATION:');
  console.log('==================');
  console.log('Consider creating unique images for each container to avoid confusion.');
  console.log('Shared images should only be used when they truly represent multiple containers.');
} else {
  console.log('\n🎉 PERFECT: All images are uniquely assigned!');
}

console.log('\n✅ Analysis complete!');
