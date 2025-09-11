import { test, expect } from '@playwright/test';

test.describe('Typography System Tests', () => {
  test('Hero typography renders correctly', async ({ page }) => {
    await page.goto('/');

    // Check hero title has correct typography classes
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toHaveClass(/hero-title/);

    // Check hero subtitle has correct classes
    const heroSubtitle = page.locator('.hero-subtitle');
    await expect(heroSubtitle).toBeVisible();
  });

  test('Heading hierarchy is correct', async ({ page }) => {
    await page.goto('/');

    // Check H1 exists and has correct styling
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toHaveClass(/heading-1/);

    // Check H2 has correct styling
    const h2 = page.locator('h2').first();
    await expect(h2).toHaveClass(/heading-2/);
  });

  test('Body text uses correct typography', async ({ page }) => {
    await page.goto('/');

    // Check body text has proper line height and sizing
    const bodyText = page.locator('p').first();
    await expect(bodyText).toBeVisible();

    // Check computed styles for proper typography
    const fontSize = await bodyText.evaluate(el => getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16); // Minimum 16px for accessibility
  });

  test('Font loading works correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for fonts to load
    await page.waitForFunction(() => {
      return document.fonts.ready.then(() => {
        const fontFace = document.fonts.check('16px Inter');
        return fontFace;
      });
    });

    // Check that Inter font is loaded
    const body = page.locator('body');
    const fontFamily = await body.evaluate(el => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Inter');
  });

  test('Responsive typography scales properly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto('/');

    // Check that headings scale down on mobile
    const h1 = page.locator('h1').first();
    const h1FontSize = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize));

    // Mobile H1 should be smaller than desktop
    expect(h1FontSize).toBeLessThan(60); // Less than desktop size
    expect(h1FontSize).toBeGreaterThan(30); // But still readable
  });
});
