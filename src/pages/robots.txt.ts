import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: https://lccontainer.com/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
};
