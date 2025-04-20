import sys
import joblib
import nltk
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Load the model and vectorizer
model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Initialize NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Function to clean text
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and len(w) > 2]
    return " ".join(tokens)

# Get text input from command line
text = sys.argv[1]

# Clean the input text
cleaned_text = clean_text(text)

# Vectorize the input text
vectorized_text = vectorizer.transform([cleaned_text])

# Predict sentiment
prediction = model.predict(vectorized_text)
sentiment = prediction[0]

# Output the result
print(sentiment)
