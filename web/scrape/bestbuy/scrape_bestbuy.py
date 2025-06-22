from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException
from bs4 import BeautifulSoup
import time
import logging
from flask import Flask, request, jsonify
import random
import re

def scrape_bestbuy_product_info(url):
    import time
    try:
        start = time.time()
        print("🚀 Start scrape:", url)
        # Ensure '&intl=nosplash' is appended
        if '&intl=nosplash' not in url:
            if '?' in url:
                url += '&intl=nosplash'
            else:
                url += '?intl=nosplash'

        # Configure Selenium WebDriver
        chrome_options = Options()
        chrome_options.page_load_strategy = 'eager'
        chrome_options.add_argument('--headless')  # Run in headless mode
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get(url)

        # Wait for the product title to be visible
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.h4'))
            )
        except TimeoutException:
            print("❌ Timeout: Judul produk tidak ditemukan setelah 10 detik.")

        # TODO - Get title, Price, desc, img   
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Ambil Title
        title_element = soup.select_one('h1.h4')
        title = title_element.text.strip() if title_element else 'Title not found'

        # Ambil Harga
        price_element = soup.find("div", {"data-testid": "large-customer-price"})
        price = price_element.text.strip() if price_element else "Not Found"

        # Ambil Gambar
        image_elements = soup.find_all("img", class_="p-100")
        image_urls = [
            img.get("src") for img in image_elements
            if img.get("src") and img.get("src").startswith("https://")
        ]

        id = random.randint(10_000_000, 99_999_999)
        
        # TODO - Get review url
        
        # search SKU ID
        match = re.search(r"/(\d+)\.p", url)
        if not match:
            review_url = "Not available"
        else:
            # get it exept awal ".p"
            base_url = url.split(".p")[0]

            # delete query string 
            base_url = base_url.split("?")[0]

            # Insert '/reviews/' just 1x
            review_url = base_url.replace("/site/", "/site/reviews/")

        print(review_url)
            
        driver.quit()

        print("✅ Selesai scrape dalam", time.time() - start, "detik")
        return {
            "id": id,
            'response': {
               'product_data' :{
                'title': title,
                'price': price,
                'description': 'Not fetched yet',
                'images': image_urls,
                'review_url':review_url,
                'product_url':url,
            },
            'reviews': 'Not fetched yet'
            }
            
        }

    except Exception as e:
        print(e)
        return {
            'error': 'Scraping product info failed',
            'details': str(e)
        }

def scrape_bestbut_review(url):
    print(url)
    start = time.time()
    print("🚀 Start scrape:", url)

    # Configure Selenium WebDriver
    chrome_options = Options()
    chrome_options.page_load_strategy = 'eager'
    chrome_options.add_argument('--headless')  # Run in headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    driver.get(url)
    
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'span.c-reviews.ugc-review-container'))
        )

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        review_count_element = soup.select_one('span.c-reviews.ugc-review-container')
        
        # TODO Get totla review
        if review_count_element:
            review_text = review_count_element.text.strip()
            print("🔍 Raw review text:", review_text)

            # Ekstrak to number from "(181 customer reviews)"
            match = re.search(r"\(([\d,]+)\s+customer\s+reviews?\)", review_text, re.IGNORECASE)
            print(match)
            total_reviews = int(match.group(1).replace(",", "")) if match else 0
        else:
            total_reviews = 0
            
        # TODO Get reviews
        review_items = soup.select("li.review-item")
        reviews = []

        for item in review_items:
            try:
                # Nama penulis
                author_tag = item.select_one("div.ugc-author strong")
                author = author_tag.get_text(strip=True) if author_tag else "Anonymous"

                # Rating (ambil dari <p class="visually-hidden">Rated 5 out of 5 stars</p>)
                rating_text = item.select_one("p.visually-hidden")
                rating = 0
                if rating_text and "Rated" in rating_text.text:
                    rating = int(rating_text.text.strip().split(" ")[1])

                # Judul review
                title_tag = item.select_one("h4.review-title")
                title = title_tag.get_text(strip=True) if title_tag else "No Title"

                # Isi review (review body)
                body_tag = item.select_one("div.ugc-review-body p.pre-white-space")
                if body_tag:
                    body = body_tag.get_text(strip=True)
                else:
                    body = "No body"

                # Rekomendasi (jika ada teks: "recommend this to a friend")
                recommend = "recommend this to a friend" in item.get_text(strip=True).lower()

                # Gambar (jika ada carousel)
                images = []
                img_tags = item.select("ul.gallery-preview img")
                if img_tags:
                    images = [img['src'] for img in img_tags if img.get('src')]

                reviews.append({
                    "author": author,
                    "rating": rating,
                    "title": title,
                    "body": body,
                    "recommendation": recommend,
                    "images": images
                })
                print(reviews)
            except Exception as e:
                print("⚠️ Error in parsing review:", e)
        
        
        driver.quit()
        end = time.time()
        print(f"✅ Selesai scrape dalam {end - start} detik")
        return {
            "total_reviews": total_reviews,
            "reviews": reviews
        }
    except Exception as e:
        print(e)
        return {
            'error': 'Scraping product review failed',
            'details': str(e)
        }


