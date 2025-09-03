import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *
Allow: /

# Block access to admin areas (if any)
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/

# Allow all major search engine bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay to be respectful
Crawl-delay: 1

# Sitemap location
Sitemap: https://lccontainer.com/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    }
  );
};
