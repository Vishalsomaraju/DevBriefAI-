/**
 * @module tests/e2e/smoke.spec.ts
 * @description Playwright E2E smoke test suite.
 * Verifies the app loads, critical landmarks exist, and core
 * accessibility features work. Runs in CI on every PR.
 *
 * These tests do NOT test business logic — that's Vitest's job.
 * They prove the app actually runs end-to-end in a real browser.
 */

import { test, expect } from '@playwright/test';

// ── App shell ────────────────────────────────────────────────────────────────

test('app loads with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/__APP_NAME__/i);
});

test('main navigation is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('main content landmark is present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main')).toBeVisible();
});

// ── Accessibility ─────────────────────────────────────────────────────────────

test('skip-to-content link is first focusable element', async ({ page }) => {
  await page.goto('/');
  // Tab once — the skip link should be the very first focusable element
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toContainText(/skip to main content/i);
});

test('no images are missing alt text', async ({ page }) => {
  await page.goto('/');
  // Wait for lazy content to load
  await page.waitForLoadState('networkidle');
  const imagesWithoutAlt = page.locator('img:not([alt])');
  await expect(imagesWithoutAlt).toHaveCount(0);
});

test('page has a single h1', async ({ page }) => {
  await page.goto('/');
  const h1s = page.locator('h1');
  await expect(h1s).toHaveCount(1);
});

// ── PWA ──────────────────────────────────────────────────────────────────────

test('manifest.json is linked in the page', async ({ page }) => {
  await page.goto('/');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveCount(1);
});

// ── Critical user flow ────────────────────────────────────────────────────────
// TODO: Replace with the core action of this challenge.
// Examples:
//   - Search: fill search box, expect results container to appear
//   - Form: fill required fields, submit, expect success message
//   - Navigation: click nav link, expect URL to change

test('core user flow is reachable', async ({ page }) => {
  await page.goto('/');
  // Replace this assertion with the first step of the actual user flow
  await expect(page.getByRole('main')).toBeVisible();
});
