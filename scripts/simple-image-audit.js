/**
 * Simple Image Audit Script for LC Container
 * Basic analysis without complex dependencies
 */

const fs = require('fs');
const path = require('path');

function scanImages(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanImages(fullPath, results);
    } else if (isImageFile(file)) {
      results.push({
        path: fullPath,
        filename: file,
        size: stat.size,
        extension: path.extname(file).toLowerCase()
      });
    }
  }

  return results;
}

function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateReport(images) {
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const formatCount = {};

  images.forEach(img => {
    formatCount[img.extension] = (formatCount[img.extension] || 0) + 1;
  });

  // Find largest images
  const largestImages = images
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  let report = `
🖼️  LC Container Image Audit Report
${'='.repeat(40)}

📊 OVERVIEW
Total Images: ${images.length}
Total Size: ${formatBytes(totalSize)}

📈 FORMAT DISTRIBUTION
${Object.entries(formatCount)
  .map(([format, count]) => `${format}: ${count} files`)
  .join('\n')}

🎯 LARGEST IMAGES (Top 10)
${largestImages.map((img, index) =>
  `${index + 1}. ${img.filename} - ${formatBytes(img.size)}`
).join('\n')}

💡 RECOMMENDATIONS
${images.length > 20 ? '⚠️  Consider optimizing large images (>200KB)' : '✅ Image count looks reasonable'}
${totalSize > 5 * 1024 * 1024 ? '⚠️  Total size > 5MB, consider compression' : '✅ Total size looks good'}
${formatCount['.png'] > formatCount['.webp'] ? '💡 Consider converting PNGs to WebP' : '✅ Good format distribution'}

✨ Audit completed!
`;

  return report;
}

// Run the audit
try {
  console.log('🔍 Scanning images...');
  const images = scanImages(path.join(__dirname, '..', 'public'));
  const report = generateReport(images);

  console.log(report);

  // Save to reports directory
  const reportsDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(reportsDir, 'image-audit-report.txt'), report);
  console.log('📄 Report saved to: reports/image-audit-report.txt');

} catch (error) {
  console.error('❌ Audit failed:', error.message);
  process.exit(1);
}
