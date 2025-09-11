import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Inventory', url: '/inventory' },
  { name: 'Gallery', url: '/gallery' },
  { name: 'Dallas City Page', url: '/city/dallas' },
  { name: 'Contact', url: '/contact' }
];

test.describe('Accessibility Tests', () => {
  for (const page of pages) {
    test(`A11y check for ${page.name}`, async ({ page: playwrightPage }) => {
      await playwrightPage.goto(page.url);

      // Wait for page to be fully loaded
      await playwrightPage.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page: playwrightPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Check for critical violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        violation => violation.impact === 'critical' || violation.impact === 'serious'
      );

      // Log violations for debugging
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`${page.name} - Accessibility violations:`, accessibilityScanResults.violations);
      }

      // Assert no critical violations
      expect(criticalViolations).toHaveLength(0);

      // Log summary
      console.log(`${page.name} - Total violations: ${accessibilityScanResults.violations.length}`);
      console.log(`${page.name} - Passed checks: ${accessibilityScanResults.passes.length}`);
    });
  }
});

test.describe('Performance and UX Tests', () => {
  test('Home page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for hero image to load
    await page.waitForSelector('img[alt*="LC Container"]');

    // Wait for main content
    await page.waitForSelector('main');

    const loadTime = Date.now() - startTime;
    console.log(`Home page load time: ${loadTime}ms`);

    // Assert reasonable load time (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('Mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check if mobile menu button exists
    const mobileMenuButton = page.locator('#mobile-menu-button');
    await expect(mobileMenuButton).toBeVisible();

    // Open mobile menu
    await mobileMenuButton.click();

    // Check if mobile menu is visible
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();

    // Check navigation links are accessible
    const navLinks = mobileMenu.locator('a[role="menuitem"]');
    await expect(navLinks).toHaveCountGreaterThan(0);
  });

  test('CTA buttons are accessible', async ({ page }) => {
    await page.goto('/');

    // Check primary CTA button
    const primaryCTA = page.locator('a[href="/contact"]').first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('aria-label');

    // Check phone link
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
  });
});
