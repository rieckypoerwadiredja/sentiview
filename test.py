import joblib
import nltk
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download resource jika belum
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Load model dan vectorizer
model = joblib.load("./web/sentiment_model.pkl")
vectorizer = joblib.load("./web/vectorizer.pkl")

# Preprocessing sama seperti waktu training
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return " ".join(tokens)

def label_sentiment(score):
    try:
        score = int(score)
        if score <= 2:
            return "negative"
        elif score == 3:
            return "neutral"
        else:
            return "positive"
    except:
        return "unknown"

# Load test.csv tanpa header
df_test = pd.read_csv("./data/test.csv", header=None)

# Ambil kolom ke-1 sebagai skor dan kolom ke-3 sebagai review
df_test.columns = ["score", "summary", "review"]  # kasih nama kolom sementara
df_test["label"] = df_test["score"].apply(label_sentiment)
df_test["cleaned_review"] = df_test["review"].apply(clean_text)

# Transformasi dan prediksi
X_test = vectorizer.transform(df_test["cleaned_review"])
df_test["predicted"] = model.predict(X_test)

# Evaluasi hasil
total = len(df_test)
lolos = (df_test["label"] == df_test["predicted"]).sum()
gagal = total - lolos

# Tampilkan detail yang gagal
print("Detail Prediksi Salah:")
for i, row in df_test.iterrows():
    if row["label"] != row["predicted"]:
        print(f"- Review: {row['review']}")
        print(f"  Skor: {row['score']} → Seharusnya: {row['label']}, Model Prediksi: {row['predicted']}\n")
        
print(f"\n✅ Total Data: {total}")
print(f"✅ Lolos (Prediksi Benar): {lolos}")
print(f"❌ Gagal (Prediksi Salah): {gagal}\n")


