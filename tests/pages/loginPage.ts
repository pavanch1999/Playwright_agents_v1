import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com');
    await this.page.waitForURL('**/auth/login');
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL(/\/dashboard/);
  }

  async expectLoginPageVisible() {
    await expect(this.page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  }
}
