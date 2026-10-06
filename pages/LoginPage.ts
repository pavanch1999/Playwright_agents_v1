import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginHeading: Locator;
  private readonly warningMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginHeading = page.getByRole('heading', { name: 'Returning Customer' });
    this.warningMessage = page.locator('.alert-danger');
  }

  /** Checks whether the customer login page is displayed. */
  async isLoginPageExists(): Promise<boolean> {
    try {
      return await this.loginHeading.isVisible();
    } catch (error) {
      console.log(`Error checking customer login page: ${error}`);
      return false;
    }
  }

  /** Logs in with the supplied customer credentials. */
  async login(email: string, password: string): Promise<void> {
    await this.submitLogin(email, password);
    await this.page.waitForURL(/route=account\/account/);
  }

  /** Submits the login form without assuming authentication will succeed. */
  async submitLogin(email: string, password: string): Promise<void> {
    if (email.trim()) {
      await this.emailInput.fill(email);
    }
    if (password.trim()) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }

  /** Checks whether an OpenCart login warning is displayed. */
  async isWarningMessageVisible(): Promise<boolean> {
    try {
      await this.warningMessage.waitFor({ state: 'visible' });
      return true;
    } catch (error) {
      console.log(`Error checking login warning: ${error}`);
      return false;
    }
  }

  /** Reads the OpenCart login warning text. */
  async getWarningMessage(): Promise<string> {
    return (await this.warningMessage.textContent())?.trim() ?? '';
  }

  /** Reads the current email field value. */
  async getEmailValue(): Promise<string> {
    return (await this.emailInput.inputValue()).trim();
  }

  /** Reads the current password field value. */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }
}