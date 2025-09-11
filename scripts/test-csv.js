import { getAllRows } from '../src/lib/seo/rows.js';

async function test() {
  console.log('Testing CSV reading...');
  const rows = await getAllRows();
  console.log(`Found ${rows.length} rows`);
  if (rows.length > 0) {
    console.log('First row:', rows[0]);
  }
}

test().catch(console.error);
