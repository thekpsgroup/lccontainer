import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('Desktop navigation works', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop navigation test');

    await page.goto('/');

    // Check navigation links are visible
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(5);

    // Check current page highlighting
    const homeLink = page.locator('nav a').first();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  test('Mobile menu functionality', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto('/');

    // Check mobile menu button exists
    const menuButton = page.locator('#mobile-menu-button');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Check menu panel is visible
    const menuPanel = page.locator('#mobile-menu');
    await expect(menuPanel).toBeVisible();

    // Check navigation links in mobile menu
    const mobileNavLinks = page.locator('#mobile-menu nav a');
    await expect(mobileNavLinks).toHaveCount(5);

    // Close menu
    const closeButton = page.locator('#mobile-menu-close');
    await closeButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('Navigation keyboard accessibility', async ({ page }) => {
    await page.goto('/');

    // Skip link should be visible when focused
    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();

    // Test tab navigation through desktop nav (if visible)
    if (await page.locator('nav').isVisible()) {
      await page.keyboard.press('Tab');
      const firstNavLink = page.locator('nav a').first();
      await expect(firstNavLink).toBeFocused();
    }
  });

  test('Navigation links work correctly', async ({ page }) => {
    await page.goto('/');

    // Test navigation to services page
    const servicesLink = page.locator('nav a').filter({ hasText: 'Services' });
    await servicesLink.click();
    await expect(page).toHaveURL(/.*services/);

    // Navigate back and test contact link
    await page.goto('/');
    const contactLink = page.locator('nav a').filter({ hasText: 'Contact' });
    await contactLink.click();
    await expect(page).toHaveURL(/.*contact/);
  });
});
