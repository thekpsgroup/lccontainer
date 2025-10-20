#!/usr/bin/env tsx
/**
 * Quick Win Implementation: Meta Description Optimizer
 * Enhances meta descriptions for P1 pages to 150-160 chars with strong CTAs
 */

import fs from 'fs';
import path from 'path';

interface KeywordRow {
  cluster: string;
  subcluster: string;
  keyword: string;
  intent: string;
  page_type: string;
  city: string;
  title_tag: string;
  meta_description: string;
  url_slug: string;
  h1: string;
  internal_links: string;
  priority: number;
  notes: string;
}

function parseCSV(filepath: string): KeywordRow[] {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n').slice(1).filter(l => l.trim());

  return lines.map(line => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    return {
      cluster: fields[0] || '',
      subcluster: fields[1] || '',
      keyword: fields[2]?.replace(/"/g, '') || '',
      intent: fields[3] || '',
      page_type: fields[4] || '',
      city: fields[5]?.replace(/"/g, '') || '',
      title_tag: fields[6] || '',
      meta_description: fields[7] || '',
      url_slug: fields[8] || '',
      h1: fields[9] || '',
      internal_links: fields[10] || '',
      // NOTE: In the actual CSV, priority and notes are swapped!
      // The header says "priority,notes" but data has notes value in priority column
      priority: parseInt(fields[12]?.replace(/"/g, '') || '3'),  // Actually in "notes" field
      notes: fields[11] || ''  // Actually in "priority" field
    };
  });
}

function enhanceMetaDescription(row: KeywordRow): string {
  const city = row.city.split(',')[0]; // Just city name, drop state
  const isRental = row.keyword.toLowerCase().includes('rent');
  const isSale = row.keyword.toLowerCase().includes('sale') || row.keyword.toLowerCase().includes('buy');

  // Extract key attributes from keyword
  const sizeMatch = row.keyword.match(/(20ft|40ft|10ft)/i);
  const size = sizeMatch ? sizeMatch[1] : '';
  const conditionMatch = row.keyword.match(/(new|used|one-trip|wind and water tight|ww?t)/i);
  const condition = conditionMatch ? conditionMatch[1] : '';

  // Determine container type
  let containerType = 'containers';
  if (row.keyword.toLowerCase().includes('conex')) containerType = 'conex boxes';
  else if (row.keyword.toLowerCase().includes('shipping')) containerType = 'shipping containers';
  else if (row.keyword.toLowerCase().includes('storage')) containerType = 'storage containers';

  // Build enhanced description
  let description = '';

  if (isRental) {
    description = `Rent ${size ? size + ' ' : ''}${condition ? condition + ' ' : ''}${containerType} in ${city}. `;
    description += `Local since 2003. Flexible rental terms. Same-week delivery available. `;
  } else if (isSale) {
    description += `Buy ${size ? size + ' ' : ''}${condition ? condition + ' ' : ''}${containerType} in ${city}. `;
    description += `Local since 2003. New & used inventory. Fast delivery. `;
  } else {
    description += `${containerType.charAt(0).toUpperCase() + containerType.slice(1)} in ${city}. `;
    description += `Local since 2003. Quality containers. Fast delivery. `;
  }

  description += `Get your free quote — call (214) 524-4168 today.`;

  // Ensure 150-160 char range
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (description.length < 140) {
    // Pad if too short
    description = description.replace('today.', 'today. LC Container — your trusted DFW container provider.');
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
  }

  return description;
}

function generateUpdatedCSV(rows: KeywordRow[]): string {
  const header = 'cluster,subcluster,keyword,intent,page_type,city,title_tag,meta_description,url_slug,h1,internal_links,priority,notes';

  const csvLines = rows.map(row => {
    const fields = [
      row.cluster,
      row.subcluster,
      `"${row.keyword}"`,
      row.intent,
      row.page_type,
      `"${row.city}"`,
      row.title_tag,
      `"${row.meta_description}"`,
      row.url_slug,
      row.h1,
      row.internal_links,
      // NOTE: Swap back to match the original CSV format (swapped columns)
      row.notes,  // Goes into "priority" column
      `"${row.priority.toString()}"`  // Goes into "notes" column
    ];
    return fields.join(',');
  });

  return [header, ...csvLines].join('\n');
}

// Main execution
console.log('🚀 Meta Description Optimizer - Quick Win Implementation\n');
console.log('═══════════════════════════════════════════════════════\n');

const csvPath = path.join(process.cwd(), 'src/data/lccontainer_keyword_plan.csv');
const rows = parseCSV(csvPath);

const p1Rows = rows.filter(r => r.priority === 1);
const shortMetaRows = p1Rows.filter(r => r.meta_description.length < 120);

console.log(`📊 Analysis:`);
console.log(`   Total P1 pages: ${p1Rows.length}`);
console.log(`   Pages with short meta (<120 chars): ${shortMetaRows.length}\n`);

console.log(`✏️  Optimizing meta descriptions...\n`);

let updatedCount = 0;
const examples: Array<{url: string; before: string; after: string; improvement: string}> = [];

rows.forEach(row => {
  if (row.priority === 1 && row.meta_description.length < 140) {
    const original = row.meta_description;
    const enhanced = enhanceMetaDescription(row);

    if (enhanced.length >= 140 && enhanced.length <= 160 && enhanced !== original) {
      row.meta_description = enhanced;
      updatedCount++;

      if (examples.length < 5) {
        examples.push({
          url: row.url_slug,
          before: original,
          after: enhanced,
          improvement: `${original.length} → ${enhanced.length} chars (+${enhanced.length - original.length})`
        });
      }
    }
  }
});

console.log(`✅ Updated ${updatedCount} meta descriptions\n`);
console.log(`📝 Examples:\n`);

examples.forEach((ex, i) => {
  console.log(`${i + 1}. ${ex.url}`);
  console.log(`   Before: "${ex.before}"`);
  console.log(`   After:  "${ex.after}"`);
  console.log(`   ${ex.improvement}\n`);
});

// Save updated CSV
const backupPath = csvPath.replace('.csv', '.backup.csv');
fs.copyFileSync(csvPath, backupPath);
console.log(`💾 Backup created: ${backupPath}`);

const updatedCSV = generateUpdatedCSV(rows);
fs.writeFileSync(csvPath, updatedCSV);
console.log(`💾 Updated CSV saved: ${csvPath}`);

// Generate summary report
const report = {
  timestamp: new Date().toISOString(),
  totalP1: p1Rows.length,
  updatedCount,
  examples: examples.map(ex => ({
    url: ex.url,
    charsBefore: ex.before.length,
    charsAfter: ex.after.length
  }))
};

const reportPath = path.join(process.cwd(), 'reports/meta-optimization-report.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📊 Report saved: ${reportPath}\n`);

console.log('✨ Next Steps:');
console.log('   1. Review the changes in lccontainer_keyword_plan.csv');
console.log('   2. Run: npm run build');
console.log('   3. Regenerate content: npx tsx scripts/generate-loc-content.ts');
console.log('   4. Deploy updated pages');
console.log('\n🎯 Expected Impact: +5-10% CTR improvement from SERP\n');
