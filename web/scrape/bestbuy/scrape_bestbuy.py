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
import string
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import nltk
from datetime import datetime
from rake_nltk import Rake

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
        container = soup.find("div", class_="no-scroll")
        image_elements = container.select("img") if container else []

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

from urllib.parse import urlencode, urlparse, parse_qs, urlunparse

def scrape_bestbut_review(url):
    print(url)
    start = time.time()
    print("🚀 Start scrape:", url)

    # Setup WebDriver
    chrome_options = Options()
    chrome_options.page_load_strategy = 'eager'
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    page = 1
    total_reviews = None
    all_reviews = []

    while True:
        parsed_url = urlparse(url)
        query = parse_qs(parsed_url.query)

        # Tetap pertahankan semua query (termasuk variant)
        if page == 1:
            query.pop("page", None)
        else:
            if "variant" not in query:
                query["variant"] = ["A"]
            query["page"] = [str(page)]

        # Rebuild query string
        new_query = urlencode(query, doseq=True)
        page_url = urlunparse(parsed_url._replace(query=new_query))

        driver.get(page_url)
        print(f"🔄 Scraping page {page}: {page_url}")

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'span.c-reviews.ugc-review-container'))
            )

            soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Ambil total review hanya di halaman pertama
            if total_reviews is None:
                review_count_element = soup.select_one('span.c-reviews.ugc-review-container')
                if review_count_element:
                    review_text = review_count_element.text.strip()
                    match = re.search(r"\(([\d,]+)\s+customer\s+reviews?\)", review_text, re.IGNORECASE)
                    total_reviews = int(match.group(1).replace(",", "")) if match else 0
                    print(f"📊 Total review terdeteksi: {total_reviews}")
                else:
                    total_reviews = 0

            # Scrape review item
            review_items = soup.select("li.review-item")
            if not review_items:
                print("⛔ Tidak ada review ditemukan di halaman ini. Menghentikan scraping.")
                break

            for item in review_items:
                try:
                    author = item.select_one("div.ugc-author strong")
                    author = author.get_text(strip=True) if author else "Anonymous"

                    rating_text = item.select_one("p.visually-hidden")
                    rating = int(rating_text.text.strip().split(" ")[1]) if rating_text and "Rated" in rating_text.text else 0

                    title_tag = item.select_one("h4.review-title")
                    title = title_tag.get_text(strip=True) if title_tag else "No Title"

                    body_tag = item.select_one("div.ugc-review-body p.pre-white-space")
                    body = body_tag.get_text(strip=True) if body_tag else "No body"

                    recommend = False  
                    recommendation_tag = item.select_one("div.ugc-recommendation")
                    if recommendation_tag:
                        text = recommendation_tag.get_text(" ", strip=True).lower()

                        if "no, i would not recommend" in text:
                            recommend = False
                        elif "i would recommend" in text:
                            recommend = True

                    images = []
                    img_tags = item.select("ul.gallery-preview img")
                    if img_tags:
                        images = [img['src'] for img in img_tags if img.get('src')]

                    post = item.select_one("div.posted-date-ownership")
                    posted_info = {}
                    if post:
                        time_tag = post.find("time", class_="submission-date")
                        if time_tag and time_tag.get("title"):
                            post_date = datetime.strptime(time_tag["title"], "%b %d, %Y %I:%M %p")
                            posted_info["posted"] = {
                                "label": post_date.strftime("%B"),
                                "month": post_date.month
                            }
                        else:
                            posted_info["posted"] = None

                        # Check usage duration
                        match = re.search(r"Owned for\s+(.+?)\s+when reviewed", post.get_text())
                        if match:
                            duration = match.group(1).lower()
                            # Normalisasi angka
                            num = re.search(r"(\d+)", duration)
                            num = int(num.group(1)) if num else 1  # default ke 1

                            if "less than" in duration or "week" in duration:
                                dur_label = "less than 1 month"
                            elif "month" in duration:
                                if num <= 6:
                                    dur_label = "1 - 6 months"
                                elif num <= 12:
                                    dur_label = "6 - 12 months"
                                else:
                                    dur_label = "more than a year"
                            elif "year" in duration:
                                if num == 1:
                                    dur_label = "more than a year"
                                else:
                                    dur_label = "more than a year"
                            else:
                                dur_label = "unknown"

                            posted_info["used_duration"] = {
                                "value": True,
                                "duration": dur_label
                            }
                        else:
                            posted_info["used_duration"] = {
                                "value": False
                            }
        
                    all_reviews.append({
                        "author": author,
                        "rating": rating,
                        "title": title,
                        "body": body,
                        "recommendation": recommend,
                        "images": images,
                        'review_info': posted_info

                    })
                except Exception as e:
                    print("⚠️ Error parsing review:", e)

            print(f"✅ Total review terkumpul: {len(all_reviews)}")

            if len(all_reviews) >= total_reviews:
                print("✅ Semua review telah diambil.")
                break

            page += 1
            time.sleep(1)  # jeda kecil biar ramah server

        except Exception as e:
            print("⚠️ Gagal memproses halaman:", e)
            break

    driver.quit()
    end = time.time()
    print(f"🏁 Selesai scraping dalam {end - start:.2f} detik")
    return {
        "total_reviews": total_reviews,
        "reviews": all_reviews
    }

