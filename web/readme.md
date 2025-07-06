## 🏃 How to Run

Follow these steps to set up and run the Sentiview project locally.

1. **Clone this repository**:

   ```bash
   git clone https://github.com/rieckypoerwadiredja/sentiview
   cd sentiview

   ```

### 🐍 Set Up the Python Backend

1. **Setup venv**:

   ```bash
    python -m venv venv
    source venv/bin/activate     # Mac/Linux
    .\venv\Scripts\activate      # Windows
   ```

2. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run Server**:
   ```bash
    python app.py
   ```

### 🌐 Set Up the Frontend (React)

1. **Install Dependencies**:

   ```bash
    cd web
    npm install
   ```

2. **Run Frontend**:
   ```
   npm run dev
   ```

### 🔐 Setup environment variables

1. **.env**:

```
VITE_PREDICT_API_URL=http://127.0.0.1:5000/predict
VITE_BEST_BUY_API_URL=http://127.0.0.1:5000/product-info-bestbuy
VITE_BEST_BUY_REVIEW_API_URL=http://127.0.0.1:5000/product-review-bestbuy
VITE_BEST_BUY_ANALYZE_API_URL=http://127.0.0.1:5000/analyze-bestbuy
VITE_BEST_BUY_PPT_API_URL=http://127.0.0.1:5000/generate-ppt
```

2. **.env.production**:

```
VITE_PREDICT_API_URL=http://your-domain.com/predict
VITE_BEST_BUY_API_URL=http://your-domain.com/product-info-bestbuy
VITE_BEST_BUY_REVIEW_API_URL=http://your-domain.com/product-review-bestbuy
VITE_BEST_BUY_ANALYZE_API_URL=http://your-domain.com/analyze-bestbuy
VITE_BEST_BUY_PPT_API_URL=http://your-domain.com/generate-ppt
```
