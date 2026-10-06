import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @regression @end-to-end @web', async ({
  homePage,
  registerPage,
  successPage,
  myAccountPage,
  logoutPage,
  loginPage,
  searchResultsPage,
  productPage,
  cartPage,
}) => {
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = RandomDataUtil.getEmail();
  const telephone = RandomDataUtil.getPhoneNumber();
  const password = RandomDataUtil.getPassword();
  const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

  await test.step('1) Open the application', async () => {
    expect(await homePage.isMyAccountLinkVisible()).toBeTruthy();
  });

  await test.step('2) Register a new customer using generated data', async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    await registerPage.completeRegistration(firstName, lastName, email, telephone, password);
  });

  await test.step('3) Verify successful registration', async () => {
    expect(await successPage.isSuccessPageExists()).toBeTruthy();
    await successPage.clickContinue();
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
  });

  await test.step('4) Log out', async () => {
    await myAccountPage.clickLogout();
    expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
    await logoutPage.clickContinue();
  });

  await test.step('5) Log in again with the new customer credentials', async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
    await loginPage.login(email, password);
  });

  await test.step('6) Verify successful authentication', async () => {
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
  });

  await test.step('7) Search for the known product', async () => {
    await homePage.navigateTo(process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/');
    await homePage.searchProduct(productName);
    expect(await searchResultsPage.isProductDisplayed(productName)).toBeTruthy();
  });

  await test.step('8) Open the product details page', async () => {
    await searchResultsPage.clickProduct(productName);
    expect(await productPage.isProductPageExists()).toBeTruthy();
    expect(await productPage.getProductName()).toBe(productName);
  });

  await test.step('9) Add the product to the cart', async () => {
    await productPage.setQuantity(productQuantity);
    await productPage.clickAddToCart();
    expect(await productPage.isSuccessMessageVisible()).toBeTruthy();
  });

  await test.step('10) Open the shopping cart', async () => {
    await homePage.openShoppingCart();
    expect(await cartPage.isCartPageExists()).toBeTruthy();
  });

  await test.step('11) Verify the product, quantity, price, and cart total', async () => {
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
    expect(await cartPage.getProductUnitPrice(productName)).toBe(totalPrice);
    expect(await cartPage.getProductTotalPrice(productName)).toBe(totalPrice);
    expect(await cartPage.getCartTotal()).toBe(totalPrice);
  });

  console.log('✅ End-to-End Shopping completed successfully!');
});