from nltk import bigrams

import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from rake_nltk import Rake
from collections import Counter
import string
import re

# Helper untuk membersihkan dan menyaring frasa
def clean_phrase(phrase):
    return re.sub(r"[^\w\s\-]", "", phrase).strip()

def is_valid_phrase(phrase):
    words = word_tokenize(phrase)
    if len(words) < 2 and len(phrase) <= 8:
        return False
    tags = pos_tag(words)
    has_noun = any(tag.startswith("NN") for _, tag in tags)
    return has_noun

def analyze_product_data(product_data):
        # Tokenizer
    try:
        nltk.data.find("tokenizers/punkt")
    except:
        nltk.download("punkt")

    # POS Tagger
    try:
        nltk.data.find("taggers/averaged_perceptron_tagger")
    except:
        nltk.download("averaged_perceptron_tagger")

    # Stopwords
    try:
        stop_words = set(stopwords.words("english"))
    except:
        nltk.download("stopwords")
        stop_words = set(stopwords.words("english"))

    # VADER
    try:
        sia = SentimentIntensityAnalyzer()
    except:
        nltk.download("vader_lexicon")
        sia = SentimentIntensityAnalyzer()


    # Inisialisasi RAKE
    rake = Rake(stopwords=stop_words)
    punctuation_table = str.maketrans("", "", string.punctuation)

    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    word_freq = Counter()
    pros = Counter()
    cons = Counter()

    for review in product_data["response"].get("reviews", []):
        title = review.get("title", "")
        body = review.get("body", "")
        full_text = f"{title}. {body}".strip()

        # Sentiment analysis
        sentiment_score = sia.polarity_scores(full_text)
        compound = sentiment_score["compound"]

        if compound >= 0.2:
            sentiment = "positive"
            sentiment_counts["positive"] += 1
        elif compound <= -0.2:
            sentiment = "negative"
            sentiment_counts["negative"] += 1
        else:
            sentiment = "neutral"
            sentiment_counts["neutral"] += 1

        review["sentiment"] = sentiment

        # Word Frequency
        words = word_tokenize(full_text.lower().translate(punctuation_table))
        words = [w for w in words if w not in stop_words and w.isalpha()]
        word_freq.update(words)

        # RAKE keyword extraction
        rake.extract_keywords_from_text(full_text)
        raw_keywords = rake.get_ranked_phrases()
        filtered_keywords = [clean_phrase(k) for k in raw_keywords if is_valid_phrase(k)]

        if sentiment == "positive":
            pros.update(filtered_keywords)
        elif sentiment == "negative":
            cons.update(filtered_keywords)

    # Remove overlap
    overlapping = set(pros) & set(cons)
    for phrase in overlapping:
        if pros[phrase] > cons[phrase]:
            del cons[phrase]
        else:
            del pros[phrase]
            
    # duration distribution
    duration_keys = [
        "not used yet",
        "less than 1 month",
        "1 - 6 months",
        "6 - 12 months",
        "more than a year"
    ]
    duration_distribution = {key: 0 for key in duration_keys}

    for r in product_data["response"]["reviews"]:
        duration_info = r.get("review_info", {}).get("used_duration", {})
        if duration_info.get("value") is True:
            label = duration_info.get("duration")
        else:
            label = "not used yet"

        if label in duration_distribution:
            duration_distribution[label] += 1

    
  # Hitung distribusi rating
    rating_chart_data = [
        {"key": int(k), "data": v}
        for k, v in sorted(Counter([r["rating"] for r in product_data["response"]["reviews"]]).items())
    ]

    # Hitung distribusi durasi
    duration_chart_data = [
        {"key": k, "data": v}
        for k, v in duration_distribution.items()
    ]

    # Hitung distribusi trend waktu review
    trend_chart_data = [
        {"key": k, "data": v}
        for k, v in Counter([
            r.get("review_info", {}).get("posted", {}).get("label", "unknown")
            for r in product_data["response"]["reviews"]
            if r.get("review_info", {}).get("posted")
        ]).items()
    ]
    
    # Tambahkan ke struktur data hasil
    product_data["response"]["analysis"] = {
        "sentiment_summary": sentiment_counts,
        "top_pros": pros.most_common(10),
        "top_cons": cons.most_common(10),
        "word_cloud_data": word_freq.most_common(30),
        "rating_insights": analyze_rating_distribution(product_data["response"]["reviews"]),
        "duration_insights": analyze_usage_duration(product_data["response"]["reviews"]),
        "trend_insights": analyze_rating_trend(product_data["response"]["reviews"]),
        # Raw distribution
        "rating_distribution": rating_chart_data,
        "duration_distribution": duration_chart_data,
        "trend_distribution": trend_chart_data,
    }

    

    return product_data




