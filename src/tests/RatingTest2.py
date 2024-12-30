from pymongo import MongoClient
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import subprocess
import time

class RatingTest(unittest.TestCase):  # python -m unittest RatingTest.py -v

    @classmethod
    def setUpClass(cls):
        """Set up Docker environment and MongoDB connection before running tests"""
        print("Starting Docker containers...")
        cls.docker_process = subprocess.Popen(
            ['docker-compose', 'up', '--build', '-d'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("Waiting for services to be ready...")
        time.sleep(90)  # Adjust this wait time as needed

        # Set up MongoDB connection
        mongo_uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority"
        cls.mongo_client = MongoClient(mongo_uri)
        cls.db = cls.mongo_client['<database>']  # Replace <database> with your database name
        cls.collection = cls.db['ratings']  # Replace 'ratings' with your collection name

    @classmethod
    def tearDownClass(cls):
        """Clean up Docker environment and MongoDB connection after all tests"""
        print("Stopping Docker containers...")
        subprocess.run(['docker-compose', 'down'], check=True)

        # Close MongoDB connection
        cls.mongo_client.close()

    def setUp(self):
        """Set up Selenium WebDriver"""
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.base_url = "http://localhost:5173/rating"  # Adjust if different
        self.driver.get(self.base_url)
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        """Clean up after each test"""
        self.collection.delete_many({"description": {"$regex": "^Test.*"}})
        self.driver.quit()

    def verify_rating_in_db(self, description, rating):
        """Check if a rating exists in the database"""
        query = {"description": description, "rating": rating}
        return self.collection.find_one(query) is not None

    def test_01_add_new_rating(self):
        try:
            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-container"))
            )

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
            description_input.send_keys("Test review for adding")

            submit_button = self.driver.find_element(
                By.CSS_SELECTOR, "button[type='submit']"
            )
            submit_button.click()

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-row"))
            )

            self.assertTrue(
                self.verify_rating_in_db("Test review for adding", 4),
                "The rating was not added to the database!"
            )

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")

    def test_02_edit_rating(self):
        try:
            test_rating = {"description": "Test review for editing", "rating": 4}
            self.collection.insert_one(test_rating)

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-container"))
            )

            edit_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.edit-button"))
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

            self.assertTrue(
                self.verify_rating_in_db("Updated test review", 5),
                "The rating was not updated in the database!"
            )

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")

    def test_03_delete_rating(self):
        try:
            test_rating = {"description": "Test review for deletion", "rating": 3}
            self.collection.insert_one(test_rating)

            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "rating-container"))
            )

            initial_ratings = len(
                self.driver.find_elements(By.CLASS_NAME, "rating-row")
            )

            delete_button = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button.danger-button"))
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
            self.assertEqual(
                final_ratings, initial_ratings - 1,
                "The rating was not deleted in the frontend!"
            )

            self.assertFalse(
                self.verify_rating_in_db("Test review for deletion", 3),
                "The rating was not deleted from the database!"
            )

        except TimeoutException as e:
            self.fail(f"Test failed: Element not found - {str(e)}")
