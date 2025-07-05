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
  // Platform like BestBuy, Sentiment, ect
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

  const sentimentSheet = [];
  if (analysis.sentiment_summary) {
    const { positive, neutral, negative } = analysis.sentiment_summary;
    sentimentSheet.push(
      { sentiment: "positive", count: positive },
      { sentiment: "neutral", count: neutral },
      { sentiment: "negative", count: negative }
    );
  }

  const combinedWordsSheet = [];
  (analysis.top_pros || []).forEach(([phrase, count]) => {
    combinedWordsSheet.push({ phrase, count, type: "Top Pro" });
  });
  (analysis.top_cons || []).forEach(([phrase, count]) => {
    combinedWordsSheet.push({ phrase, count, type: "Top Con" });
  });

  const insightSheet = [];
  const insightTypes = [
    { list: analysis.duration_insights, type: "Duration" },
    { list: analysis.rating_insights, type: "Rating" },
    { list: analysis.trend_insights, type: "Trend" },
  ];
  insightTypes.forEach(({ list, type }) => {
    (list || []).forEach(({ message, sentiment }) => {
      insightSheet.push({ type, message, sentiment });
    });
  });

  const distributionSheets = {
    Duration: analysis.duration_distribution || [],
    Rating: analysis.rating_distribution || [],
    Trend: analysis.trend_distribution || [],
  };

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
    XLSX.utils.json_to_sheet(combinedWordsSheet),
    "Top Words"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(insightSheet),
    "Insights"
  );

  Object.entries(distributionSheets).forEach(([name, dist]) => {
    const sheetData = dist.map(({ key, data }) => ({ key, data }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(sheetData),
      `${name} Dist`
    );
  });

  XLSX.writeFile(wb, `Product-${productId}.xlsx`);
}

// --- Updated: Export ALL BestBuy Products to Excel with ID relationships ---
export function exportBestBuyToExcel() {
  const { BestBuy } = getConversation();

  if (!BestBuy || BestBuy.length === 0) {
    alert("No BestBuy data found.");
    return;
  }

  const products = [];
  const reviews = [];
  const analysis = [];
  const insights = [];
  const distributions = [];

  const currentYear = new Date().getFullYear();

  BestBuy.forEach((entry) => {
    if (entry.role === "ai" && entry.response?.type === "product") {
      const product = entry.response;
      const productId = entry.id;

      products.push({
        product_id: productId,
        title: product.title,
        price: product.price,
        product_url: product.product_url,
        review_url: product.review_url,
        total_reviews: product.total_review,
      });

      (product.reviews || []).forEach((r, i) => {
        reviews.push({
          product_id: productId,
          reviewer: r.author,
          title: r.title,
          body: r.body,
          rating: r.rating,
          recommendation: r.recommendation ? "Yes" : "No",
          posted_month: r.review_info?.posted?.label
            ? `${r.review_info.posted.label} ${currentYear}`
            : "Unknown",
          usage_duration: r.review_info?.used_duration?.duration || "Unknown",
          index: i + 1,
        });
      });

      const { sentiment_summary, top_pros, top_cons, word_cloud_data } =
        product.analysis || {};

      (top_pros || []).forEach(([phrase, count]) => {
        analysis.push({
          product_id: productId,
          type: "Top Pro",
          phrase,
          count,
        });
      });
      (top_cons || []).forEach(([phrase, count]) => {
        analysis.push({
          product_id: productId,
          type: "Top Con",
          phrase,
          count,
        });
      });
      (word_cloud_data || []).forEach(([phrase, count]) => {
        analysis.push({ product_id: productId, type: "Word", phrase, count });
      });

      if (sentiment_summary) {
        Object.entries(sentiment_summary).forEach(([sentiment, count]) => {
          analysis.push({
            product_id: productId,
            type: "Sentiment",
            phrase: sentiment,
            count,
          });
        });
      }

      const insightSets = [
        { list: product.analysis?.duration_insights, type: "Duration" },
        { list: product.analysis?.rating_insights, type: "Rating" },
        { list: product.analysis?.trend_insights, type: "Trend" },
      ];
      insightSets.forEach(({ list, type }) => {
        (list || []).forEach(({ message, sentiment }) => {
          insights.push({ product_id: productId, type, message, sentiment });
        });
      });

      const distSets = [
        { name: "Duration", list: product.analysis?.duration_distribution },
        { name: "Rating", list: product.analysis?.rating_distribution },
        { name: "Trend", list: product.analysis?.trend_distribution },
      ];
      distSets.forEach(({ name, list }) => {
        (list || []).forEach(({ key, data }) => {
          distributions.push({ product_id: productId, type: name, key, data });
        });
      });
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(products),
    "Products"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(reviews),
    "Reviews"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(analysis),
    "Analysis"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(insights),
    "Insights"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(distributions),
    "Distributions"
  );

  XLSX.writeFile(wb, "BestBuyData.xlsx");
}

export const conversationToPPT = async (productData) => {
  try {
    const response = await fetch(import.meta.env.VITE_BEST_BUY_PPT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Ambil file blob (PPT)
    const blob = await response.blob();

    // Buat file download otomatis
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SentiviewProduct.pptx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log("✅ PPT berhasil diunduh.");
  } catch (error) {
    console.error("❌ Error converting to PPT:", error);
    return { error: error.message };
  }
};
