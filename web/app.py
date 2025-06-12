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
from scrape.bestbuy.scrape_bestbuy import scrape_bestbuy_product
import random
from responses import negative_responses,positive_responses
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

@app.route("/analyze-bestbuy", methods=["POST"])
def analyze_bestbuy():
    data = request.get_json()
    if "url" not in data:
        return jsonify({"error": "No url field provided"}), 400

    url = data["url"]
    product_data = scrape_bestbuy_product(url)

    if "error" in product_data:
        return jsonify(product_data), 500

    return jsonify(product_data)




# Jalankan server
import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port,debug=True)