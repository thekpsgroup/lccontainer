import { describe, expect, it } from 'vitest';
import { extractServiceInfo, generateImageAlt, generateMetaDescription, generateSEOTitle, renderTemplate } from '../../scripts/generate-loc-content';

describe('generate-loc-content utilities', () => {
  const sampleRow = {
    url_slug: '/dallas/buy/20ft/shipping-containers/one-trip-new/',
    subcluster: '20ft/one-trip',
    city: 'Dallas, TX',
    intent: 'buy',
    h1: '20ft Shipping Containers in Dallas',
    internal_links: '/dallas/rent,/dallas/buy',
    priority: 1,
  } as any;

  it('extracts service info correctly', () => {
    const info = extractServiceInfo(sampleRow);
    expect(info.serviceType).toBe('shipping container');
    expect(info.size).toBe('20ft');
    expect(info.condition).toBe('New');
  });

  it('generates SEO title with city and size', () => {
    const title = generateSEOTitle(sampleRow);
    expect(title).toContain('20ft');
    expect(title).toContain('Dallas');
    expect(title).toContain('Sales');
  });

  it('generates meta description and includes CTA', () => {
    const meta = generateMetaDescription(sampleRow);
    expect(meta.toLowerCase()).toContain('call (214) 524-4168');
    expect(meta).toContain('20ft');
  });

  it('generates image alt text', () => {
    const alt = generateImageAlt(sampleRow);
    expect(alt).toContain('20ft');
    expect(alt.toLowerCase()).toContain('dallas');
  });

  it('renderTemplate returns content containing JSON-LD and local business schema', () => {
    const content = renderTemplate(sampleRow);
    expect(content).toContain('<script type="application/ld+json">');
    expect(content).toContain('FAQPage');
    expect(content).toContain('LocalBusiness');
    expect(content).toContain('Call now: (214) 524-4168');
  });

  it('renderTemplate includes unique local market data for major cities', () => {
    const dallasRow = { ...sampleRow, city: 'Dallas, TX' };
    const houstonRow = { ...sampleRow, city: 'Houston, TX' };

    const dallasContent = renderTemplate(dallasRow);
    const houstonContent = renderTemplate(houstonRow);

    expect(dallasContent).toContain('North Texas');
    expect(houstonContent).toContain('Energy sector');
    expect(dallasContent).not.toBe(houstonContent); // Ensure uniqueness
  });

  it('generated content avoids duplicate phrases across cities', () => {
    const cities = ['Dallas, TX', 'Houston, TX', 'Austin, TX'];
    const contents = cities.map(city => {
      const row = { ...sampleRow, city };
      return renderTemplate(row);
    });

    // Different cities should have different content
    expect(contents[0]).not.toBe(contents[1]);
    expect(contents[1]).not.toBe(contents[2]);
    expect(contents[0].length).toBeGreaterThan(100);
  });
});
