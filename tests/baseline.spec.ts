import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Inventory', url: '/inventory' },
  { name: 'Gallery', url: '/gallery' },
  { name: 'Dallas City Page', url: '/city/dallas' },
  { name: 'Contact', url: '/contact' }
];

test.describe('Baseline Performance Tests', () => {
  for (const page of pages) {
    test(`Page loads successfully: ${page.name}`, async ({ page: playwrightPage }) => {
      const startTime = Date.now();

      await playwrightPage.goto(page.url);

      // Wait for page to be fully loaded
      await playwrightPage.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      console.log(`${page.name} load time: ${loadTime}ms`);

      // Assert reasonable load time (under 10 seconds)
      expect(loadTime).toBeLessThan(10000);

      // Check for critical elements
      await expect(playwrightPage.locator('body')).toBeVisible();
    });
  }
});

test.describe('CTA and Phone Link Tests', () => {
  test('Home page has working CTAs', async ({ page }) => {
    await page.goto('/');

    // Check primary CTA button exists
    const primaryCTA = page.locator('a[href="/contact"]').first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', '/contact');

    // Check phone link exists
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href');
  });

  test('Mobile sticky CTA works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check if sticky CTA exists on mobile
    const stickyCTA = page.locator('.fixed.bottom-0');
    await expect(stickyCTA).toBeVisible();

    // Check both call and quote buttons
    const callButton = stickyCTA.locator('a[href^="tel:"]');
    const quoteButton = stickyCTA.locator('a[href="/contact"]');

    await expect(callButton).toBeVisible();
    await expect(quoteButton).toBeVisible();
  });

  test('Form exists and is functional', async ({ page }) => {
    await page.goto('/contact');

    // Check if form exists
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Check for required form fields
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const phoneField = page.locator('#phone');

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(phoneField).toBeVisible();
  });
});
