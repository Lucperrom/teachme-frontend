import { Builder, By, WebDriver, until, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import 'jest';

describe('Auth Component Integration Tests', () => { //npm run dev:test
  let driver: WebDriver;
  const BASE_URL = 'http://localhost:5173';
  const TIMEOUT = 15000;
//   const DELETE_TIMEOUT = 45000;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 5000 });
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get(`${BASE_URL}/signup`);
    await driver.wait(until.elementLocated(By.className('auth-SignUp-container')), TIMEOUT);
  });

  const waitForElement = async (locator: By): Promise<WebElement> => {
    return driver.wait(until.elementLocated(locator), TIMEOUT);
  };

  describe('Error because the fields its blank', () => {
    test('Blank all field', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('All fields are required.')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('Error because the email field its blank', () => {
    test('Email blank', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('123456');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('123456');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('All fields are required.')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('Error because the password field its blank', () => {
    test('Blank password', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('example@example.com')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('123456');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('All fields are required.')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('Error because the password confirm field its blank', () => {
    test('Blank confirm password', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('example@example.com')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('123456');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('All fields are required.')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('Error for bad email', () => {
    test('Bad format of email', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('example@.com')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('123456');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('123456');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('Please enter a valid email address.')
          );
        },
        TIMEOUT
      );
    });
  });
  
  describe('Error because the passwords are not the same', () => {
    test('Passwords do not match', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('example@example.com')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('1234567');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('1234555');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('Passwords do not match.')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('The password must be at least 6 characters', () => {
    test('At least 6 characters', async () => {
      const editEmail = await waitForElement(By.className('Email-auth-login'));
      await editEmail.clear();
      await editEmail.sendKeys('example@example.com')

      const editPassword = await waitForElement(By.className('Password-auth-login'));
      await editPassword.clear();
      await editPassword.sendKeys('123');

      const editConfirmPassword = await waitForElement(By.className('Confirm-password-auth-login'));
      await editConfirmPassword.clear();
      await editConfirmPassword.sendKeys('123');

      const submitButton = await waitForElement(By.className('Send-SignUp'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('auth-error-container'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('Password must be at least 6 characters.')
          );
        },
        TIMEOUT
      );
    });
  });
});