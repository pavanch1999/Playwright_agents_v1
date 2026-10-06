import { type Locator, type Page } from '@playwright/test';

export class SuccessPage {
  private readonly page: Page;
  private readonly successHeading: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  /** Checks whether account registration succeeded. */
  async isSuccessPageExists(): Promise<boolean> {
    try {
      return await this.successHeading.isVisible();
    } catch (error) {
      console.log(`Error checking registration success page: ${error}`);
      return false;
    }
  }

  /** Continues to the newly created customer account. */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL(/route=account\/account/);
  }
}