# Sentiment Analysis Training and Evaluation Pipeline

# 📦 Step 1: Import Library
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import re
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, ConfusionMatrixDisplay
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Setup awal
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# 📂 Step 2: Load Data
train = pd.read_csv('./data/train_df.csv')
val = pd.read_csv('./data/val_df.csv')
test = pd.read_csv('./data/test_df.csv')

# 🧹 Step 3: Data Cleaning
print("🔍 Cek null values:\n")
print("Train:\n", train.isnull().sum())
print("Validation:\n", val.isnull().sum())
print("Test:\n", test.isnull().sum())

# Hapus data yang null
train.dropna(inplace=True)
val.dropna(inplace=True)
test.dropna(inplace=True)

# Lihat distribusi sentimen
plt.figure(figsize=(8,5))
sns.countplot(x=train['sentiment'])
plt.title("Distribusi Label Sentimen - Train Set")
plt.xlabel("Sentiment")
plt.ylabel("Jumlah")
plt.show()

# 🧼 Step 4: Preprocessing Text
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|[^a-z\s]", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return " ".join(tokens)

train["cleaned_text"] = train["text"].apply(clean_text)
val["cleaned_text"] = val["text"].apply(clean_text)
test["cleaned_text"] = test["text"].apply(clean_text)

# 🎯 Step 5: Vectorization
vectorizer = CountVectorizer()
X_train = vectorizer.fit_transform(train["cleaned_text"])
X_val = vectorizer.transform(val["cleaned_text"])
X_test = vectorizer.transform(test["cleaned_text"])

y_train = train["sentiment"]
y_val = val["sentiment"]
y_test = test["sentiment"]

# 🤖 Step 6: Train Model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 💾 Step 7: Save Model
joblib.dump(model, "./web/model/sentiment_model.pkl")
joblib.dump(vectorizer, "./web/model/vectorizer.pkl")

# 🧪 Step 8: Evaluation
print("\n🧪 Evaluation on Test Set:")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Confusion Matrix
ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
plt.title("Confusion Matrix on Test Data")
plt.show()
