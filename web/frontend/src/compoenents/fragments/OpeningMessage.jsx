import { ArrowRight } from "lucide-react";
import React from "react";

export function GeneralOpening() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        <span className="text-[#3a30ba]">💬 Sentiview AI Chat</span> – Smart
        Assistant for Product Insight
      </h1>

      <p className="mb-4 text-gray-700">
        Sentiview AI Chat is an intelligent assistant designed to help business
        owners instantly uncover how their products are perceived on e-commerce
        platforms—without reading hundreds of reviews manually. Simply send a
        link to your product's e-commerce page, and our AI will analyze customer
        comments using advanced sentiment analysis, delivering clear, actionable
        insights.
      </p>

      <p className="text-[#3a30ba] font-semibold">
        🔍 What Sentiview Chat Can Do:
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Analyze Real Reviews, Not Just Ratings :{" "}
            </span>
            <span className="text-gray-700">
              Get a quick overview of positive, negative, and neutral
              feedback—mapped clearly and structured in seconds.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Highlight Product Strengths & Weaknesses :{" "}
            </span>
            <span className="text-gray-700">
              Find out what aspects are loved (e.g. “durable,” “affordable,”
              “cute packaging”) and what needs fixing (e.g. “leaks easily,” “not
              fresh”).
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Compare with Competitors :{" "}
            </span>
            <span className="text-gray-700">
              Curious how your product stacks up? Sentiview can analyze
              competitor product reviews too—helping you see where you stand.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Spot Trends & Preferences :{" "}
            </span>
            <span className="text-gray-700">
              Discover rising keywords or repeated themes like “low sugar,”
              “eco-friendly,” or “quick to prepare”—valuable signals for product
              development or marketing.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
