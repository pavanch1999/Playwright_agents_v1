import { test, expect } from '@playwright/test';

test('login and verify dashboard is displayed', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('logout and verify login page is displayed', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // // Wait for 2 seconds to ensure the dashboard is fully loaded

  // await expect(page).toHaveURL(/\/dashboard/);
  //await page.waitForTimeout(5000);
  await expect(page.locator('.oxd-userdropdown-tab')).toBeVisible();
  await page.locator('.oxd-userdropdown-tab').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
});
