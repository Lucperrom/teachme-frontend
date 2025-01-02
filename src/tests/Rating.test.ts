import { Builder, By, WebDriver, until, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import 'jest';


describe('Rating Component Integration Tests', () => { //npm run dev:test
  let driver: WebDriver;
  const BASE_URL = 'http://localhost:5173';
  const TIMEOUT = 15000;
  const DELETE_TIMEOUT = 45000;

  beforeAll(async () => {
    const options = new chrome.Options();
    //options.addArguments('--headless');
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
    await driver.get(`${BASE_URL}/rating`);
    await driver.wait(until.elementLocated(By.className('rating-container')), TIMEOUT);
  });

  const waitForElement = async (locator: By): Promise<WebElement> => {
    return driver.wait(until.elementLocated(locator), TIMEOUT);
  };

  const clickElement = async (locator: By): Promise<void> => {
    const element = await waitForElement(locator);
    await driver.wait(until.elementIsVisible(element), TIMEOUT);
    await element.click();
  };

  const getRatingRows = async (): Promise<WebElement[]> => {
    return driver.findElements(By.className('rating-row'));
  };

  describe('Rating List Display', () => {
    test('should display the ratings container', async () => {
      const container = await waitForElement(By.className('rating-container'));
      expect(await container.isDisplayed()).toBe(true);
    });

    test('should show "Add Review" button', async () => {
      const addButton = await waitForElement(By.className('auth-button'));
      expect((await addButton.getText()).toLowerCase()).toBe('add review');
    });

    test('should display example ratings', async () => {
      const ratings = await driver.findElements(By.className('rating-row'));
      expect(ratings.length).toBeGreaterThan(0);
    });
  });

  describe('Rating Creation', () => {
    test('should open rating form when clicking Add Review', async () => {
      await clickElement(By.className('auth-button'));
      const form = await waitForElement(By.className('form-layout'));
      expect(await form.isDisplayed()).toBe(true);
    });

    test('should submit new rating successfully', async () => {
      await clickElement(By.className('auth-button'));

      const descriptionInput = await waitForElement(By.name('description'));
      await descriptionInput.sendKeys('Test review description');

      const ratingInput = await waitForElement(By.name('rating'));
      await ratingInput.clear();
      await ratingInput.sendKeys('5');

      const submitButton = await waitForElement(By.css('button[type="submit"]'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const ratings = await driver.findElements(By.className('rating-row'));
          return ratings.some(async (rating) =>
            (await rating.getText()).includes('Test review description')
          );
        },
        TIMEOUT
      );
    });
  });

  describe('Rating Editing', () => {
    test('should edit existing rating', async () => {
      const editButton = await waitForElement(By.css('.edit-button'));
      await editButton.click();

      const descriptionInput = await waitForElement(By.name('description'));
      await descriptionInput.clear();
      await descriptionInput.sendKeys('Updated review description');

      const ratingInput = await waitForElement(By.name('rating'));
      await ratingInput.clear();
      await ratingInput.sendKeys('4');

      const submitButton = await waitForElement(By.css('button[type="submit"]'));
      await submitButton.click();

      const updatedRating = await driver.wait(
        async () => {
          const rows = await getRatingRows();
          return rows.find(async (row) =>
            (await row.getText()).includes('Updated review description')
          );
        },
        TIMEOUT
      );

      expect(updatedRating).toBeDefined();
    });
  });

  describe('Rating Deletion', () => {
    test('should delete rating', async () => {
      const initialCount = await getRatingRows();
  
      const deleteButton = await waitForElement(By.css('.danger-button'));
      await deleteButton.click();
  
      await driver.sleep(1000);
  
      const updatedDeleteButton = await waitForElement(By.css('.danger-button'));
  
      await driver.executeScript("arguments[0].click();", updatedDeleteButton);
  
      const actions = driver.actions({ async: true });
      await actions.move({ origin: updatedDeleteButton }).click().perform();
  
      await driver.sleep(1000);
  
      const ratingsAfterClick = await getRatingRows();
      
      return ratingsAfterClick.length < initialCount.length;
    }, DELETE_TIMEOUT);
  });
  
});
