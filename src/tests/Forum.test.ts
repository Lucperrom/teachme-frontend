import { Builder, By, WebDriver, until, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import 'jest';


describe('Forum Component Integration Tests', () => { //npm run dev:test
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
    const courseId = "course1"
    await driver.get(`${BASE_URL}/forums/${courseId}`);
    await driver.wait(until.elementLocated(By.className('forum-container')), TIMEOUT);
  });

  const waitForElement = async (locator: By): Promise<WebElement> => {
    return driver.wait(until.elementLocated(locator), TIMEOUT);
  };

  const clickElement = async (locator: By): Promise<void> => {
    const element = await waitForElement(locator);
    await driver.wait(until.elementIsVisible(element), TIMEOUT);
    await element.click();
  };

  const getForumTitle = async (): Promise<WebElement[]> => {
    return driver.findElements(By.className('forum-title-input'));
  };

  const getForumMessagesRows = async (): Promise<WebElement[]> => {
    return driver.findElements(By.className('forum-message-row'));
  }

  describe('Forum Display', () => {
    test('should display the forum container', async () => {
      const container = await waitForElement(By.className('forum-container'));
      expect(await container.isDisplayed()).toBe(true);
    });

    test('should show "Añadir Mensaje" button', async () => {
      const addButton = await waitForElement(By.className('forum-message-add-button'));
      expect((await addButton.getText()).toLowerCase()).toBe('añadir mensaje');
    });

    test('should display example forum', async () => {
      const forum = await waitForElement(By.className('forum-title-input'));
      expect((await forum.getText()).toLowerCase()).toBe('título del foro');
    });
  });

  describe('Forum Editing Title', () => {
    test('should edit existing forum', async () => {
      const editButton = await waitForElement(By.className('forum-title-edit'));
      await editButton.click();

      const titleInput = await waitForElement(By.className('forum-title-input'));
      await titleInput.clear();
      await titleInput.sendKeys('Titulo de foro editado');


      const submitButton = await waitForElement(By.className('save-forum-title'));
      await submitButton.click();

      const updatedTitle = await driver.wait(
        async () => {
          const rows = await getForumTitle();
          return rows.find(async (row: { getText: () => any; }) =>
            (await row.getText()).includes('Titulo de foro editado')
          );
        },
        TIMEOUT
      );

      expect(updatedTitle).toBeDefined();
    });
  });
/* SON TEST QUE DEPENDEN DE BASE DE DATOS Y POR ELLO NO ME FUNCIONAN DESDE FRONTEND
  describe('Forum message Creation', () => {
    test('Add a Forum message ', async () => {
      await clickElement(By.className('forum-message-add-button'));
      const form = await waitForElement(By.className('forum-message-content-new-input'));
      expect(await form.isDisplayed()).toBe(true);
    });

    test('should submit new forum message successfully', async () => {
      const contentInput = await waitForElement(By.className('forum-message-content-new-input'));
      await contentInput.clear();
      await contentInput.sendKeys('Test Nuevo Mensaje');

      const submitButton = await waitForElement(By.className('forum-message-add-button'));
      await submitButton.click();

      await driver.wait(
        async () => {
          const messages = await driver.findElements(By.className('forum-message-row'));
          return messages.some(async (m: { getText: () => any; }) =>
            (await m.getText()).includes('Test Nuevo Mensaje')
          );
        },
        TIMEOUT
      );
    });
  });

  

  describe('Forum message Deletion', () => {
    test('should delete forum message', async () => {
      const initialCount = await getForumMessagesRows();
  
      const deleteButton = await waitForElement(By.className('delete-forum-message'));
      await deleteButton.click();
  
      await driver.sleep(1000);
  
      const messagesAfterClick = await getForumMessagesRows();
      
      return messagesAfterClick.length < initialCount.length;
    }, DELETE_TIMEOUT);
  });
  */
});