# TODO ANALYSIS Rating, used duration, time review

def analyze_rating_distribution(reviews):
    rating_counts = Counter(r["rating"] for r in reviews)
    total = sum(rating_counts.values())

    if total == 0:
        return [{"sentiment": "neutral", "message": "Not enough rating data available for analysis."}]

    insights = []
    sorted_counts = sorted(rating_counts.items(), key=lambda x: x[1], reverse=True)
    top_key, top_count = sorted_counts[0]
    top_percentage = top_count / total

    # Dominasi rating
    if top_percentage >= 0.6:
        if top_key == 5:
            insights.append({"sentiment": "positive", "message": "The majority of users are very satisfied. This product is considered highly satisfactory."})
        elif top_key == 4:
            insights.append({"sentiment": "positive", "message": "Most users are fairly satisfied. The product is considered to be of good quality."})
        elif top_key == 3:
            insights.append({"sentiment": "neutral", "message": "Many users gave average ratings. The product may be mediocre or not meet expectations."})
        else:
            insights.append({"sentiment": "negative", "message": "The majority of users gave low ratings. The product is considered disappointing."})
    else:
        insights.append({"sentiment": "neutral", "message": "No dominant rating. User perceptions are quite diverse."})

    # Perbandingan rating tertinggi & kedua
    if len(sorted_counts) > 1:
        top_key2, top_count2 = sorted_counts[1]
        if top_key == 5 and top_key2 == 1:
            insights.append({"sentiment": "neutral", "message": "Rating 5 is the highest, but rating 1 is also quite high. This product likely creates very different experiences among users — possibly controversial."})
        elif top_key == 5 and top_key2 == 4:
            insights.append({"sentiment": "positive", "message": "Ratings 5 and 4 are the highest. Most users are consistently satisfied with the product's quality."})
        elif top_key == 5 and top_key2 <= 3:
            insights.append({"sentiment": "neutral", "message": "Although rating 5 is the highest, many other users gave moderate or low ratings. This may indicate a mismatch in expectations for some users."})
        elif top_key <= 2 and top_key2 == 5:
            insights.append({"sentiment": "negative", "message": "Low ratings dominate, but rating 5 is also quite significant. This suggests highly varied user experiences and the product may be seen as inconsistent in quality."})
        elif top_key <= 2 and top_key2 <= 2:
            insights.append({"sentiment": "negative", "message": "Most users gave low ratings. The product tends to be disappointing and needs significant improvement."})
        else:
            insights.append({"sentiment": "neutral", "message": "The rating distribution is quite diverse without a clear dominant pattern. User experiences seem to vary."})

    # Skewness
    is_skew_high = rating_counts[5] > rating_counts[4] > rating_counts[3]
    is_skew_low = rating_counts[1] > rating_counts[2] > rating_counts[3]
    if is_skew_high:
        insights.append({"sentiment": "positive", "message": "The rating distribution is skewed toward the high end. The product is considered very good by many users."})
    elif is_skew_low:
        insights.append({"sentiment": "negative", "message": "The rating distribution is skewed toward the low end. The product appears to be unsatisfactory for most users."})

    return insights


