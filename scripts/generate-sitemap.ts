import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap-loc.xml');

function generateSitemapEntry(url: string, priority: number, changefreq: string = 'monthly') {
  return `  <url>
    <loc>https://lccontainer.com${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  console.log('Generating sitemap for local SEO content...');

  try {
    const { getAllRows } = await import('../src/lib/seo/rows.ts');
    console.log('Import successful');
    const rows = await getAllRows();
    console.log('Rows loaded:', rows.length);

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add all the generated content pages
    let count = 0;
    for (const row of rows) {
      // Only include pages that should be indexed (priority 1)
      if (row.priority === 1) {
        const priority =
          row.page_type === 'Location Service Hub'
            ? '0.8'
            : row.page_type === 'Location-Product'
            ? '0.7'
            : row.page_type === 'Location-Service'
            ? '0.6'
            : '0.5';

        const changefreq = row.intent.includes('Transactional') ? 'weekly' : 'monthly';

        sitemapContent += generateSitemapEntry(row.url_slug, parseFloat(priority), changefreq);
        sitemapContent += '\n';
        count++;
      }
    }

    sitemapContent += '</urlset>';

    console.log(`Writing sitemap with ${count} URLs to ${SITEMAP_PATH}`);
    await fs.writeFile(SITEMAP_PATH, sitemapContent, 'utf8');
    console.log(`Sitemap generated successfully with ${count} URLs`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
