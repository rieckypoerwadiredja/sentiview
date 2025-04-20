# Install and import libraries
import pandas as pd
import nltk
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Download NLTK resources (only needs to be run once)
print("Downloading NLTK resources...")
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Load datasets
print("Loading datasets...")
df1 = pd.read_csv("./data/amazon.csv")

# Dataset without header
df3 = pd.read_csv("./data/train.csv", header=None)  # Adjust the path if needed
df3 = df3[[0, 2]]  # Select first and third columns
df3.columns = ["score", "review"]  # Rename columns

# Load Reviews.csv (with header)
df2 = pd.read_csv("./data/Reviews.csv")

# Standardize column names
print("Renaming columns...")
df1 = df1.rename(columns={"reviewText": "review", "overall": "score"})
df2 = df2.rename(columns={"Text": "review", "Score": "score"})

# Merge all datasets
print("Merging all datasets...")
df = pd.concat([
    df1[["review", "score"]],
    df2[["review", "score"]],
    df3[["review", "score"]]
], ignore_index=True)

# Remove empty rows
print("Removing rows with missing values...")
df = df.dropna(subset=["review", "score"])

# Clean text
print("Cleaning text...")
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = str(text).strip('"').lower()
    text = re.sub(r"http\S+|www\S+|https\S+", '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return " ".join(tokens)

df["cleaned_text"] = df["review"].apply(clean_text)

# Label sentiment
print("Labeling sentiment...")
def label_sentiment(score):
    try:
        score = float(score)
        if score <= 2:
            return "negative"
        elif score >= 4:
            return "positive"
        else:
            return None  # Ignore neutral (score == 3)
    except:
        return None

df["sentiment"] = df["score"].apply(label_sentiment)
df = df.dropna(subset=["sentiment"])

# Feature extraction
print("Extracting features for model training...")
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["cleaned_text"])
y = df["sentiment"]

# Split dataset
print("Splitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
print("Training Naive Bayes model...")
model = MultinomialNB()
model.fit(X_train, y_train)

# Evaluate the model
print("Predicting and evaluating the model...")
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))
num_positive = (df["sentiment"] == "positive").sum()
num_negative = (df["sentiment"] == "negative").sum()
print(f"✅ Total positive reviews: {num_positive}")
print(f"✅ Total negative reviews: {num_negative}")

# Save the model and vectorizer
print("Saving model and vectorizer...")
joblib.dump(model, "./web/sentiment_model.pkl")
joblib.dump(vectorizer, "./web/vectorizer.pkl")
print("✅ Model and vectorizer saved successfully.")
