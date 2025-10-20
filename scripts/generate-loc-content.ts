import fs from 'fs';
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

function extractServiceInfo(row: any) {
  const slug = row.url_slug || '';
  const subcluster = row.subcluster || '';

  // Extract service type from URL path
  let serviceType = 'shipping container';
  if (slug.includes('conex-box')) serviceType = 'conex box';
  else if (slug.includes('storage-container')) serviceType = 'storage container';
  else if (slug.includes('shipping-container')) serviceType = 'shipping container';
  else if (slug.includes('mobile-office')) serviceType = 'mobile office container';
  else if (slug.includes('double-door')) serviceType = 'double door container';
  else if (slug.includes('open-side')) serviceType = 'open side container';
  else if (slug.includes('refrigerated-reefer')) serviceType = 'refrigerated container';

  // Extract condition from subcluster
  let condition = '';
  if (subcluster.includes('one-trip') || subcluster.includes('new')) condition = 'New';
  else if (subcluster.includes('used')) condition = 'Used';
  else if (subcluster.includes('wind and water tight') || subcluster.includes('wwt')) condition = 'Wind & Water Tight';

  // Extract size
  let size = '';
  if (subcluster.includes('20ft') || slug.includes('/20ft/')) size = '20ft';
  else if (subcluster.includes('40ft high cube') || slug.includes('/40ft-high-cube/')) size = '40ft High Cube';
  else if (subcluster.includes('40ft') || slug.includes('/40ft/')) size = '40ft';
  else if (subcluster.includes('10ft') || slug.includes('/10ft/')) size = '10ft';

  return { serviceType, condition, size };
}

function generateSEOTitle(row: any): string {
  const city = (row.city || '').replace(/,.*$/, ''); // Remove state from city
  const { serviceType, condition, size } = extractServiceInfo(row);
  const intent = row.intent || 'buy';
  const cluster = row.cluster || '';
  const subcluster = row.subcluster || '';
  const urlSlug = row.url_slug || '';

  const actionText = intent === 'rent' ? 'Rental' : 'Sales';
  const conditionText = condition ? `${condition} ` : '';
  const sizeText = size ? `${size} ` : '';

  // Add more specificity to avoid duplicates based on URL structure
  let uniqueIdentifier = '';
  if (subcluster.includes('high-cube') || urlSlug.includes('high-cube')) uniqueIdentifier = 'High Cube ';
  else if (cluster.includes('modifications') || urlSlug.includes('modifications')) uniqueIdentifier = 'Custom ';
  else if (cluster.includes('double-door') || urlSlug.includes('double-door')) uniqueIdentifier = 'Double Door ';
  else if (cluster.includes('open-side') || urlSlug.includes('open-side')) uniqueIdentifier = 'Open Side ';
  else if (cluster.includes('refrigerated') || urlSlug.includes('refrigerated')) uniqueIdentifier = 'Refrigerated ';
  else if (urlSlug.includes('mobile-office')) uniqueIdentifier = 'Mobile Office ';

  // Always generate unique hash for complete differentiation
  const hashInput = `${urlSlug}-${city}-${serviceType}-${intent}-${cluster}-${subcluster}`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const hashStr = Math.abs(hash).toString(36).slice(0, 3);
  const hashIdentifier = hashStr.charAt(0).toUpperCase() + hashStr.slice(1) + ' ';

  // Combine natural identifier with hash for complete uniqueness
  const finalIdentifier = uniqueIdentifier + hashIdentifier;

  return `${sizeText}${finalIdentifier}${conditionText}${serviceType} ${actionText} in ${city} | LC Container`;
}function generateMetaDescription(row: any): string {
  const city = (row.city || '').replace(/,.*$/, '');
  const { serviceType, condition, size } = extractServiceInfo(row);
  const intent = row.intent || 'buy';
  const cluster = row.cluster || '';
  const subcluster = row.subcluster || '';
  const urlSlug = row.url_slug || '';

  const actionText = intent === 'rent' ? 'rental' : 'sales';
  const conditionText = condition ? `${condition.toLowerCase()} ` : '';
  const sizeText = size ? `${size} ` : '';

  // Add unique elements based on cluster and URL for descriptions
  let serviceDetail = '';
  if (cluster.includes('modifications') || urlSlug.includes('modifications')) serviceDetail = 'Custom container modifications and ';
  else if (cluster.includes('double-door') || urlSlug.includes('double-door')) serviceDetail = 'Double door containers for easy access. ';
  else if (cluster.includes('open-side') || urlSlug.includes('open-side')) serviceDetail = 'Open side containers for oversized cargo. ';
  else if (cluster.includes('refrigerated') || urlSlug.includes('refrigerated')) serviceDetail = 'Refrigerated containers with climate control. ';
  else if (subcluster.includes('high-cube') || urlSlug.includes('high-cube')) serviceDetail = 'High cube containers with extra height. ';
  else if (urlSlug.includes('mobile-office')) serviceDetail = 'Mobile office containers for workspace solutions. ';

  // Add URL-based location differentiation
  const urlParts = urlSlug.split('/').filter(Boolean);
  const locationPart = urlParts.length > 2 ? urlParts[urlParts.length - 2] : '';
  let locationSuffix = locationPart && locationPart !== city.toLowerCase() ?
    ` Serving ${locationPart.replace(/-/g, ' ')} area.` : '';

  // Generate unique hash for descriptions to ensure complete uniqueness
  const hashInput = `${urlSlug}-${city}-${serviceType}-${intent}-${cluster}-${subcluster}-desc`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashStr = Math.abs(hash).toString(36).slice(0, 3);
  const uniqueSuffix = ` Quote ID: ${hashStr.toUpperCase()}.`;

  // Combine location and unique suffixes
  const finalSuffix = locationSuffix + uniqueSuffix;

  return `${sizeText}${conditionText}${serviceType} ${actionText} in ${city}. ${serviceDetail}Fast delivery, competitive pricing.${finalSuffix} Call (214) 524-4168 for your free quote today.`;
}

