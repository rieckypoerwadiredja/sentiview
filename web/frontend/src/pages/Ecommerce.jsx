import React, { useState } from "react";

function Ecommerce() {
  const [url, setUrl] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert("Please enter a URL!");
      return;
    }

    const link = url + "&intl=nosplash";
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:5000/analyze-bestbuy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const data = await response.json();
      setResponseData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponseData(null);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h1>Ecommerce Product Scraper</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Product URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter product URL"
            style={{ width: "300px", padding: "10px", marginBottom: "10px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "10px 15px" }}
        >
          {isLoading ? "Loading..." : "Scrape Product"}
        </button>
      </form>

      {isLoading && <p style={{ color: "blue" }}>Loading...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {responseData && (
        <div>
          <h2>Product Details</h2>
          <p>
            <strong>Title:</strong> {responseData.product_details.title}
          </p>
          <p>
            <strong>Price:</strong> {responseData.product_details.price}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {responseData.product_details.description}
          </p>
          <div>
            <strong>Images:</strong>
            <ul>
              {responseData.product_details.images.map((image, index) => (
                <li key={index}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    width="100"
                  />
                </li>
              ))}
            </ul>
          </div>

          <h3>Reviews</h3>
          {responseData.reviews.length > 0 ? (
            responseData.reviews.map((review, index) => (
              <div key={index}>
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
                  <strong>Sentiemnt:</strong> {review.sentiment}
                </p>
                <hr />
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Ecommerce;
