export {};

console.log('Test script running...');

try {
  console.log('Trying to import...');
  const { getAllRows } = await import('../src/lib/seo/rows.ts');
  console.log('Import successful');
} catch (e) {
  console.error('Import failed:', e.message);
}
