/**
 * Contrast Testing Script
 * Verifies WCAG 2.1 AA compliance for color combinations
 */

const { getContrastRatio, ensureContrast, hexToRgb, getLuminance } = require('../src/lib/contrast.ts');

// Test color combinations from our design system
const testCombinations = [
  // Primary brand combinations
  { fg: '#DC2626', bg: '#FFFFFF', name: 'Brand red on white' },
  { fg: '#FFFFFF', bg: '#1F2937', name: 'White on dark navy' },
  { fg: '#FFFFFF', bg: '#DC2626', name: 'White on brand red' },

  // Neutral combinations
  { fg: '#374151', bg: '#FFFFFF', name: 'Dark gray on white' },
  { fg: '#6B7280', bg: '#FFFFFF', name: 'Medium gray on white' },
  { fg: '#FFFFFF', bg: '#374151', name: 'White on dark gray' },

  // Link combinations
  { fg: '#B91C1C', bg: '#FFFFFF', name: 'Link default on white' },
  { fg: '#991B1B', bg: '#FFFFFF', name: 'Link hover on white' },
];

console.log('🧪 LC Container Contrast Ratio Testing');
console.log('=' .repeat(50));

let allPass = true;

testCombinations.forEach(({ fg, bg, name }) => {
  const result = ensureContrast(fg, bg);
  const status = result.isCompliant ? '✅ PASS' : '❌ FAIL';

  console.log(`${status} ${name}`);
  console.log(`   Ratio: ${result.ratio.toFixed(2)}:1 (Required: ${result.requiredRatio}:1)`);

  if (!result.isCompliant) {
    console.log(`   ⚠️  ${result.recommendation}`);
    allPass = false;
  }
  console.log('');
});

console.log('=' .repeat(50));
if (allPass) {
  console.log('🎉 All color combinations meet WCAG 2.1 AA requirements!');
} else {
  console.log('⚠️  Some color combinations need adjustment for AA compliance.');
}

// Test some scrim opacity calculations
console.log('\n🖼️  Scrim Opacity Testing');
console.log('-'.repeat(30));

const scrimTests = [
  { text: '#FFFFFF', bg: '#374151', name: 'White text on dark bg' },
  { text: '#000000', bg: '#F9FAFB', name: 'Black text on light bg' },
];

scrimTests.forEach(({ text, bg, name }) => {
  // This would normally use the calculateOptimalScrimOpacity function
  // For now, just show the base contrast
  const ratio = getContrastRatio(text, bg);
  console.log(`${name}: ${ratio.toFixed(2)}:1`);
});

console.log('\n✨ Contrast testing complete!');
