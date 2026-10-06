import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  private readonly myAccountLink: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myAccountLink = page.locator('.list-inline a').filter({ hasText: 'My Account' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.searchInput = page.locator('#search input[name="search"]');
    this.searchButton = page.locator('#search button[type="button"]');
  }

  /** Navigates to the application URL. */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /** Opens the My Account menu. */
  async clickMyAccount(): Promise<void> {
    await this.myAccountLink.click();
  }

  /** Checks whether the My Account link is visible. */
  async isMyAccountLinkVisible(): Promise<boolean> {
    try {
      return await this.myAccountLink.isVisible();
    } catch (error) {
      console.log(`Error checking My Account link: ${error}`);
      return false;
    }
  }

  /** Checks whether the main product search field is visible. */
  async isSearchInputVisible(): Promise<boolean> {
    try {
      return await this.searchInput.isVisible();
    } catch (error) {
      console.log(`Error checking product search field: ${error}`);
      return false;
    }
  }

  /** Opens the shopping cart page. */
  async openShoppingCart(): Promise<void> {
    const appUrl = process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/';
    await this.page.goto(new URL('index.php?route=checkout/cart', appUrl).toString());
  }

  /** Opens the customer registration page. */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
    await this.page.waitForURL(/route=account\/register/);
  }

  /** Opens the customer login page. */
  async clickLogin(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForURL(/route=account\/login/);
  }

  /** Searches for a product by name. */
  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForURL(/route=product\/search/);
  }
}