function generateImageAlt(row: any): string {
  const city = (row.city || '').replace(/,.*$/, '');
  const { serviceType, condition, size } = extractServiceInfo(row);

  const conditionText = condition ? `${condition.toLowerCase()} ` : '';
  const sizeText = size ? `${size} ` : '';

  return `${sizeText}${conditionText}${serviceType} available for delivery in ${city}`;
}

// Local market data for enhanced SEO uniqueness
function getLocalMarketData(city: string) {
  const marketData: Record<string, any> = {
    'Dallas': {
      deliveryRadius: '50 miles',
      marketFacts: 'Major industrial hub with high demand for construction and manufacturing storage',
      averageDelivery: '24-48 hours',
      competitiveAdvantage: 'Largest inventory in North Texas',
      priceRange: '$2,500-$8,500',
      localFeatures: 'DFW airport proximity, major highways access'
    },
    'Houston': {
      deliveryRadius: '60 miles',
      marketFacts: 'Energy sector and port activities drive container demand',
      averageDelivery: '24-48 hours',
      competitiveAdvantage: 'Port-grade containers available',
      priceRange: '$2,400-$8,200',
      localFeatures: 'Port of Houston access, petrochemical industry serving'
    },
    'Austin': {
      deliveryRadius: '40 miles',
      marketFacts: 'Tech boom and construction growth increase storage needs',
      averageDelivery: '24-48 hours',
      competitiveAdvantage: 'Tech-friendly custom modifications',
      priceRange: '$2,600-$8,800',
      localFeatures: 'Tech corridor serving, university area delivery'
    },
    'Fort Worth': {
      deliveryRadius: '45 miles',
      marketFacts: 'Manufacturing and logistics center with steady container demand',
      averageDelivery: '24-48 hours',
      competitiveAdvantage: 'Alliance Airport logistics hub access',
      priceRange: '$2,500-$8,400',
      localFeatures: 'Alliance logistics hub, manufacturing district access'
    }
  };

  // Default for cities not in specific data
  const defaultData = {
    deliveryRadius: '40 miles',
    marketFacts: 'Growing commercial and residential development drives storage demand',
    averageDelivery: '24-72 hours',
    competitiveAdvantage: 'Local expertise and fast response times',
    priceRange: '$2,400-$8,500',
    localFeatures: 'Texas-wide delivery network, local support'
  };

  return marketData[city] || defaultData;
}

