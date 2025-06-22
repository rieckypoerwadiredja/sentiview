import nltk
import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords  # Pastikan ini diimpor setelah nltk
from nltk.stem import WordNetLemmatizer
from scrape.bestbuy.scrape_bestbuy import scrape_bestbuy_product_info,scrape_bestbut_review
import random
from responses import negative_responses,positive_responses
from langchain_ollama import ChatOllama
import json

# Setup logging
logging.basicConfig(level=logging.INFO)

# Setup NLTK data path
nltk_data_path = "/tmp/nltk_data"
os.makedirs(nltk_data_path, exist_ok=True)
nltk.data.path.append(nltk_data_path)

# Download NLTK resources
for resource in ["punkt", "stopwords", "wordnet","punkt_tab"]:
    try:
        nltk.data.find(f"corpora/{resource}")  # Cek jika sudah ada
    except LookupError:
        logging.info(f"{resource} tidak ditemukan, mengunduh...")
        nltk.download(resource, download_dir=nltk_data_path)

# Flask Setup
app = Flask(__name__)
CORS(app)

# Load model NLTK (NaiveBayesClassifier)
model = joblib.load("./model/nltk_sentiment_model.pkl")

# Preprocessing
stop_words = set(stopwords.words("english"))  # Pastikan ini diletakkan setelah import stopwords
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|[^a-z\s]", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return tokens

# Konversi token ke fitur dict → sesuai yang digunakan di training
def text_to_features(tokens):
    return {word: True for word in tokens}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if "text" not in data:
        return jsonify({"error": "No text field provided"}), 400

    raw_text = data["text"]
    tokens = clean_text(raw_text)
    features = text_to_features(tokens)
    prediction = model.classify(features)

    if prediction == "negative":
        chosen_response = random.choice(negative_responses).replace("{text}", raw_text)
    else:
        chosen_response = random.choice(positive_responses).replace("{text}", raw_text)

    id = [random.randint(10_000_000, 99_999_999) for _ in range(1)]
    return jsonify({
        "id": id,
        "sentiment": prediction,
        "response": chosen_response
    })

@app.route("/product-info-bestbuy", methods=["POST"])
def product_info_bestbuy():
    data = request.get_json()
    if "url" not in data:
        return jsonify({"error": "No url field provided"}), 400

    url = data["url"]
    product_data = scrape_bestbuy_product_info(url)
    
    if "error" in product_data:
        return jsonify(product_data), 500

    return jsonify(product_data)

@app.route("/product-review-bestbuy", methods=["POST"])
def product_review_bestbuy():
    data = request.get_json()
    if "url" not in data:
        return jsonify({"error": "No url field provided"}), 400

    url = data["url"]
    review_data = scrape_bestbut_review(url)
    
    if "error" in review_data:
        return jsonify(review_data), 500

    return jsonify(review_data)



@app.route("/ai", methods=["POST"])
def OllamaAI():
    # Helper untuk ekstrak konten JSON dari blok markdown
    def extract_json_block(text):
        match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
        return match.group(1).strip() if match else text.strip()

    model = ChatOllama(model="gemma3:4b")
    result = model.invoke(input="""
Make 3 sample data in JSON like this:

{
    "id": [
        35941231
    ],
    "response": {
        "product_data": {
            "description": "Not fetched yet",
            "images": [
                "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6df2b890-c512-45e6-a91b-b5f1e0249f6d.jpg",
                "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/93f0b0e1-e04b-4239-907b-e565f07a2a6a.jpg"
            ],
            "price": "$329.00",
            "title": "HP - 14\" Chromebook - Intel Celeron - 4GB Memory - 64GB eMMC - Modern Grey"
        },
        "reviews": "Not fetched yet"
    }
}

response must json!
""")

    print(result)

    response_string = extract_json_block(result.content)

    try:
        response_json = json.loads(response_string)
        print("✅ berhasil parsing JSON:")
        print(response_json)
        print(response_json[0]['response']['product_data']['title'])
        
        # print(title)
        return jsonify(response_json)
    except json.JSONDecodeError as e:
        print("⚠️ Gagal parsing JSON:", e)
        return {"error": "Response is not valid JSON", "raw": response_string}, 500


# Jalankan server
import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port,debug=True)