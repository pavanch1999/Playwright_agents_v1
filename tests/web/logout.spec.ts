import { test, expect } from '../../fixtures/pageFixtures';

test('Customer Logout Flow @master @sanity @regression @web', async ({
  homePage,
  loginPage,
  myAccountPage,
  logoutPage,
}) => {
  const email = process.env.APP_EMAIL ?? '';
  const password = process.env.APP_PASSWORD ?? '';

  await test.step('1) Log in with configured customer credentials', async () => {
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(email, password);
    expect(await myAccountPage.isAuthenticated()).toBeTruthy();
  });

  await test.step('2) Log out and verify the confirmation page', async () => {
    await myAccountPage.clickLogout();
    expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
  });

  await test.step('3) Continue to the home page and verify logout', async () => {
    await logoutPage.clickContinue();
    expect(await homePage.isSearchInputVisible()).toBeTruthy();
    expect(await myAccountPage.isAuthenticated()).toBeFalsy();
  });

  console.log('✅ Customer Logout completed successfully!');
});