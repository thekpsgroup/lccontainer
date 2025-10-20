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
  // Simple CLI parsing: --city=<slug> (no leading /), --priority=<n> (max priority to template)
  const args = process.argv.slice(2);
  const argMap: Record<string, string | boolean> = {};
  for (const a of args) {
    if (a.startsWith('--')) {
      const [k, v] = a.split('=');
      argMap[k.replace(/^--/, '')] = v === undefined ? true : v;
    }
  }
  const cityFilter = typeof argMap.city === 'string' ? String(argMap.city).toLowerCase().replace(/^\//, '') : null;
  const priorityThreshold = argMap.priority ? Number(argMap.priority) : 1;
  console.log('Filters:', { cityFilter, priorityThreshold });
  for (const row of rows) {
    try {
      // Apply selective processing based on CLI flags
      if (cityFilter) {
        const slug = row.url_slug.replace(/^\//, '');
        if (!slug.startsWith(cityFilter)) {
          // still ensure file exists (write placeholder) but skip templating
        }
      }
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
      // Simple templating for priority=1 pages. For non-P1 pages keep placeholder so manual review is possible.
      function renderTemplate(r: any) {
        const city = r.city || '';
        const h1 = r.h1 || '';
        const internalLinks = (r.internal_links || '').split(',').map((s: string) => s.trim()).filter(Boolean);

        const faq = [
          {
            q: `How much does delivery cost in ${city}?`,
            a: `Delivery costs vary by distance and container size. Most deliveries in ${city} range from $150-$300. Call (214) 524-4168 for an exact quote based on your specific location.`,
          },
          {
            q: `Do you offer financing or payment plans?`,
            a: `We accept major credit cards, checks, and can discuss commercial terms for bulk purchases. Call (214) 524-4168 to discuss options.`,
          },
          {
            q: `Can you customize containers in ${city}?`,
            a: `Yes — we perform modifications like doors, HVAC, insulation, and shelving. Request a custom quote at (214) 524-4168 or via our contact form.`,
          },
        ];

        const faqJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faq.map((f) => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
        };

        return `\n\n${h1 ? `# ${h1}\n` : ''}\n${city ? `We provide shipping container sales, rentals, and modifications in ${city}. Call (214) 524-4168 for a fast quote.` : ''}\n\n## Our Inventory & Services\n- Shipping container sales\n- Container rentals\n- Custom modifications (doors, HVAC, shelving)\n\n<div data-section="internal-links">\n### Helpful links\n${internalLinks.map((l: string) => `- [${l}](${l}`) .join('\n')}\n</div>\n\n<div data-section="cta">\nGet your free quote today — call (214) 524-4168 or <a href=\"/contact\">contact us</a>.\n</div>\n\n<script type=\"application/ld+json\">${JSON.stringify(faqJsonLd)}</script>\n`;
      }

      // Decide whether to render template based on priority threshold OR if city filter is set and matches
      const slugNoLead = row.url_slug.replace(/^\//, '');
      const matchesCity = cityFilter ? slugNoLead.startsWith(cityFilter) : false;
      const shouldTemplate = matchesCity || row.priority <= priorityThreshold;

      const body = shouldTemplate ? renderTemplate(row) : `\n\n<!-- TODO: Add unique city/inventory copy, images, and internal links here. -->\n`;
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
