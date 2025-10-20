import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CITIES } from "../data/cities";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site not found', { status: 404 });
  }

  const pages = [
    {
      url: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: '/about',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: '/services',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/services/buy',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: '/services/lease',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: '/services/custom-builds',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/custom-builds',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/services/delivery',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: '/contact',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    },

    {
      url: '/privacy',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/terms',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/cookies',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/accessibility',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/disclaimer',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: '/shipping-and-delivery',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.4
    },
    {
      url: '/returns-and-refunds',
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.4
    },
    {
      url: '/inventory',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/faq',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: '/city',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    }
  ];

  // Add city pages
  const cityPages = CITIES.map(city => ({
    url: `/city/${city.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.8
  }));

  // Include programmatic loc pages that are indexable
  const locEntries = await getCollection('loc');
  const locPages = locEntries
    .filter((e) => !e.data.noindex)
    .map((e) => ({
      url: e.data.url_slug.replace(/\/$/, ''),
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.7
    }));

  const allPages = [...pages, ...cityPages, ...locPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `
  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`).join('')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
