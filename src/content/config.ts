import { defineCollection, z } from 'astro:content';

export const loc = defineCollection({
  type: 'content',
  schema: z.object({
    cluster: z.string(),
    subcluster: z.string(),
    keyword: z.string(),
    intent: z.string(),
    page_type: z.enum(['Location Service Hub', 'Location-Product', 'Location-Service', 'Blog/FAQ']),
    city: z.string(),
    title_tag: z.string(),
    meta_description: z.string(),
    url_slug: z.string(),
    h1: z.string(),
    internal_links: z.string(),
    priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    notes: z.string(),
    noindex: z.boolean().optional(),
  }),
});

export const collections = { loc };
