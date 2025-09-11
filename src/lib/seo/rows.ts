import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export type Row = {
  cluster: string;
  subcluster: string;
  keyword: string;
  intent: string;
  page_type: 'Location Service Hub' | 'Location-Product' | 'Location-Service' | 'Blog/FAQ';
  city: string;
  title_tag: string;
  meta_description: string;
  url_slug: string;
  h1: string;
  internal_links: string;
  priority: 1 | 2 | 3;
  notes: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, '../../data/lccontainer_keyword_plan.csv');

function normalizeSlug(slug: string): string {
  return (
    '/' +
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\/-]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/\/+$/, '')
      .replace(/^\/+/, '')
  );
}

export async function getAllRows(): Promise<Row[]> {
  console.log('CSV_PATH:', CSV_PATH);
  console.log('__dirname:', __dirname);
  console.log('Current working directory:', process.cwd());
  try {
    const csv = await fs.readFile(CSV_PATH, 'utf8');
    console.log('CSV length:', csv.length);
    console.log('First 200 chars:', csv.substring(0, 200));
    const records = parse(csv, { columns: true, skip_empty_lines: true });
    console.log('Records count:', records.length);
    const seen = new Set<string>();
    const rows: Row[] = [];
    for (const rec of records) {
      const slug = normalizeSlug(rec.url_slug);
      if (!seen.has(slug)) {
        seen.add(slug);
        rows.push({
          ...rec,
          url_slug: slug,
          priority: Number(rec.priority) as 1 | 2 | 3,
        });
      }
    }
    console.log('Rows count:', rows.length);
    return rows;
  } catch (e) {
    console.error('Error in getAllRows:', e);
    console.error('Error details:', e instanceof Error ? e.message : String(e));
    return [];
  }
}

export async function getRowsByPriority(p: 1 | 2 | 3): Promise<Row[]> {
  const all = await getAllRows();
  return all.filter((r) => r.priority === p);
}

export async function getRowBySlug(slug: string): Promise<Row | null> {
  const all = await getAllRows();
  const norm = normalizeSlug(slug);
  return all.find((r) => r.url_slug === norm) || null;
}
