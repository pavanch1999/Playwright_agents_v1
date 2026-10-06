import { type Locator, type Page } from '@playwright/test';

export class MyAccountPage {
  private readonly page: Page;
  private readonly myAccountHeading: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myAccountHeading = page.locator('#content h2', { hasText: 'My Account' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  /** Checks whether the customer account page is displayed. */
  async isMyAccountPageExists(): Promise<boolean> {
    try {
      return await this.myAccountHeading.isVisible();
    } catch (error) {
      console.log(`Error checking customer account page: ${error}`);
      return false;
    }
  }

  /** Checks whether authenticated account navigation is available. */
  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.logoutLink.isVisible();
    } catch (error) {
      console.log(`Error checking customer authentication: ${error}`);
      return false;
    }
  }

  /** Logs out the current customer. */
  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL(/route=account\/logout/);
  }
}