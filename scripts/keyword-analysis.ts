#!/usr/bin/env tsx
/**
 * Comprehensive Keyword Analysis & Optimization Strategy
 * Analyzes lccontainer_keyword_plan.csv to identify:
 * - High-value keyword opportunities
 * - Content gaps and optimization needs
 * - Clustering and prioritization recommendations
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
    // Handle quoted fields with commas
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
      priority: parseInt(fields[11]) || 3,
      notes: fields[12] || ''
    };
  });
}

function analyzeKeywords(rows: KeywordRow[]) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   KEYWORD ANALYSIS & OPTIMIZATION STRATEGY');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Overall Stats
  console.log('📊 OVERALL STATISTICS');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`Total Keywords: ${rows.length}`);
  const p1 = rows.filter(r => r.priority === 1);
  const p2 = rows.filter(r => r.priority === 2);
  const p3 = rows.filter(r => r.priority === 3);
  console.log(`  Priority 1 (High Value):  ${p1.length} (${(p1.length/rows.length*100).toFixed(1)}%)`);
  console.log(`  Priority 2 (Medium):      ${p2.length} (${(p2.length/rows.length*100).toFixed(1)}%)`);
  console.log(`  Priority 3 (Low):         ${p3.length} (${(p3.length/rows.length*100).toFixed(1)}%)`);

  // 2. Geographic Coverage
  console.log('\n\n📍 GEOGRAPHIC COVERAGE');
  console.log('─────────────────────────────────────────────────────────');
  const cityStats = new Map<string, { total: number; p1: number; p2: number; p3: number }>();
  rows.forEach(r => {
    const stats = cityStats.get(r.city) || { total: 0, p1: 0, p2: 0, p3: 0 };
    stats.total++;
    if (r.priority === 1) stats.p1++;
    if (r.priority === 2) stats.p2++;
    if (r.priority === 3) stats.p3++;
    cityStats.set(r.city, stats);
  });

  const topCities = Array.from(cityStats.entries())
    .sort((a, b) => b[1].p1 - a[1].p1)
    .slice(0, 10);

  console.log('Top 10 Cities by P1 Keywords:');
  topCities.forEach(([city, stats], i) => {
    console.log(`  ${(i+1).toString().padStart(2)}. ${city.padEnd(20)} | P1: ${stats.p1.toString().padStart(3)} | P2: ${stats.p2.toString().padStart(4)} | P3: ${stats.p3.toString().padStart(3)} | Total: ${stats.total}`);
  });

  // 3. Cluster Analysis
  console.log('\n\n🏷️  KEYWORD CLUSTER ANALYSIS');
  console.log('─────────────────────────────────────────────────────────');
  const clusterStats = new Map<string, { total: number; p1: number; intents: Set<string> }>();
  rows.forEach(r => {
    const stats = clusterStats.get(r.cluster) || { total: 0, p1: 0, intents: new Set() };
    stats.total++;
    if (r.priority === 1) stats.p1++;
    stats.intents.add(r.intent);
    clusterStats.set(r.cluster, stats);
  });

  const sortedClusters = Array.from(clusterStats.entries())
    .sort((a, b) => b[1].p1 - a[1].p1);

  console.log('Cluster Breakdown:');
  sortedClusters.forEach(([cluster, stats]) => {
    const intentStr = Array.from(stats.intents).join(', ');
    console.log(`\n  ${cluster.toUpperCase()}`);
    console.log(`    Total: ${stats.total} keywords | P1: ${stats.p1} | Intents: ${intentStr}`);
  });

  // 4. Intent Distribution
  console.log('\n\n🎯 SEARCH INTENT DISTRIBUTION');
  console.log('─────────────────────────────────────────────────────────');
  const intentStats = new Map<string, number>();
  rows.forEach(r => {
    intentStats.set(r.intent, (intentStats.get(r.intent) || 0) + 1);
  });
  Array.from(intentStats.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([intent, count]) => {
      console.log(`  ${intent.padEnd(30)} ${count.toString().padStart(4)} (${(count/rows.length*100).toFixed(1)}%)`);
    });

  // 5. Optimization Opportunities
  console.log('\n\n💡 OPTIMIZATION OPPORTUNITIES');
  console.log('─────────────────────────────────────────────────────────');

  // Find P1 pages with short meta descriptions
  const shortMeta = p1.filter(r => r.meta_description.length < 120);
  console.log(`\n1. SHORT META DESCRIPTIONS (P1 only):`);
  console.log(`   ${shortMeta.length} P1 pages have meta descriptions < 120 chars`);
  if (shortMeta.length > 0) {
    console.log(`   Example: ${shortMeta[0].url_slug}`);
    console.log(`   Current: "${shortMeta[0].meta_description.substring(0, 80)}..."`);
    console.log(`   → Expand to 150-160 chars with specific benefits/CTA`);
  }

  // Find pages with weak H1s
  const weakH1 = p1.filter(r => r.h1.length < 30 || !r.h1.toLowerCase().includes(r.city.toLowerCase().split(',')[0]));
  console.log(`\n2. WEAK H1 TAGS (P1 only):`);
  console.log(`   ${weakH1.length} P1 pages may have suboptimal H1s`);
  if (weakH1.length > 0) {
    console.log(`   Example: ${weakH1[0].url_slug}`);
    console.log(`   Current: "${weakH1[0].h1}"`);
    console.log(`   → Add emotional trigger, USP, or immediate benefit`);
  }

  // Find pages with limited internal links
  const fewLinks = p1.filter(r => r.internal_links.split(',').length < 3);
  console.log(`\n3. LIMITED INTERNAL LINKING (P1 only):`);
  console.log(`   ${fewLinks.length} P1 pages have < 3 internal links`);
  console.log(`   → Add contextual links to related services, city hubs, blog content`);

  // 6. Strategic Recommendations
  console.log('\n\n🚀 STRATEGIC RECOMMENDATIONS');
  console.log('─────────────────────────────────────────────────────────');

  console.log('\nQUICK WINS (0-2 weeks):');
  console.log('  1. Enrich top 20 P1 pages with:');
  console.log('     - Customer testimonials specific to that city/service');
  console.log('     - Delivery radius map visualization');
  console.log('     - FAQ schema for "near me" queries');
  console.log('  2. Add "Call Now: (214) 524-4168" to title tags for high-intent P1 pages');
  console.log('  3. Implement breadcrumb schema for better SERP visibility');

  console.log('\nMEDIUM-TERM (2-8 weeks):');
  console.log('  1. Create city hub pages linking to all products/services in that city');
  console.log('  2. Build supporting blog content for each cluster:');
  sortedClusters.slice(0, 5).forEach(([cluster]) => {
    console.log(`     - "${cluster}" → Buying guide, comparison, use cases`);
  });
  console.log('  3. Implement review schema with Google Business Profile reviews');
  console.log('  4. Add image gallery with local delivery photos');

  console.log('\nLONG-TERM (2-6 months):');
  console.log('  1. Build authoritative content hub ("The Complete Guide to...")');
  console.log('  2. Earn local backlinks (chambers of commerce, local business directories)');
  console.log('  3. Launch monthly "Container Spotlight" blog series');
  console.log('  4. Create video walkthroughs for top P1 products/cities');

  // 7. Priority Page List
  console.log('\n\n⭐ TOP 20 PRIORITY PAGES TO OPTIMIZE FIRST');
  console.log('─────────────────────────────────────────────────────────');

  // Score pages by: P1 + high-intent + major city
  const majorCities = ['Dallas', 'Fort Worth', 'Arlington', 'Plano', 'Irving'];
  const scored = p1.map(r => {
    let score = 100; // Base P1 score
    if (r.intent.includes('Transactional')) score += 30;
    if (majorCities.some(c => r.city.includes(c))) score += 20;
    if (r.keyword.includes('shipping container')) score += 10;
    if (r.keyword.includes('sales') || r.keyword.includes('buy')) score += 10;
    return { row: r, score };
  }).sort((a, b) => b.score - a.score).slice(0, 20);

  scored.forEach((item, i) => {
    console.log(`  ${(i+1).toString().padStart(2)}. [Score: ${item.score}] ${item.row.url_slug}`);
    console.log(`      City: ${item.row.city} | Intent: ${item.row.intent}`);
  });

  return {
    totalKeywords: rows.length,
    p1Count: p1.length,
    topCities: topCities.slice(0, 5).map(([city]) => city),
    topClusters: sortedClusters.slice(0, 5).map(([cluster]) => cluster),
    optimizationOpportunities: {
      shortMeta: shortMeta.length,
      weakH1: weakH1.length,
      fewLinks: fewLinks.length
    },
    priorityPages: scored.slice(0, 10).map(s => s.row.url_slug)
  };
}

// Run analysis
const csvPath = path.join(process.cwd(), 'src/data/lccontainer_keyword_plan.csv');
const rows = parseCSV(csvPath);
const analysis = analyzeKeywords(rows);

// Export for programmatic use
const outputPath = path.join(process.cwd(), 'reports/keyword-analysis-results.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

console.log(`\n\n✅ Analysis complete! Results saved to: reports/keyword-analysis-results.json`);