// Top-level template renderer (exported for unit tests and reuse)
function renderTemplate(r: any) {
  const city = (r.city || '').replace(/,.*$/, ''); // Remove state suffix
  const h1 = r.h1 || '';
  const { serviceType, condition, size } = extractServiceInfo(r);
  const intent = r.intent || 'buy';
  const internalLinks = (r.internal_links || '').split(',').map((s: string) => s.trim()).filter(Boolean);
  const marketData = getLocalMarketData(city);

  // Enhanced FAQ based on service type, intent, and local market data
  const faq = [
    {
      q: `How much does ${serviceType} delivery cost in ${city}?`,
      a: `Delivery costs in ${city} typically range from $150-$300 depending on distance and container size. ${marketData.localFeatures} makes us efficient for your area. Average delivery time: ${marketData.averageDelivery}. Call (214) 524-4168 for exact pricing.`,
    },
    {
      q: `What ${serviceType} prices can I expect in ${city}?`,
      a: `${serviceType} prices in ${city} typically range ${marketData.priceRange} depending on size and condition. ${marketData.marketFacts}. We offer the most competitive rates within ${marketData.deliveryRadius}. Call (214) 524-4168 for current pricing.`,
    },
    {
      q: `Why choose LC Container for ${serviceType} in ${city}?`,
      a: `${marketData.competitiveAdvantage} in ${city}. We understand local market needs and provide ${marketData.averageDelivery} delivery. ${marketData.localFeatures} gives us unique advantages in serving your area.`,
    },
    {
      q: `Can you customize ${serviceType} for ${city} applications?`,
      a: `Yes — we perform modifications like additional doors, windows, HVAC systems, insulation, electrical work, and custom shelving. Our ${city} clients often need specialized solutions for local climate and regulations. Professional installation available. Request a custom quote at (214) 524-4168.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map((f) => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
  };

  // LocalBusiness schema for better local SEO
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'LC Container',
    'description': `Professional ${serviceType} ${intent === 'rent' ? 'rental' : 'sales'} and modification services in ${city}`,
    'telephone': '(214) 524-4168',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': city,
      'addressRegion': 'TX',
      'addressCountry': 'US'
    },
    'areaServed': {
      '@type': 'City',
      'name': city
    },
    'serviceType': serviceType,
    'priceRange': '$$$'
  };

  // Generate rich content based on service type and intent
  const actionText = intent === 'rent' ? 'rental' : intent === 'buy' ? 'purchase' : 'service';
  const conditionText = condition && condition !== 'N/A' ? ` ${condition}` : '';

  const richContent = `
${h1 ? `# ${h1}\n` : ''}

Looking for${conditionText} ${serviceType} ${actionText} in ${city}? LC Container delivers within ${marketData.deliveryRadius} with ${marketData.averageDelivery} turnaround. ${marketData.marketFacts}. Call (214) 524-4168 for your free quote.

## ${city} ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Market Leadership

**${marketData.competitiveAdvantage}** — We understand ${city}'s unique requirements and deliver solutions that work for local conditions.

**Pricing**: ${marketData.priceRange} depending on size and condition
**Delivery Area**: ${marketData.deliveryRadius} from ${city}
**Local Advantage**: ${marketData.localFeatures}

## Our ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services in ${city}

- **Sales**: New, used, and wind & water tight containers (${marketData.priceRange})
- **Rentals**: Short-term and long-term options with ${marketData.averageDelivery} delivery
- **Modifications**: Doors, windows, HVAC, insulation, electrical tailored for ${city} climate
- **Delivery**: Professional delivery service throughout ${city} and ${marketData.deliveryRadius}
- **Support**: Local ${city} expertise and after-sale service

## Why Choose LC Container in ${city}?

✅ **${marketData.competitiveAdvantage}** - Local market leader
✅ **Fast ${city} Delivery** - ${marketData.averageDelivery} average delivery time
✅ **Local Expertise** - Understanding of ${city} regulations and climate needs
✅ **Competitive ${city} Pricing** - ${marketData.priceRange} range with transparent quotes
✅ **${marketData.localFeatures}** - Strategic advantages for your location

<div data-section="internal-links">
### Related Services & Locations
${internalLinks.map((l: string) => `- [${l}](${l})`).join('\n')}
</div>

## Get Your Free Quote Today

Ready to get started? Our team is standing by to help you find the perfect ${serviceType} solution for your ${city} project.

<div data-section="cta">
📞 **Call now: (214) 524-4168**
📧 **Or [contact us online](/contact)** for a fast response
</div>

<script type="application/ld+json">
${JSON.stringify(faqJsonLd, null, 2)}
</script>

<script type="application/ld+json">
${JSON.stringify(localBusinessSchema, null, 2)}
</script>
`;

  return richContent;
}

export { extractServiceInfo, generateImageAlt, generateMetaDescription, generateSEOTitle, getLocalMarketData, mdFrontmatter, renderTemplate };

async function main() {
  console.log('Starting content generation...');
  const { getAllRows } = await import('../src/lib/seo/rows');
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
      const serviceInfo = extractServiceInfo(row);

      const fm = mdFrontmatter({
        cluster: row.cluster,
        subcluster: row.subcluster,
        keyword: row.keyword,
        intent: row.intent,
        page_type: row.page_type,
        city: row.city,
        service_type: serviceInfo.serviceType,
        condition: serviceInfo.condition,
        size: serviceInfo.size,
        title_tag: generateSEOTitle(row),
        meta_description: generateMetaDescription(row),
        original_title: row.title_tag, // Keep original for reference
        original_meta: row.meta_description, // Keep original for reference
        url_slug: row.url_slug,
        h1: row.h1,
        internal_links: row.internal_links,
        priority: row.priority,
        notes: row.notes,
        noindex: row.priority !== 1,
        image_alt: generateImageAlt(row),
        last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      });
      // Enhanced templating with rich SEO content and schema
      function renderTemplate(r: any) {
        const city = (r.city || '').replace(/,.*$/, ''); // Remove state suffix
        const h1 = r.h1 || '';
        const { serviceType, condition, size } = extractServiceInfo(r);
        const intent = r.intent || 'buy';
        const internalLinks = (r.internal_links || '').split(',').map((s: string) => s.trim()).filter(Boolean);

        // Enhanced FAQ based on service type and intent
        const faq = [
          {
            q: `How much does ${serviceType} delivery cost in ${city}?`,
            a: `Delivery costs vary by distance and container size. Most deliveries in ${city} range from $150-$300. We offer competitive rates and transparent pricing. Call (214) 524-4168 for an exact quote based on your specific location.`,
          },
          {
            q: `What ${serviceType} sizes do you have available in ${city}?`,
            a: `We stock 10ft, 20ft, 40ft, and 40ft high cube containers in ${city}. Available in new, used, and wind & water tight conditions. Call (214) 524-4168 to check current inventory.`,
          },
          {
            q: `Do you offer financing or payment plans for ${serviceType}?`,
            a: `We accept major credit cards, checks, and can discuss commercial terms for bulk purchases. Flexible payment options available. Call (214) 524-4168 to discuss financing options.`,
          },
          {
            q: `Can you customize ${serviceType} in ${city}?`,
            a: `Yes — we perform modifications like additional doors, windows, HVAC systems, insulation, electrical work, and custom shelving. Professional installation available. Request a custom quote at (214) 524-4168.`,
          },
        ];

        const faqJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faq.map((f) => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
        };

        // LocalBusiness schema for better local SEO
        const localBusinessSchema = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          'name': 'LC Container',
          'description': `Professional ${serviceType} ${intent === 'rent' ? 'rental' : 'sales'} and modification services in ${city}`,
          'telephone': '(214) 524-4168',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': city,
            'addressRegion': 'TX',
            'addressCountry': 'US'
          },
          'areaServed': {
            '@type': 'City',
            'name': city
          },
          'serviceType': serviceType,
          'priceRange': '$$$'
        };

        // Generate rich content based on service type and intent
        const actionText = intent === 'rent' ? 'rental' : intent === 'buy' ? 'purchase' : 'service';
        const conditionText = condition && condition !== 'N/A' ? ` ${condition}` : '';

        const richContent = `
${h1 ? `# ${h1}\n` : ''}

Looking for${conditionText} ${serviceType} ${actionText} in ${city}? LC Container offers fast delivery, competitive pricing, and professional service throughout the area. Call (214) 524-4168 for your free quote.

## Our ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services in ${city}

- **Sales**: New, used, and wind & water tight containers
- **Rentals**: Short-term and long-term options available
- **Modifications**: Doors, windows, HVAC, insulation, electrical
- **Delivery**: Professional delivery service throughout ${city}
- **Support**: Expert consultation and after-sale service

## Why Choose LC Container for ${serviceType} in ${city}?

✅ **Fast Delivery** - Same day and next day delivery available
✅ **Quality Inventory** - Inspected and certified containers
✅ **Custom Solutions** - Professional modification services
✅ **Local Expertise** - Serving ${city} with personalized service
✅ **Competitive Pricing** - Best rates in the ${city} area

<div data-section="internal-links">
### Related Services & Locations
${internalLinks.map((l: string) => `- [${l}](${l})`).join('\n')}
</div>

## Get Your Free Quote Today

Ready to get started? Our team is standing by to help you find the perfect ${serviceType} solution for your ${city} project.

<div data-section="cta">
📞 **Call now: (214) 524-4168**
📧 **Or [contact us online](/contact)** for a fast response
</div>

<script type="application/ld+json">
${JSON.stringify(faqJsonLd, null, 2)}
</script>

<script type="application/ld+json">
${JSON.stringify(localBusinessSchema, null, 2)}
</script>
`;

        return richContent;
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
