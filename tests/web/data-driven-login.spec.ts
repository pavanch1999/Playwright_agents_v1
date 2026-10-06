import path from 'node:path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginTestData = {
  testName?: string;
  TestName?: string;
  email: string;
  password: string;
  expected: 'success' | 'failure';
};

const testDataPath = path.resolve(__dirname, '../../testdata/opencart_logindata.json');
const loginTestData = DataProvider.readJson(testDataPath) as LoginTestData[];

loginTestData.forEach((loginData, index) => {
  const scenarioName = loginData.testName ?? loginData.TestName ?? `Login data row ${index + 1}`;

  test(`${scenarioName} [${index + 1}] @master @regression @datadriven @web`, async ({
    homePage,
    loginPage,
    myAccountPage,
  }) => {
    const email = loginData.email ?? '';
    const password = loginData.password ?? '';
    const expected = loginData.expected.toLowerCase();

    await test.step('1) Open the login page', async () => {
      await homePage.clickMyAccount();
      await homePage.clickLogin();
      expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Submit the credentials from this data row', async () => {
      await loginPage.submitLogin(email, password);
    });

    if (expected === 'success') {
      await test.step('3) Verify successful authentication', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await myAccountPage.isAuthenticated()).toBeTruthy();
      });
    } else {
      await test.step('3) Verify failed authentication and the application warning', async () => {
        expect(await loginPage.isWarningMessageVisible()).toBeTruthy();
        expect(await loginPage.getWarningMessage()).toContain(
          'Warning: No match for E-Mail Address and/or Password.',
        );
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        expect(await myAccountPage.isAuthenticated()).toBeFalsy();
        expect(await loginPage.getEmailValue()).toBe(email.trim());
        expect(await loginPage.getPasswordValue()).toBe(password.trim());
      });
    }

    console.log(`✅ ${scenarioName} data-driven login completed!`);
  });
});