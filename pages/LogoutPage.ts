import { type Locator, type Page } from '@playwright/test';

export class LogoutPage {
  private readonly logoutHeading: Locator;
  private readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.logoutHeading = page.getByRole('heading', { name: 'Account Logout' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /** Checks whether the account logout page is displayed. */
  async isLogoutPageExists(): Promise<boolean> {
    try {
      return await this.logoutHeading.isVisible();
    } catch (error) {
      console.log(`Error checking account logout page: ${error}`);
      return false;
    }
  }

  /** Returns to the store after logout. */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}