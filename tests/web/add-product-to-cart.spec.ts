import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add Product to Cart Flow @master @sanity @regression @web', async ({
  homePage,
  searchResultsPage,
  productPage,
  cartPage,
}) => {
  const { productName, productQuantity } = Helper.getProductDetails();

  await test.step('1) Search for and open the known product', async () => {
    await homePage.searchProduct(productName);
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
    await searchResultsPage.clickProduct(productName);
    expect(await productPage.isProductPageExists()).toBeTruthy();
    expect(await productPage.getProductName()).toBe(productName);
  });

  await test.step('2) Add the requested quantity to the cart', async () => {
    await productPage.setQuantity(productQuantity);
    await productPage.clickAddToCart();
    expect(await productPage.isSuccessMessageVisible()).toBeTruthy();
  });

  await test.step('3) Verify the cart product and quantity', async () => {
    await homePage.openShoppingCart();
    expect(await cartPage.isCartPageExists()).toBeTruthy();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
  });

  console.log('✅ Add Product to Cart completed successfully!');
});