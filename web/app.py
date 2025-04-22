from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- tambahkan ini
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Setup awal NLTK
nltk.download('punkt', download_dir='./nltk/nltk_data')
nltk.download('stopwords', download_dir='./nltk/nltk_data')
nltk.download('wordnet', download_dir='./nltk/nltk_data')

# Inisialisasi Flask
app = Flask(__name__)
CORS(app)  # <-- aktifkan CORS di seluruh route

# Load model dan vectorizer
model = joblib.load("./model/sentiment_model.pkl")
vectorizer = joblib.load("./model/vectorizer.pkl")

# Fungsi preprocessing
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|[^a-z\s]", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return " ".join(tokens)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if "text" not in data:
        return jsonify({"error": "No text field provided"}), 400

    raw_text = data["text"]
    cleaned = clean_text(raw_text)
    vectorized = vectorizer.transform([cleaned])
    prediction = model.predict(vectorized)[0]

    return jsonify({"sentiment": prediction})

import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
