import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state
  const [error, setError] = useState(""); // <-- error state

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Mulai loading
    setError(""); // Reset error
    setSentiment(""); // Reset hasil sebelumnya

    try {
      const response = await axios.post("http://localhost:5000/predict", {
        text: inputText,
      });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error("There was an error making the request:", error);
      setError("Gagal memproses data. Pastikan server berjalan dan coba lagi.");
    } finally {
      setLoading(false); // Hentikan loading
    }
  };

  return (
    <div className="App">
      <h1>Sentiment Analysis</h1>

      <textarea
        placeholder="Type your review here..."
        value={inputText}
        onChange={handleTextChange}
        rows="4"
        cols="50"
      />
      <br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Analyze Sentiment"}
      </button>

      {/* Tampilkan error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tampilkan hasil jika ada */}
      {sentiment && <h2>Sentiment: {sentiment}</h2>}
    </div>
  );
}

export default App;
