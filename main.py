# 📦 Step 1: Import Library
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re
import nltk
import random
import pickle
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import NaiveBayesClassifier, classify

# Setup awal
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# 📂 Step 2: Load Data
train = pd.read_csv('./data/train_df.csv')
val = pd.read_csv('./data/val_df.csv')
test = pd.read_csv('./data/test_df.csv')

# 🧹 Step 3: Data Cleaning
train.dropna(inplace=True)
val.dropna(inplace=True)
test.dropna(inplace=True)

# Visualisasi distribusi label
plt.figure(figsize=(8, 5))
sns.countplot(x=train['sentiment'])
plt.title("Distribusi Label Sentimen - Train Set")
plt.xlabel("Sentiment")
plt.ylabel("Jumlah")
plt.show()

# 🧼 Step 4: Preprocessing
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def preprocess(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|[^a-z\s]", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return tokens

def text_to_features(tokens):
    return {word: True for word in tokens}

# Konversi data ke format nltk
def convert_to_nltk_format(df):
    return [(text_to_features(preprocess(row["text"])), row["sentiment"]) for _, row in df.iterrows()]

train_set = convert_to_nltk_format(train)
val_set = convert_to_nltk_format(val)
test_set = convert_to_nltk_format(test)

# 🤖 Step 5: Train Model
model = NaiveBayesClassifier.train(train_set)

# 💾 Step 6: Save Model
with open("./web/model/nltk_sentiment_model.pkl", "wb") as f:
    pickle.dump(model, f)

# 🧪 Step 7: Evaluation
def evaluate_model(model, dataset, label="Test"):
    accuracy = classify.accuracy(model, dataset)
    print(f"\n✅ {label} Accuracy: {accuracy:.2f}")
    model.show_most_informative_features(10)

evaluate_model(model, val_set, "Validation")
evaluate_model(model, test_set, "Test")
