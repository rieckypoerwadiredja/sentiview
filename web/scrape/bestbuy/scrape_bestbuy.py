from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import logging
from flask import Flask, request, jsonify
import random

def scrape_bestbuy_product(url):
    try:
        # Ensure '&intl=nosplash' is appended
        if '&intl=nosplash' not in url:
            if '?' in url:
                url += '&intl=nosplash'
            else:
                url += '?intl=nosplash'

        # Configure Selenium WebDriver
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Run in headless mode
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get(url)

        # Wait for the product title to be visible
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.h4'))
        )

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        driver.quit()

        # Extract the product title
        title_element = soup.select_one('h1.h4')
        title = title_element.text.strip() if title_element else 'Title not found'
        
        # Extract the product price
        price_element = soup.find("div", {"data-testid": "large-customer-price"})
        price = price_element.text.strip() if price_element else "Not Found"

        # Extract the product semua gambar
        image_elements = soup.find_all("img", class_="p-100")
        image_urls = []

        for img in image_elements:
            src = img.get("src")
            if src and src.startswith("https://"):
                image_urls.append(src)
        id = [random.randint(10_000_000, 99_999_999) for _ in range(1)]

        return {
            "id": id,
            'response': {
               'product_data' :{
                'title': title,
                'price': price,
                'description': 'Not fetched yet',
                'images': image_urls
            },
            'reviews': 'Not fetched yet'
            }
        }

    except Exception as e:
        print(e)
        return {
            'error': 'Scraping failed',
            'details': str(e)
        }




# Example usage
# url = "https://www.bestbuy.com/site/asus-chromebook-cm1402-14-fhd-laptop-mediatek-kompanio-520-4gb-memory-64gb-emmc-gravity-gray/6570143.p?skuId=6570143"
# url += "&intl=nosplash" # Skip Region Select
# data = scrape_bestbuy_product(url)
# print(data)