def analyze_usage_duration(reviews):
    counter = Counter()
    for r in reviews:
        dur = r.get("review_info", {}).get("used_duration", {}).get("duration")
        if dur:
            counter[dur] += 1
    total = sum(counter.values())
    if total == 0:
        return [{"sentiment": "neutral", "message": "Not enough rating data available for analysis."}]

    insights = []
    top = counter.most_common(1)[0]
    if top[1] > 0:
        sentiment = "positive" if top[0] in ["6 - 12 months", "more than a year"] else "neutral"
        insights.append({"sentiment": sentiment, "message": f"The majority of users have used the product for {top[0]}. This indicates a strong tendency toward this category."})
    else:
        insights.append({"sentiment": "neutral", "message": "There is no dominant usage duration category yet."})

    # Long-term usage
    long_use = counter["6 - 12 months"] + counter["more than a year"]
    if long_use / total > 0.5:
        insights.append({"sentiment": "positive", "message": "The majority of users have used the product long-term. This indicates loyalty and product durability."})
    elif counter["less than 1 month"] / total > 0.5:
        insights.append({"sentiment": "neutral", "message": "Most users are new users. It takes time to assess long-term retention."})
    else:
        insights.append({"sentiment": "neutral", "message": "Product usage is spread across various durations, indicating variation in user experience."})

    if counter["not used yet"] / total > 0.2:
        insights.append({"sentiment": "neutral", "message": "A number of users gave ratings despite not having used the product directly. This may indicate high initial expectations or bias based on reputation."})
    else:
        insights.append({"sentiment": "neutral", "message": "Most users have tried the product directly before giving a rating."})

    return insights


def analyze_rating_trend(reviews):
    month_counts = Counter()
    for r in reviews:
        month = r.get("review_info", {}).get("posted", {}).get("month")
        if month:
            month_counts[month] += 1
    if not month_counts:
        return [{"sentiment": "neutral", "message": "No review time data available for analysis."}]

    insights = []

    # Peak month
    peak_month = max(month_counts, key=month_counts.get)
    month_name = datetime.strptime(str(peak_month), "%m").strftime("%B")
    insights.append({"sentiment": "positive", "message": f"The highest number of ratings was recorded in {month_name}. This indicates a peak in user activity."})

    # Trend detection
    sorted_months = sorted(month_counts.items())
    trend = []
    for i in range(1, len(sorted_months)):
        prev = sorted_months[i - 1][1]
        curr = sorted_months[i][1]
        if curr > prev:
            trend.append("up")
        elif curr < prev:
            trend.append("down")
        else:
            trend.append("flat")

    ups = trend.count("up")
    downs = trend.count("down")
    if ups > len(trend) * 0.6:
        insights.append({"sentiment": "positive", "message": "There is an upward trend in the number of ratings month over month. This product is gaining increasing attention."})
    elif downs > len(trend) * 0.6:
        insights.append({"sentiment": "negative", "message": "The number of ratings shows a downward trend. Interest in the product may be starting to decline."})
    else:
        insights.append({"sentiment": "neutral", "message": "The number of ratings fluctuates up and down. There is no consistent trend direction."})

    # Stability
    values = [v for _, v in sorted_months]
    avg = sum(values) / len(values)
    stddev = (sum((v - avg) ** 2 for v in values) / len(values)) ** 0.5
    if stddev < avg * 0.3:
        insights.append({"sentiment": "positive", "message": "The number of ratings per month is relatively stable. User activity has been fairly consistent over time."})
    else:
        insights.append({"sentiment": "neutral", "message": "There is significant variation between months. Review activity appears seasonal or inconsistent."})

    return insights


