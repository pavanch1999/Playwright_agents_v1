import { test, expect } from '../../fixtures/pageFixtures';

test('Valid Customer Login Flow @master @sanity @regression @web', async ({
  homePage,
  loginPage,
  myAccountPage,
}) => {
  const email = process.env.APP_EMAIL ?? '';
  const password = process.env.APP_PASSWORD ?? '';

  await test.step('1) Open My Account and navigate to Login', async () => {
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
  });

  await test.step('2) Log in with configured customer credentials', async () => {
    await loginPage.login(email, password);
  });

  await test.step('3) Verify authenticated My Account area', async () => {
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    expect(await myAccountPage.isAuthenticated()).toBeTruthy();
  });

  console.log('✅ Valid Customer Login completed successfully!');
});