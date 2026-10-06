import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid Customer Login Flow @master @regression @web', async ({
  homePage,
  loginPage,
  myAccountPage,
}) => {
  const email = RandomDataUtil.getEmail();
  const password = RandomDataUtil.getPassword();

  await test.step('1) Open My Account and navigate to Login', async () => {
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
  });

  await test.step('2) Submit invalid customer credentials', async () => {
    await loginPage.submitLogin(email, password);
  });

  await test.step('3) Verify login is rejected with the expected warning', async () => {
    expect(await loginPage.isWarningMessageVisible()).toBeTruthy();
    expect(await loginPage.getWarningMessage()).toContain(
      'Warning: No match for E-Mail Address and/or Password.',
    );
    expect(await loginPage.isLoginPageExists()).toBeTruthy();
    expect(await myAccountPage.isAuthenticated()).toBeFalsy();
  });

  console.log('✅ Invalid Customer Login completed successfully!');
});