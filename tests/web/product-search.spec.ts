import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product Search Flow @master @sanity @regression @web', async ({
  homePage,
  searchResultsPage,
}) => {
  const { productName } = Helper.getProductDetails();

  await test.step('1) Search for the known product', async () => {
    await homePage.searchProduct(productName);
  });

  await test.step('2) Verify the search results and matching product name', async () => {
    expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
    expect(await searchResultsPage.getSearchHeadingText()).toContain(productName);
  });

  console.log('✅ Product Search completed successfully!');
});