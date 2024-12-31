import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import subprocess
import time
import os

class RatingTest(unittest.TestCase): #python -m unittest RatingTest.py -v

    @classmethod
    def setUpClass(cls):
        """Set up Docker environment before running any tests"""
        print("Starting Docker containers...")
        cls.docker_process = subprocess.Popen(
            ['docker-compose', 'up', '--build', '-d'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("Waiting for services to be ready...")
        time.sleep(90)  # Dar tiempo a que el frontend se inicie completamente

    @classmethod
    def tearDownClass(cls):
        """Clean up Docker environment after all tests"""
        print("Stopping Docker containers...")
        subprocess.run(['docker-compose', 'down'], check=True)
        
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.base_url = "http://localhost:5173/rating"
        self.driver.get(self.base_url)
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def wait_for_frontend(self, max_attempts=10):
        """Wait for frontend to be available"""
        attempt = 0
        while attempt < max_attempts:
            try:
                self.driver.get(self.base_url)
                # Intentar encontrar algún elemento que confirme que la página está cargada
                self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "rating-container")))
                return True
            except:
                print(f"Attempt {attempt + 1}: Frontend not ready yet...")
                time.sleep(5)
                attempt += 1
        raise Exception("Frontend did not become available in time")

    def test_01_add_new_rating(self):
        """Test adding a new rating"""
        try:
            self.wait_for_frontend()
            
            add_review_button = self.wait.until(
                EC.element_to_be_clickable((By.CLASS_NAME, "auth-button"))
            )
            add_review_button.click()

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "custom-popover-content"))
            )

            rating_input = self.driver.find_element(By.NAME, "rating")
            rating_input.clear()
            rating_input.send_keys("4")

            description_input = self.driver.find_element(By.NAME, "description")
            description_input.clear()
            description_input.send_keys("This is a test review")

            submit_button = self.driver.find_element(
                By.CSS_SELECTOR, "button[type='submit']"
            )
            submit_button.click()

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-row"))
            )
            
            rating_description = self.driver.find_element(
                By.CLASS_NAME, "rating-description"
            )
            self.assertIn("This is a test review", rating_description.text)

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")

    def test_02_edit_rating(self):
        """Test editing an existing rating"""
        try:
            self.wait_for_frontend()
            
            edit_button = self.wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "button.edit-button")
                )
            )
            edit_button.click()
            
            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "custom-popover-content"))
            )

            rating_input = self.driver.find_element(By.NAME, "rating")
            rating_input.clear()
            rating_input.send_keys("5")

            description_input = self.driver.find_element(By.NAME, "description")
            description_input.clear()
            description_input.send_keys("Updated test review")

            submit_button = self.driver.find_element(
                By.CSS_SELECTOR, "button[type='submit']"
            )
            submit_button.click()

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-row"))
            )
            updated_description = self.driver.find_element(
                By.CLASS_NAME, "rating-description"
            )
            self.assertIn("Updated test review", updated_description.text)

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")

    def test_03_delete_rating(self):
        """Test deleting a rating"""
        try:
            self.wait_for_frontend()
            
            initial_ratings = len(
                self.driver.find_elements(By.CLASS_NAME, "rating-row")
            )

            delete_button = self.wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "button.danger-button")
                )
            )
            delete_button.click()

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "modal-content"))
            )
            confirm_button = self.driver.find_element(
                By.CSS_SELECTOR, "button[color='primary']"
            )
            confirm_button.click()

            time.sleep(1)  
            final_ratings = len(
                self.driver.find_elements(By.CLASS_NAME, "rating-row")
            )
            self.assertEqual(final_ratings, initial_ratings - 1)

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")

if __name__ == "__main__":
    unittest.main()