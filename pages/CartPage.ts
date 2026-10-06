import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly cartHeading: Locator;
  private readonly cartItems: Locator;
  private readonly cartTotals: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.cartItems = page.locator('#content table.table-bordered').first().locator('tbody tr');
    this.cartTotals = page.locator('#content table.table-bordered').nth(1);
  }

  /** Checks whether the shopping cart page is displayed. */
  async isCartPageExists(): Promise<boolean> {
    try {
      return await this.cartHeading.isVisible();
    } catch (error) {
      console.log(`Error checking shopping cart page: ${error}`);
      return false;
    }
  }

  /** Checks whether the requested product is present in the cart. */
  async isProductInCart(productName: string): Promise<boolean> {
    try {
      return (await this.cartItems.filter({ hasText: productName }).count()) > 0;
    } catch (error) {
      console.log(`Error checking product in shopping cart: ${error}`);
      return false;
    }
  }

  /** Reads the cart quantity for a product. */
  async getProductQuantity(productName: string): Promise<string> {
    const row = this.cartItems.filter({ hasText: productName });
    return (await row.locator('td').nth(3).locator('input').getAttribute('value')) ?? '';
  }

  /** Reads the unit price for a product. */
  async getProductUnitPrice(productName: string): Promise<string> {
    const row = this.cartItems.filter({ hasText: productName });
    return (await row.locator('td').nth(4).innerText()).trim();
  }

  /** Reads the line total for a product. */
  async getProductTotalPrice(productName: string): Promise<string> {
    const row = this.cartItems.filter({ hasText: productName });
    return (await row.locator('td').nth(5).innerText()).trim();
  }

  /** Reads the grand total shown in the cart summary. */
  async getCartTotal(): Promise<string> {
    const totalRow = this.cartTotals.getByRole('row').filter({ hasText: 'Total:' });
    return (await totalRow.getByRole('cell').last().innerText()).trim();
  }
}