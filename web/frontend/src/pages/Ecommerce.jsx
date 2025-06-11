import React, { useState } from "react";

const BestBuyScraper = () => {
  const [url, setUrl] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("Please enter a valid URL.");
      return;
    }

    const formattedUrl = url + "&intl=nosplash";
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-bestbuy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const data = await response.json();
      setResponseData(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>BestBuy Scraper</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter BestBuy product URL"
          style={{ width: "100%", padding: "10px" }}
        />
        <button type="submit" style={{ marginTop: "10px" }}>
          {isLoading ? "Loading..." : "Scrape"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <div>
          <h3>Product Details</h3>
          <p>
            <strong>Title:</strong> {responseData.title}
          </p>
          <p>
            <strong>Price:</strong> {responseData.price}
          </p>
          <p>
            <strong>Description:</strong> {responseData.description}
          </p>
          <p>
            <strong>Total Reviews:</strong> {responseData.totalReviews}
          </p>

          {responseData.images?.length > 0 && (
            <>
              <h4>Images:</h4>
              <ul style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {responseData.images.map((img, index) => (
                  <li key={index}>
                    <img src={img} alt={`Product ${index + 1}`} width="100" />
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3>Reviews</h3>
          {responseData.reviews?.length > 0 ? (
            responseData.reviews.map((review, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>
                  <strong>Title:</strong> {review.review_title}
                </p>
                <p>
                  <strong>Content:</strong> {review.review_content}
                </p>
                <p>
                  <strong>Recommended:</strong>{" "}
                  {review.recommended === "true" ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Sentiment:</strong> {review.sentiment}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BestBuyScraper;
