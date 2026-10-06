import { expect, type Page } from '@playwright/test';

export class PIMPage {
  constructor(private readonly page: Page) {}

  async openPIM() {
    const pimLink = this.page.locator('a.oxd-main-menu-item').filter({ hasText: 'PIM' });
    await expect(pimLink).toBeVisible();
    await pimLink.click();
    await this.page.waitForURL(/\/pim\/viewEmployeeList/);
  }

  async addEmployee(firstName: string, lastName: string) {
    const addEmployeeButton = this.page.getByRole('button', { name: 'Add Employee' });
    await expect(addEmployeeButton).toBeVisible();
    await addEmployeeButton.click();

    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async expectEmployeeProfileDisplayed(fullName: string) {
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails/);
    await expect(this.page.locator('body')).toContainText(fullName);
  }
}
