import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '../src/content/loc');

function mdFrontmatter(obj: Record<string, any>) {
  const lines = Object.entries(obj)
    .filter(([k, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---`;
}

async function main() {
  console.log('Starting content generation...');
  const { getAllRows } = await import('../src/lib/seo/rows.ts');
  const rows = await getAllRows();
  console.log('Rows loaded:', rows.length);
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  console.log('CONTENT_DIR:', CONTENT_DIR);
  for (const row of rows) {
    try {
      const fm = mdFrontmatter({
        cluster: row.cluster,
        subcluster: row.subcluster,
        keyword: row.keyword,
        intent: row.intent,
        page_type: row.page_type,
        city: row.city,
        title_tag: row.title_tag,
        meta_description: row.meta_description,
        url_slug: row.url_slug,
        h1: row.h1,
        internal_links: row.internal_links,
        priority: row.priority,
        notes: row.notes,
        noindex: row.priority !== 1,
      });
      const body = `\n\n<!-- TODO: Add unique city/inventory copy, images, and internal links here. -->\n`;
      // Create nested directory for each slug, use index.md
      const relPath = row.url_slug.replace(/^\//, '').replace(/\/$/, '');
      const dirPath = path.join(CONTENT_DIR, relPath);
      await fs.mkdir(dirPath, { recursive: true });
      const filePath = path.join(dirPath, 'index.md');
      await fs.writeFile(filePath, `${fm}${body}`);
    } catch (err) {
      console.error(`Error processing row with slug: ${row.url_slug}`);
      console.error(err);
    }
  }
  console.log('Content files generated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
