import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User Registration Flow @master @sanity @regression @web', async ({
  homePage,
  registerPage,
  successPage,
  myAccountPage,
}) => {
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = `${Date.now()}${RandomDataUtil.getEmail()}`;
  const telephone = RandomDataUtil.getPhoneNumber();
  const password = RandomDataUtil.getPassword();

  await test.step('1) Open the application', async () => {
    expect(await homePage.isMyAccountLinkVisible()).toBeTruthy();
  });

  await test.step('2) Navigate to My Account and Register', async () => {
    await homePage.clickMyAccount();
    await homePage.clickRegister();
    expect(await registerPage.isRegisterPageExists()).toBeTruthy();
  });

  await test.step('3) Register a new customer with unique generated data', async () => {
    await registerPage.completeRegistration(firstName, lastName, email, telephone, password);
  });

  await test.step('4) Verify registration and authenticated account navigation', async () => {
    expect(await successPage.isSuccessPageExists()).toBeTruthy();
    await successPage.clickContinue();
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    expect(await myAccountPage.isAuthenticated()).toBeTruthy();
  });

  console.log('✅ User Registration completed successfully!');
});