import { test } from '@playwright/test';
import { LoginPage } from './loginPage';
import { PIMPage } from './pimPage';

test('create employee via PIM and verify profile details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');

  await pimPage.openPIM();
  await pimPage.addEmployee('John123', 'Doe456');
  await pimPage.expectEmployeeProfileDisplayed('John123 Doe456');
});
