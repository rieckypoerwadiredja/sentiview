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
          text: "Customers mostly say the battery lasts 8 hours.",
        },
      ],
      Youtube: [
        {
          id: "12332122",
          role: "user",
          text: "What do people say about the video quality?",
        },
        {
          id: "12344321",
          role: "ai",
          text: "Mostly positive, many praise the HD clarity.",
        },
      ],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  return JSON.parse(data);
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
export const addAiMessage = (platform, id, text) => {
  const data = getConversation();
  if (!data[platform]) data[platform] = [];

  data[platform].push({ id: id, role: "ai", text });
  setConversation(data);
};

export const deleteAllConversation = () => {
  if (window.confirm("Are you sure you want to clear all conversations?")) {
    localStorage.removeItem("conversationContents");
    window.location.reload();
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
