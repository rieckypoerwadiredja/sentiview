import * as XLSX from "xlsx";
// utils/conversationStorage.js

// Initial Key
const STORAGE_KEY = "conversationContents";

// Data awal
const initialData = {
  BestBuy: [],
  Youtube: [],
};

// Cek & set data awal jika belum ada
export const initializeConversation = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// get data from local storage
export const getConversation = () => {
  const data = localStorage.getItem(STORAGE_KEY);

  // if no data in local storage
  if (!data) {
    const initialData = {
      BestBuy: [
        {
          id: "12345678",
          role: "user",
          text: "How is the battery life of this product?",
        },
        {
          id: "87654321",
          role: "ai",
          response: "Customers mostly say the battery lasts 8 hours.",
        },
      ],
      Sentiment: [
        {
          id: "12332122",
          role: "user",
          text: "What do people say about the video quality?",
        },
        {
          id: "12344321",
          role: "ai",
          response: "Mostly positive, many praise the HD clarity.",
        },
      ],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  return JSON.parse(data);
};

export const getConversationById = (platform, id) => {
  const data = getConversation();
  if (!data[platform]) return null;

  return data[platform].find((msg) => msg.id === id) || null;
};

export const getConversationByRoom = (platform) => {
  const data = getConversation();
  return data[platform] || [];
};

// save data to local storage
export const setConversation = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
// add user msg
export const addUserMessage = (platform, text) => {
  const data = getConversation();
  if (!data[platform]) {
    data[platform] = []; // inisialisasi array jika belum ada
  }

  data[platform].push({ role: "user", text });
  setConversation(data);
};
// add AI msg
export const addAiMessage = (platform, id, response) => {
  const data = getConversation();
  if (!data[platform]) data[platform] = [];

  data[platform].push({ id: id, role: "ai", response });
  setConversation(data);
};

export const deleteAllConversation = () => {
  if (window.confirm("Are you sure you want to clear all conversations?")) {
    localStorage.removeItem("conversationContents");
    window.location.reload();
  }
};

// update ai messege
export const updateAiMessage = (platform, id, newData) => {
  const data = getConversation();
  if (!data[platform]) return;

  const index = data[platform].findIndex(
    (msg) => msg.id === id && msg.role === "ai"
  );
  if (index !== -1) {
    data[platform][index] = {
      ...data[platform][index],
      response: {
        ...data[platform][index].response,
        ...newData, // merge new data (e.g., review)
      },
    };
    setConversation(data);
  }
};

export const conversationPredict = async (text) => {
  try {
    const response = await fetch(import.meta.env.VITE_PREDICT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return { error: error.message };
  }
};

export const conversationBestBuyProductInfo = async (text) => {
  try {
    const match = text.match(/(https?:\/\/)?(www\.)?bestbuy\.com\/[^\s,]+/i);

    if (!match) {
      console.log("❌ URL not found!");
      throw new Error("URL not found!");
    }

    const url = match[0].startsWith("http") ? match[0] : "https://" + match[0];

    console.log("✅ Link ditemukan:", url);

    const response = await fetch(import.meta.env.VITE_BEST_BUY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    console.log(import.meta.env.VITE_BEST_BUY_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(import.meta.env.VITE_BEST_BUY_API_URL);
    console.error("Error fetching product info:", error);
    return { error: error.message };
  }
};

export const conversationBestBuyProductReview = async (url) => {
  try {
    const match = url.match(/(https?:\/\/)?(www\.)?bestbuy\.com\/[^\s,]+/i);

    if (!match) {
      console.log("❌ URL not found!");
      console.log(url);
      throw new Error("URL not found!");
    }

    const url_ = match[0].startsWith("http") ? match[0] : "https://" + match[0];

    console.log(
      "✅ Link review found:",
      import.meta.env.VITE_BEST_BUY_REVIEW_API_URL
    );

    const response = await fetch(import.meta.env.VITE_BEST_BUY_REVIEW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url_ }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(import.meta.env.VITE_BEST_BUY_API_URL);
    console.error("Error fetching product review:", error);
    return { error: error.message };
  }
};

export const conversationBestBuyAnalyze = async (productData) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BEST_BUY_ANALYZE_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_data: productData }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Analysis result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error fetching analysis:", error);
    return { error: error.message };
  }
};

export function exportBestBuyToExcel() {
  const { BestBuy } = getConversation();

  if (!BestBuy || BestBuy.length === 0) {
    alert("No BestBuy data found.");
    return;
  }

  const products = [];
  const reviews = [];
  const analysis = [];

  BestBuy.forEach((entry) => {
    if (entry.role === "ai" && entry.response?.type === "product") {
      const product = entry.response;
      const productId = entry.id;

      // Sheet: Products
      products.push({
        product_id: productId,
        title: product.title,
        price: product.price,
        product_url: product.product_url,
        review_url: product.review_url,
        total_reviews: product.total_review,
      });

      // Sheet: Reviews
      if (Array.isArray(product.reviews)) {
        product.reviews.forEach((review, i) => {
          reviews.push({
            product_id: productId,
            reviewer: review.author,
            title: review.title,
            body: review.body,
            rating: review.rating,
            recommendation: review.recommendation ? "Yes" : "No",
            index: i + 1,
          });
        });
      }

      // Sheet: Analysis
      if (product.analysis) {
        const { sentiment_summary, top_pros, top_cons, word_cloud_data } =
          product.analysis;

        // Flatten pros/cons/wordcloud
        top_pros.forEach(([phrase, count]) => {
          analysis.push({
            product_id: productId,
            type: "Pro",
            phrase,
            count,
          });
        });

        top_cons.forEach(([phrase, count]) => {
          analysis.push({
            product_id: productId,
            type: "Con",
            phrase,
            count,
          });
        });

        word_cloud_data.forEach(([phrase, count]) => {
          analysis.push({
            product_id: productId,
            type: "Word",
            phrase,
            count,
          });
        });

        // Add sentiment summary as well
        ["positive", "neutral", "negative"].forEach((sent) => {
          analysis.push({
            product_id: productId,
            type: "Sentiment",
            phrase: sent,
            count: sentiment_summary[sent],
          });
        });
      }
    }
  });

  // Convert to sheets
  const wb = XLSX.utils.book_new();

  const wsProducts = XLSX.utils.json_to_sheet(products);
  XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

  const wsReviews = XLSX.utils.json_to_sheet(reviews);
  XLSX.utils.book_append_sheet(wb, wsReviews, "Reviews");

  const wsAnalysis = XLSX.utils.json_to_sheet(analysis);
  XLSX.utils.book_append_sheet(wb, wsAnalysis, "Analysis");

  // Download
  XLSX.writeFile(wb, "BestBuyData.xlsx");
}

export function exportProductToExcel(productId) {
  const allData = getConversationByRoom("BestBuy");
  const productData = allData.find(
    (entry) => entry.id === productId && entry.role === "ai"
  );

  if (!productData) {
    alert("Product ID not found!");
    return;
  }

  const { response } = productData;
  const {
    title,
    price,
    product_url,
    review_url,
    total_review,
    reviews = [],
    analysis = {},
  } = response;

  const currentYear = new Date().getFullYear();

  // Sheet 1: Product Info
  const productInfoSheet = [
    {
      product_id: productId,
      title,
      price,
      product_url,
      review_url,
      total_reviews: total_review,
    },
  ];

  // Sheet 2: Reviews
  const reviewSheet = reviews.map((r, idx) => ({
    no: idx + 1,
    author: r.author,
    title: r.title,
    body: r.body,
    rating: r.rating,
    recommendation: r.recommendation ? "Yes" : "No",
    posted_month: r.review_info?.posted?.label
      ? `${r.review_info.posted.label} ${currentYear}`
      : "Unknown",
    usage_duration: r.review_info?.used_duration?.duration || "Unknown",
  }));

  // Sheet 3: Sentiment
  const sentimentSheet = [];
  if (analysis.sentiment_summary) {
    const { positive, neutral, negative } = analysis.sentiment_summary;
    sentimentSheet.push(
      { sentiment: "positive", count: positive },
      { sentiment: "neutral", count: neutral },
      { sentiment: "negative", count: negative }
    );
  }

  // Sheet 4: Top Pros
  const topProsSheet = [];
  if (analysis.top_pros?.length) {
    analysis.top_pros.forEach(([phrase, count]) => {
      topProsSheet.push({
        phrase,
        count,
      });
    });
  }

  // Sheet 5: Top Cons
  const topConsSheet = [];
  if (analysis.top_cons?.length) {
    analysis.top_cons.forEach(([phrase, count]) => {
      topConsSheet.push({
        phrase,
        count,
      });
    });
  }

  // Generate workbook
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(productInfoSheet),
    "Product Info"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(reviewSheet),
    "Reviews"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(sentimentSheet),
    "Sentiment"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(topProsSheet),
    "Top Pros"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(topConsSheet),
    "Top Cons"
  );

  // Save file
  XLSX.writeFile(wb, `Product-${productId}.xlsx`);
}
