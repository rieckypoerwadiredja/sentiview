import React, { useState } from "react";
import PropTypes from "prop-types";
import { Send } from "lucide-react";
import {
  addAiMessage,
  addUserMessage,
  conversationBestBuyAnalyze,
  conversationBestBuyProductInfo,
  conversationBestBuyProductReview,
  conversationPredict,
  getConversationById,
  updateAiMessage,
} from "../../utils/convercation";

function InputAI({
  platform,
  statusUserSendMsg,
  statusAiSendMsg,
  loadingAiResponse,
  setLoadingId,
  loadingStep,
}) {
  const [userInput, setUserInput] = useState("");

  const onSubmit = async (e, text) => {
    e.preventDefault();
    addUserMessage(platform, text); // ? store user message to local storage
    setUserInput("");
    statusUserSendMsg(true);
    loadingAiResponse(true);

    try {
      const data =
        platform === "BestBuy"
          ? await conversationBestBuyProductInfo(text)
          : await conversationPredict(text);

      if (platform === "Sentiment")
        if (data && data.sentiment) {
          addAiMessage(platform, data.id, data.response);
        } else if (data && data.id) {
          addAiMessage(platform, data.id, data.error || "Terjadi kesalahan.");
        } else {
          addAiMessage(platform, "unknown", "Respons tidak valid.");
        }

      if (platform === "BestBuy")
        if (data && data.response && data.response.product_data) {
          const product = data.response.product_data;
          const title = product.title || "No title";
          const price = product.price || "No price";
          const product_url = product.product_url || "No product link";
          const review_url = product.review_url || "No review link";
          const images = product.images || "No images";

          const message = {
            type: "product",
            title: title,
            price: price,
            product_url: product_url,
            review_url: review_url,
            images: images,
          };
          setLoadingId(data.id);
          addAiMessage(platform, data.id, message);
          statusAiSendMsg(true); // ? true krn kirim messege title, price, image, link
          loadingStep(1);

          // TODO Scraping review
          try {
            console.log(product_url);
            const review_scrape_data = await conversationBestBuyProductReview(
              review_url
            );
            const total_review =
              review_scrape_data.total_reviews || "No total review";
            const reviews = review_scrape_data.reviews || "No reviews";

            const message = {
              total_review: total_review,
              reviews: reviews,
            };
            updateAiMessage(platform, data.id, message);

            loadingStep(2);

            // TODO Analyzed Product
            try {
              const dataById = getConversationById("BestBuy", data.id);
              // console.log(dataById);
              const analyze_scrape_data = await conversationBestBuyAnalyze(
                dataById
              );

              updateAiMessage(platform, data.id, {
                analysis: analyze_scrape_data.response.analysis,
              });
              loadingStep(3);
            } catch (error) {
              console.log("❌ conversationBestBuyProductAnalyze Error:", error);
            }
          } catch (error) {
            console.log("❌ conversationBestBuyProductReview Error:", error);
          } finally {
            loadingStep(0);
          }
        } else if (data && data.error) {
          addAiMessage(platform, data.id, data.error);
        } else {
          addAiMessage(platform, "unknown", "Respons tidak valid.");
        }

      statusAiSendMsg(true); // ? true krn kirim messege batch 2 total review + review
    } catch (err) {
      console.error("Error submit:", err);
      addAiMessage(platform, "unknown", "Gagal mengambil respons. Coba lagi.");
      statusAiSendMsg(true);
    }
    setLoadingId("");
    loadingAiResponse(false);
    statusUserSendMsg(false);
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="max-w-4xl mx-auto">
        <form className="relative" onSubmit={(e) => onSubmit(e, userInput)}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-[#ffcc85] flex items-center justify-center">
              <span className="text-xs">🐶</span>
            </div>
          </div>
          <textarea
            rows={1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="pl-12 pr-12 py-6 rounded-full w-full bg-white border border-gray-200"
            placeholder="What's in your mind?..."
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#3a30ba] hover:bg-[#4550e5] flex items-center justify-center p-0"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InputAI.propTypes = {};

export default InputAI;
