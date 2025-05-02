from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def scrape_bestbuy_product(url):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) "
                         "Chrome/122.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.get(url)
        
         # Wait for the main price element to appear (up to 10 seconds)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "large-customer-price"))
        )
        start_total = time.time()
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Title
        title_tag = soup.find('h1')
        title = title_tag.text.strip() if title_tag else None

        # Price
        price_tag = soup.find('div', id='large-customer-price')
        price = price_tag.text.strip() if price_tag else None

        # Description
        desc_tag = soup.find('div', class_='body-copy-lg pt-200 pb-300 OPY7xNPkM88Vl3xh hkwiWgBO0cUEDSdm')
        description = desc_tag.text.strip() if desc_tag else None

        # Images
        image_section = soup.find('div', class_='pr-300')
        image_tags = image_section.find_all('img') if image_section else []
        image_links = [img['src'] for img in image_tags if img.get('src')]
        end_total_detail = time.time()

        # Total number of reviews (taken from text like "372 reviews")
        total_reviews_tag = soup.find('div', class_='v-text-dark-gray text-center', attrs={'aria-hidden': 'true'})
        if total_reviews_tag:
            try:
                total_reviews_text = total_reviews_tag.get_text(strip=True).split()[0]
                total_reviews = int(total_reviews_text.replace(',', ''))
            except:
                total_reviews = None
        else:
            total_reviews = None
            
        # Navigate to the reviews section by clicking the 'See All Customer Reviews' button
        review_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[span[text()='See All Customer Reviews']]"))
        )
        review_button.click()
        
        # Wait for the reviews page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'ugc-recommendation'))
        )
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Scrape reviews
        reviews = []
        review_items = soup.find_all('li', class_='review-item')

        start_total_review = time.time()
        for review in review_items:
            
            review_data = {}

            # Rating
            rating_tag = review.find('div', class_='c-ratings-reviews')
            if rating_tag:
                rating = rating_tag.find('p').text.strip()
                review_data['rating'] = rating

            # Review title
            title_tag = review.find('h4', class_='c-section-title review-title heading-5 v-fw-medium')
            review_data['review_title'] = title_tag.text.strip() if title_tag else None

            # Review content
            content_tag = review.find('p', class_='pre-white-space')
            review_data['review_content'] = content_tag.text.strip() if content_tag else None

            # Recommendation status
            recommendation_tag = review.find('div', class_='ugc-recommendation')
            review_data['recommended'] = 'true' if recommendation_tag else 'false'

            reviews.append(review_data)
            
        end_total_review = time.time()
        rata_per_review = (end_total_review - start_total_review) / len(review_items) if review_items else 0

            
        end_total = time.time()
        print(f"Total waktu scraping: {end_total - start_total:.2f} detik")
        print(f"Total waktu scraping Review: {end_total_review - start_total_review:.2f} detik")
        print(f"Total waktu scraping Details: {end_total_detail - start_total:.2f} detik")
        print(f"Rata-rata waktu per review: {rata_per_review:.4f} detik")
        
        return {
            'product_details': {
                'title': title,
                'price': price,
                'description': description,
                'images': image_links
            },
            'reviews': reviews
        }
        

    finally:
        driver.quit()

# Example usage
# url = "https://www.bestbuy.com/site/asus-chromebook-cm1402-14-fhd-laptop-mediatek-kompanio-520-4gb-memory-64gb-emmc-gravity-gray/6570143.p?skuId=6570143"
# url += "&intl=nosplash" # Skip Region Select
# data = scrape_bestbuy_product(url)
# print(data)

