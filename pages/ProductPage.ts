import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  private readonly page: Page;
  private readonly productHeading: Locator;
  private readonly addToCartButton: Locator;
  private readonly quantityInput: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productHeading = page.locator('#content h1');
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.quantityInput = page.locator('#input-quantity');
    this.successMessage = page.locator('.alert-success');
  }

  /** Checks whether the product details page is displayed. */
  async isProductPageExists(): Promise<boolean> {
    try {
      return await this.productHeading.isVisible();
    } catch (error) {
      console.log(`Error checking product details page: ${error}`);
      return false;
    }
  }

  /** Reads the product name from the details heading. */
  async getProductName(): Promise<string> {
    return (await this.productHeading.textContent())?.trim() ?? '';
  }

  /** Sets the quantity to add to the cart. */
  async setQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  /** Adds the displayed product to the cart. */
  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /** Checks whether the add-to-cart success message is displayed. */
  async isSuccessMessageVisible(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible' });
      return true;
    } catch (error) {
      console.log(`Error checking add-to-cart confirmation: ${error}`);
      return false;
    }
  }
}