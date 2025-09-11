import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBasicSitemap() {
  console.log('Generating basic sitemap...');

  const sitemapPath = path.resolve(__dirname, '../public/sitemap-loc.xml');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lccontainer.com/arlington/rent/20ft/conex-boxes/one-trip-new</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://lccontainer.com/learn/20ft-vs-40ft/arlington</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  try {
    await fs.writeFile(sitemapPath, sitemapContent, 'utf8');
    console.log(`Basic sitemap created at ${sitemapPath}`);
  } catch (error) {
    console.error('Error creating sitemap:', error);
  }
}

generateBasicSitemap();
