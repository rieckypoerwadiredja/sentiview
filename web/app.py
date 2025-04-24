from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import re
import nltk
nltk.data.path.append('./nltk/nltk_data')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Setup awal
# nltk.download('punkt', download_dir='./nltk/nltk_data')
# nltk.download('stopwords', download_dir='./nltk/nltk_data')
# nltk.download('wordnet', download_dir='./nltk/nltk_data')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)

# Load model NLTK (NaiveBayesClassifier)
model = joblib.load("./model/nltk_sentiment_model.pkl")

# Preprocessing
stop_words = set(stopwords.words("english"))
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

    return jsonify({"sentiment": prediction})

# Jalankan server
import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
