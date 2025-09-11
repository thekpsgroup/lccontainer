# LC Container Programmatic Local SEO

## How to Add/Update Local SEO Pages

1. **Edit the CSV**

   - Update `src/data/lccontainer_keyword_plan.csv` with new rows or edits.
   - Each row = one page. Ensure unique, normalized slugs.

2. **Rebuild Content**

   - Run the content generation script (to be added) to sync CSV → `src/content/loc/`.
   - Run `astro build` to regenerate static pages.

3. **Quality Gates**

   - Only Priority 1 pages with ≥250 words, 1+ unique image, 3+ internal links, and valid schema are indexable.
   - Priority 2–3 pages are `noindex,follow` until enriched.

4. **Testing**

   - Run `pnpm run seo-qa` to check a sample of pages for SEO compliance.
   - CI will block PRs if QA fails.

5. **Sitemap & Robots**

   - Sitemaps and robots.txt are auto-generated. Only indexable pages are included.

6. **Promoting Pages**
   - To move a page from noindex → index, enrich content and set priority to 1 in the CSV, then rebuild.

## Local Dev

```bash
pnpm install
astro build && astro preview
```

## Feature Branch

- All changes for programmatic SEO are in `feat/programmatic-local-seo`.

## Checklist to Promote P2 Pages

- [ ] Enrich content to meet quality gates
- [ ] Set priority to 1 in CSV
- [ ] Rebuild and QA
- [ ] Confirm page is indexable and in sitemap
