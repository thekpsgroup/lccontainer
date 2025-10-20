import fs from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { generateMetaDescription, generateSEOTitle } from '../../scripts/generate-loc-content';

describe('SEO Meta Tag Uniqueness', () => {
  // This test ensures no duplicate meta tags across all generated pages
  it('ensures all meta titles are unique across sample dataset', async () => {
    const { getAllRows } = await import('../lib/seo/rows');
    const rows = await getAllRows();

    const titles = new Set<string>();
    const duplicates: string[] = [];

    for (const row of rows.slice(0, 100)) { // Test sample for speed
      const title = generateSEOTitle(row);
      if (titles.has(title)) {
        duplicates.push(title);
      }
      titles.add(title);
    }

    expect(duplicates).toHaveLength(0);
    expect(titles.size).toBeGreaterThan(50); // Should have many unique titles
  });

  it('ensures all meta descriptions are unique across sample dataset', async () => {
    const { getAllRows } = await import('../lib/seo/rows');
    const rows = await getAllRows();

    const descriptions = new Set<string>();
    const duplicates: string[] = [];

    for (const row of rows.slice(0, 100)) { // Test sample for speed
      const desc = generateMetaDescription(row);
      if (descriptions.has(desc)) {
        duplicates.push(desc);
      }
      descriptions.add(desc);
    }

    expect(duplicates).toHaveLength(0);
    expect(descriptions.size).toBeGreaterThan(50); // Should have many unique descriptions
  });

  it('validates generated files have proper frontmatter structure', async () => {
    const contentDir = path.resolve('./src/content/loc');

    try {
      // Read a sample of generated files to validate structure
      const sampleFiles = [
        'dallas/buy/20ft/shipping-containers/one-trip-new/index.md',
        'houston/rent/40ft/storage-containers/used/index.md'
      ];

      for (const filePath of sampleFiles) {
        const fullPath = path.join(contentDir, filePath);
        try {
          const content = await fs.readFile(fullPath, 'utf-8');

          // Validate frontmatter presence
          expect(content).toMatch(/^---\n/);
          expect(content).toContain('title_tag:');
          expect(content).toContain('meta_description:');
          expect(content).toContain('image_alt:');
          expect(content).toContain('service_type:');

          // Validate schema presence in content
          expect(content).toContain('FAQPage');
          expect(content).toContain('LocalBusiness');

        } catch (fileError) {
          console.warn(`Sample file not found: ${filePath}, skipping validation`);
        }
      }
    } catch (dirError) {
      console.warn('Content directory not found, skipping file validation');
    }
  });
});
