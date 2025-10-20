import { expect, test } from '@playwright/test';

// These pages are high-priority P1 examples — adjust if needed
const samplePages = [
  '/dallas/shipping-containers/sales',
  '/fort-worth/shipping-containers/sales'
];

for (const p of samplePages) {
  test(`QA checks for ${p}`, async ({ page }) => {
    const QA_BASE = process.env.QA_BASE || 'http://127.0.0.1:9000';
    const url = new URL(p, QA_BASE).toString();
    const r = await page.goto(url, { waitUntil: 'domcontentloaded' });
    expect(r?.ok()).toBeTruthy();

    // H1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);

    // Meta description
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();

    // Robots meta
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toBeTruthy();

    // JSON-LD present
    const jsonld = await page.locator('script[type="application/ld+json"]').first().innerText();
    expect(jsonld.length).toBeGreaterThan(20);

    // Phone CTA in sticky bar or header
    const phone = page.locator('.sticky-call-bar a[href^="tel:"]');
    await expect(phone).toBeVisible();

    // Internal links count
    const internalLinks = await page.locator('a[href^="/"] >> visible=true').count();
    expect(internalLinks).toBeGreaterThan(0);
  });
}
