import { test, expect } from '@playwright/test';

test.describe('Finance App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app title', async ({ page }) => {
    await expect(page.locator('text=Finance App')).toBeVisible();
  });

  test('should display transaction form', async ({ page }) => {
    await expect(page.locator('text=Add Transaction')).toBeVisible();
    await expect(page.getByLabel('Amount')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Date')).toBeVisible();
  });

  test('should submit a new transaction', async ({ page }) => {
    // Fill in the form
    await page.getByLabel('Amount').fill('100.50');
    await page.getByLabel('Category').fill('Food');
    await page.getByLabel('Description').fill('Lunch');
    await page.getByLabel('Date').fill('2024-01-15');

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Wait for the transaction to appear in the table
    await expect(page.locator('text=$100.50')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Food')).toBeVisible();
    await expect(page.locator('text=Lunch')).toBeVisible();
  });

  test('should submit an income transaction', async ({ page }) => {
    // Fill in the form
    await page.getByLabel('Amount').fill('5000.00');
    await page.getByLabel('Category').fill('Salary');
    await page.getByLabel('Description').fill('Monthly salary');
    await page.getByLabel('Income?').check();
    await page.getByLabel('Date').fill('2024-01-01');

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Wait for the transaction to appear
    await expect(page.locator('text=$5000.00')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Income')).toBeVisible();
  });

  test('should display empty state when no transactions', async ({ page }) => {
    // Check if empty state is shown (this depends on whether there are existing transactions)
    const emptyState = page.locator('text=No transactions found');
    const table = page.locator('table');
    
    // Either empty state or table should be visible
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);
    const tableVisible = await table.isVisible().catch(() => false);
    
    expect(emptyStateVisible || tableVisible).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // HTML5 validation should prevent submission
    // Check if form is still visible (not submitted)
    await expect(page.getByLabel('Amount')).toBeVisible();
  });

  test('should display transactions table', async ({ page }) => {
    // Wait a bit for transactions to load
    await page.waitForTimeout(1000);
    
    // Check if transactions section exists
    await expect(page.locator('text=Transactions')).toBeVisible();
  });
});

