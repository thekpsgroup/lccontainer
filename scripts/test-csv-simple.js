import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testCSV() {
  console.log('Testing CSV reading...');

  const csvPath = path.resolve(__dirname, '../src/data/lccontainer_keyword_plan.csv');
  console.log('CSV_PATH:', csvPath);
  console.log('Current working directory:', process.cwd());

  try {
    const csv = await fs.readFile(csvPath, 'utf8');
    console.log('CSV length:', csv.length);
    console.log('First 200 chars:', csv.substring(0, 200));

    const records = parse(csv, { columns: true, skip_empty_lines: true });
    console.log('Records count:', records.length);

    if (records.length > 0) {
      console.log('First record:', records[0]);
    }
  } catch (e) {
    console.error('Error:', e instanceof Error ? e.message : String(e));
  }
}

testCSV();
