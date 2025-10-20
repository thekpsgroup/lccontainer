/**
 * Competitor Scout
 *
 * Usage (optional): node scripts/competitor-scout.ts "shipping containers Dallas" "storage containers Fort Worth"
 * Note: This script scaffolds the approach and prints instructions. For live SERP scraping, plug in a search API.
 */
import process from 'node:process';

const queries = process.argv.slice(2);

if (queries.length === 0) {
  console.log('Provide queries, e.g.: node scripts/competitor-scout.ts "shipping containers Dallas"');
  console.log('Recommended next step: Use Google Search Console + a SERP API (e.g., SerpAPI) to fetch top results and map common page patterns.');
  process.exit(0);
}

console.log('Competitor research plan for queries:');
for (const q of queries) {
  console.log('- ' + q);
}

console.log('\nCollect for each top 10 result:');
console.log('- Title tag, H1, URL, word count, phone CTA presence, schema types, internal links to inventory/contact');
console.log('- Unique value props, pricing visibility, city mentions, FAQ presence');
console.log('\nTip: Prioritize domains consistently ranking top 3 across queries.');
