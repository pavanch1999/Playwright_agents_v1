import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly telephoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly passwordConfirmInput: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly registerHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#input-firstname');
    this.lastNameInput = page.locator('#input-lastname');
    this.emailInput = page.locator('#input-email');
    this.telephoneInput = page.locator('#input-telephone');
    this.passwordInput = page.locator('#input-password');
    this.passwordConfirmInput = page.locator('#input-confirm');
    this.privacyPolicyCheckbox = page.locator('input[type="checkbox"][name="agree"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.registerHeading = page.getByRole('heading', { name: 'Register Account' });
  }

  /** Checks whether the registration page is displayed. */
  async isRegisterPageExists(): Promise<boolean> {
    try {
      return await this.registerHeading.isVisible();
    } catch (error) {
      console.log(`Error checking register page: ${error}`);
      return false;
    }
  }

  /** Completes and submits the customer registration form. */
  async completeRegistration(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.telephoneInput.fill(telephone);
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(password);
    await this.privacyPolicyCheckbox.check();
    await this.continueButton.click();
    await this.page.waitForURL(/route=account\/success/);
  }
}