import { type Locator, type Page } from '@playwright/test';

export class SearchResultsPage {
  private readonly page: Page;
  private readonly searchHeading: Locator;
  private readonly productLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchHeading = page.locator('#content h1');
    this.productLinks = page.locator('.product-thumb h4 a');
  }

  /** Checks whether the product search results are displayed. */
  async isSearchResultsPageExists(): Promise<boolean> {
    try {
      return await this.searchHeading.isVisible();
    } catch (error) {
      console.log(`Error checking product search results: ${error}`);
      return false;
    }
  }

  /** Checks whether a product appears in the search results. */
  async isProductDisplayed(productName: string): Promise<boolean> {
    try {
      return (await this.productLinks.filter({ hasText: productName }).count()) > 0;
    } catch (error) {
      console.log(`Error checking product search result: ${error}`);
      return false;
    }
  }

  /** Reads the product search results heading. */
  async getSearchHeadingText(): Promise<string> {
    return (await this.searchHeading.textContent())?.trim() ?? '';
  }

  /** Opens the matching product details page. */
  async clickProduct(productName: string): Promise<void> {
    await this.productLinks.filter({ hasText: productName }).first().click();
    await this.page.waitForURL(/route=product\/product/);
  }
}