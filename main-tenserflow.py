# 📦 Step 1: Import Library
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import nltk
import json
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, GlobalAveragePooling1D, Dense
from tensorflow.keras.callbacks import EarlyStopping
import tensorflowjs as tfjs

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

train.dropna(inplace=True)
val.dropna(inplace=True)
test.dropna(inplace=True)

# Gabungkan semua data
df = pd.concat([train, val, test])

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

df["cleaned_text"] = df["text"].apply(clean_text)

# 🎯 Step 5: Tokenization dan Label Encoding
tokenizer = Tokenizer(num_words=5000, oov_token="<OOV>")
tokenizer.fit_on_texts(df["cleaned_text"])
sequences = tokenizer.texts_to_sequences(df["cleaned_text"])
padded = pad_sequences(sequences, maxlen=100)

label_encoder = LabelEncoder()
df["label"] = label_encoder.fit_transform(df["sentiment"])  # Ex: positive=2, neutral=1, negative=0

# Pisahkan kembali ke data train dan test
X_train, X_test, y_train, y_test = train_test_split(padded, df["label"], test_size=0.2, random_state=42)

# 🤖 Step 6: Train Model
model = Sequential([
    Embedding(5000, 16, input_length=100),
    GlobalAveragePooling1D(),
    Dense(16, activation='relu'),
    Dense(3, activation='softmax')  # karena ada 3 label
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
model.summary()

model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test), callbacks=[EarlyStopping(patience=2)])

# 💾 Step 7: Save Tokenizer dan Model
token_json = tokenizer.to_json()
with open("./web/model/tokenizer.json", "w") as f:
    f.write(token_json)

tfjs.converters.save_keras_model(model, "./web/model/tfjs_model")

# 🧪 Step 8: Evaluation
y_pred_probs = model.predict(X_test)
y_pred = np.argmax(y_pred_probs, axis=1)

print("\n🧪 Evaluation on Test Set:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Confusion Matrix
ConfusionMatrixDisplay.from_predictions(y_test, y_pred, display_labels=label_encoder.classes_)
plt.title("Confusion Matrix on Test Data")
plt.show()
