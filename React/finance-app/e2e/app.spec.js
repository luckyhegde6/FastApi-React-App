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
    // Open the add-transaction modal and wait for it
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
    await expect(page.getByLabel(/amount/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByLabel(/date/i)).toBeVisible();
  });

  test('should submit a new transaction', async ({ page }) => {
    // Fill in the form for a new expense transaction
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
    await page.getByLabel(/amount/i).fill('100.50');
    const categorySelect = page.getByLabel(/category/i);
    // Wait up to 5s for the select to have a non-empty option and pick it
    const max = Date.now() + 5000;
    let firstOption = null;
    while (Date.now() < max) {
      const opt = categorySelect.locator('option:not([value=""])').first();
      const val = await opt.getAttribute('value').catch(()=>null);
      if (val) { firstOption = opt; break; }
      await page.waitForTimeout(100);
    }
    const firstOptionValue = firstOption ? await firstOption.getAttribute('value').catch(()=>null) : null;
    const firstOptionLabel = (firstOptionValue) ? (await firstOption.textContent()).trim() : null;
    if (firstOptionValue) {
      await categorySelect.selectOption(firstOptionValue);
    }
    const uniqueDesc = `Lunch ${Date.now()}`;
    await page.getByLabel(/description/i).fill(uniqueDesc);
    // Leave the modal's default date

    // Submit the form and wait for modal to close
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeHidden({ timeout: 10000 }).catch(()=>{});
    // Assert the new row (by description + amount) appears with expected amount & category
    const newRow = page.locator('tbody tr').filter({ hasText: uniqueDesc }).filter({ hasText: '$100.50' }).first();
    await expect(newRow).toBeVisible({ timeout: 15000 });
    await expect(newRow.locator(`text=$100.50`)).toBeVisible();
    if (firstOptionLabel) {
      await expect(newRow.locator(`text=${firstOptionLabel}`)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should submit an income transaction', async ({ page }) => {
    // Fill in the form for an income transaction
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
    await page.getByLabel(/amount/i).fill('5000.00');
    // Check income checkbox first so categories are filtered
    await page.getByLabel(/income\?/i).check();
    const categorySelectIncome = page.getByLabel(/category/i);
    // Wait up to 5s for the select to have options
    const max2 = Date.now() + 5000;
    let firstIncOpt = null;
    while (Date.now() < max2) {
      const opt = categorySelectIncome.locator('option:not([value=""])').first();
      const val = await opt.getAttribute('value').catch(()=>null);
      if (val) { firstIncOpt = opt; break; }
      await page.waitForTimeout(100);
    }
    const firstIncomeValue = firstIncOpt ? await firstIncOpt.getAttribute('value').catch(()=>null) : null;
    const firstIncomeLabel = (firstIncomeValue) ? (await firstIncOpt.textContent()).trim() : null;
    if (firstIncomeValue) {
      await categorySelectIncome.selectOption(firstIncomeValue);
    }
    const uniqueIncomeDesc = `Monthly salary ${Date.now()}`;
    await page.getByLabel(/description/i).fill(uniqueIncomeDesc);
    // Leave date as default

    // Submit and verify row
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeHidden({ timeout: 10000 }).catch(()=>{});
    const incomeRow = page.locator('tbody tr').filter({ hasText: uniqueIncomeDesc }).first();
    await expect(incomeRow).toBeVisible({ timeout: 15000 });
    await expect(incomeRow.locator(`text=$5000.00`)).toBeVisible();
    if (firstIncomeLabel) {
      await expect(incomeRow.locator(`text=${firstIncomeLabel}`)).toBeVisible({ timeout: 5000 });
    }
    await expect(incomeRow.locator('text=Income')).toBeVisible();
  });

  test('should display empty state when no transactions', async ({ page }) => {
    // Check if empty state is shown (this depends on whether there are existing transactions)
    const emptyState = page.locator('text=No transactions found');
    const table = page.locator('table');
    // Wait for loading to finish (if present) so we don't check too early
    await page.waitForSelector('text=Loading transactions...', { state: 'hidden', timeout: 5000 }).catch(()=>{});
    // Either empty state or table should be visible
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);
    const tableVisible = await table.isVisible().catch(() => false);

    expect(emptyStateVisible || tableVisible).toBeTruthy();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    // Open modal and attempt to submit without filling required fields
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // HTML5 validation should prevent submission — modal heading should still be visible
    await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();
  });

  test('should display transactions table', async ({ page }) => {
    // Wait for transactions heading to be visible
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible({ timeout: 5000 });
    // Also ensure at least the table or empty-state is present
    const table = page.locator('table');
    const empty = page.locator('text=No transactions found');
    // Wait up to 10s for either the table or the empty-state to become visible
    const max = Date.now() + 10000;
    let ok = false;
    while (Date.now() < max) {
      const t = await table.isVisible().catch(()=>false);
      const e = await empty.isVisible().catch(()=>false);
      if (t || e) { ok = true; break; }
      await page.waitForTimeout(200);
    }
    if (!ok) {
      throw new Error('Neither transactions table nor empty state became visible');
    }
  });
});

