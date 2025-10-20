import { expect, test } from '@playwright/test';

test.describe('Programmatic location pages', () => {
  const samplePaths = [
    '/dallas/shipping-containers/sales',
    '/arlington/storage-containers/rentals',
  ];

  for (const p of samplePaths) {
    test(`renders and includes SEO for ${p}`, async ({ page }) => {
      const res = await page.goto(p, { waitUntil: 'domcontentloaded' });
      expect(res?.ok()).toBeTruthy();

      await expect(page.locator('h1')).toBeVisible();
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);

      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDesc).toBeTruthy();

      // Phone CTA present (prefer sticky call bar on mobile)
      const phone = page.locator('.sticky-call-bar a[href^="tel:"]');
      await expect(phone).toBeVisible();
    });
  }
});
