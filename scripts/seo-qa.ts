import assert from 'assert';
import { getAllRows } from '../src/lib/seo/rows';

async function runQA() {
  const rows = await getAllRows();
  const sample = rows.sort(() => 0.5 - Math.random()).slice(0, 25);
  for (const row of sample) {
    // Simulate fetch and checks (replace with real HTTP fetch in CI)
    const url = `http://localhost:4321${row.url_slug}`;
    // Example assertions (replace with real fetch/parse logic)
    assert(row.title_tag.length <= 60, `Title too long: ${row.title_tag}`);
    assert(row.meta_description.length <= 160, `Meta too long: ${row.meta_description}`);
    assert(row.h1, 'Missing H1');
    assert(row.url_slug.startsWith('/'), 'Slug must start with /');
    assert(row.internal_links.split(',').length >= 3, 'Not enough internal links');
    // Add more checks as needed
  }
  console.log('SEO QA passed for sample pages.');
}

runQA().catch((e) => {
  console.error(e);
  process.exit(1);
});
