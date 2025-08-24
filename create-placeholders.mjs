import fs from 'fs';
import path from 'path';

// Create a simple SVG placeholder
function createSVGPlaceholder(width, height, text, filename) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  
  const filepath = path.join('public', filename);
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, svg);
  console.log(`Created: ${filename}`);
}

// Create placeholder images for missing assets
const placeholders = [
  // Logo images
  { path: 'photos/logos/lccontainer-logo-transparent-400.png', width: 400, height: 100, text: 'LC Container Logo' },
  { path: 'photos/logos/lccontainer-logo-transparent-800.png', width: 800, height: 200, text: 'LC Container Logo' },
  
  // Background images
  { path: 'photos/container/standard/background.png', width: 1200, height: 600, text: 'Container Yard Background' },
  
  // Container images
  { path: 'photos/container/standard/20ft_1.jpg', width: 400, height: 300, text: '20ft Container 1' },
  { path: 'photos/container/standard/20ft_2.jpg', width: 400, height: 300, text: '20ft Container 2' },
  { path: 'photos/container/standard/20ft_3.jpg', width: 400, height: 300, text: '20ft Container 3' },
  { path: 'photos/container/standard/20ft_4.jpg', width: 400, height: 300, text: '20ft Container 4' },
  { path: 'photos/container/standard/20ft_5.jpg', width: 400, height: 300, text: '20ft Container 5' },
  { path: 'photos/container/standard/20ft_6.jpg', width: 400, height: 300, text: '20ft Container 6' },
  { path: 'photos/container/standard/20ft_7.jpg', width: 400, height: 300, text: '20ft Container 7' },
  { path: 'photos/container/standard/20ft_8.jpg', width: 400, height: 300, text: '20ft Container 8' },
  { path: 'photos/container/standard/40ft_1.jpg', width: 400, height: 300, text: '40ft Container 1' },
  { path: 'photos/container/standard/40ft_2.jpg', width: 400, height: 300, text: '40ft Container 2' },
  
  // Yard images
  { path: 'photos/container/standard/yard-overview.jpg', width: 600, height: 400, text: 'Yard Overview' },
  { path: 'photos/container/standard/yard-storage.jpg', width: 600, height: 400, text: 'Yard Storage' },
  { path: 'photos/container/standard/yard-inventory.jpg', width: 600, height: 400, text: 'Yard Inventory' },
  { path: 'photos/container/standard/container-yard-overview.jpg', width: 600, height: 400, text: 'Container Yard Overview' },
  { path: 'photos/container/standard/container-storage-area.jpg', width: 600, height: 400, text: 'Container Storage Area' },
  { path: 'photos/container/standard/container-yard-inventory.jpg', width: 600, height: 400, text: 'Container Yard Inventory' },
  
  // Custom build images
  { path: 'photos/container/custom/custom-modification-2.jpg', width: 400, height: 300, text: 'Custom Build 2' },
  { path: 'photos/container/custom/custom-modification-3.jpg', width: 400, height: 300, text: 'Custom Build 3' },
  { path: 'photos/container/custom/custom-modification-4.jpg', width: 400, height: 300, text: 'Custom Build 4' },
  { path: 'photos/container/custom/custom-modification-5.jpg', width: 400, height: 300, text: 'Custom Build 5' },
  { path: 'photos/container/custom/custom-modification-6.jpg', width: 400, height: 300, text: 'Custom Build 6' },
  { path: 'photos/container/custom/custom-modification-7.jpg', width: 400, height: 300, text: 'Custom Build 7' },
  { path: 'photos/container/custom/custom-modification-8.jpg', width: 400, height: 300, text: 'Custom Build 8' },
  { path: 'photos/container/custom/custom-modification-10.jpg', width: 400, height: 300, text: 'Custom Build 10' },
  { path: 'photos/container/custom/custom-modification-11.jpg', width: 400, height: 300, text: 'Custom Build 11' },
  { path: 'photos/container/custom/custom-modification-15.jpg', width: 400, height: 300, text: 'Custom Build 15' },
  { path: 'photos/container/custom/custom-modification-16.jpg', width: 400, height: 300, text: 'Custom Build 16' },
];

console.log('Creating placeholder images...');
placeholders.forEach(p => {
  createSVGPlaceholder(p.width, p.height, p.text, p.path);
});
console.log('Placeholder images created successfully!');