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

    if (!url.trim()) {
      alert("Please enter a valid URL.");
      return;
    }

    const formattedUrl = url + "&intl=nosplash";
    setIsLoading(true);

    try {
      // Fetch product details
      const detailsResponse = await fetch(
        "https://api-sentiview-scraper.vercel.app/scrape/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: formattedUrl }),
        }
      );

      if (!detailsResponse.ok) {
        throw new Error("Failed to fetch product details");
      }

      const productDetails = await detailsResponse.json();

      // Fetch reviews
      const reviewsResponse = await fetch(
        "https://api-sentiview-scraper.vercel.app/scrape/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: formattedUrl }),
        }
      );

      if (!reviewsResponse.ok) {
        throw new Error("Failed to fetch product reviews");
      }

      const reviews = await reviewsResponse.json();

      // Combine both into one object
      setResponseData({
        product_details: productDetails.product_details,
        reviews: reviews.reviews,
      });

      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>E-commerce Product Scraper</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Product URL:</label>
        <br />
        <input
          id="url"
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter product URL"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />
        <br />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Loading..." : "Scrape Product"}
        </button>
      </form>

      {isLoading && (
        <p style={{ color: "blue" }}>Fetching data, please wait...</p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {responseData && (
        <div style={{ marginTop: "30px" }}>
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
            <ul
              style={{
                display: "flex",
                gap: "10px",
                listStyle: "none",
                padding: 0,
              }}
            >
              {responseData.product_details.images.map((image, index) => (
                <li key={index}>
                  <img src={image} alt={`Product ${index + 1}`} width="100" />
                </li>
              ))}
            </ul>
          </div>

          <h3>Reviews</h3>
          {responseData.reviews.length > 0 ? (
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
}

export default Ecommerce;
