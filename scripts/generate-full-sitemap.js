import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_PATH = path.resolve(__dirname, '../src/data/lccontainer_keyword_plan.csv');
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap-loc.xml');

function generateSitemapEntry(url, priority, changefreq = 'monthly') {
  return `  <url>
    <loc>https://lccontainer.com${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateFullSitemap() {
  console.log('Generating full sitemap for local SEO content...');

  try {
    console.log('Reading CSV from:', CSV_PATH);
    const csv = await fs.readFile(CSV_PATH, 'utf8');
    console.log('CSV length:', csv.length);

    const records = parse(csv, { columns: true, skip_empty_lines: true });
    console.log('Records parsed:', records.length);

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    let count = 0;
    for (const record of records) {
      // Only include pages that should be indexed (priority 1)
      if (record.priority === '1') {
        const priority =
          record.page_type === 'Location Service Hub'
            ? '0.8'
            : record.page_type === 'Location-Product'
            ? '0.7'
            : record.page_type === 'Location-Service'
            ? '0.6'
            : '0.5';

        const changefreq = record.intent.includes('Transactional') ? 'weekly' : 'monthly';

        sitemapContent += generateSitemapEntry(record.url_slug, priority, changefreq);
        sitemapContent += '\n';
        count++;
      }
    }

    sitemapContent += '</urlset>';

    console.log(`Writing sitemap with ${count} URLs to ${SITEMAP_PATH}`);
    await fs.writeFile(SITEMAP_PATH, sitemapContent, 'utf8');
    console.log(`Full sitemap generated successfully with ${count} URLs`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateFullSitemap();
