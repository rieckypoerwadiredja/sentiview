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

export function BestbuyOpening() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">
        <span className="text-[#3a30ba]">💬 Sentiview AI Chat</span> – Review
        Analyzer for BestBuy Products
      </h1>

      <p className="mb-4 text-gray-700">
        Welcome to the dedicated chat room for analyzing customer reviews from{" "}
        <span className="font-semibold text-[#3a30ba]">BestBuy.com</span>. Just
        paste any BestBuy product link, and Sentiview will automatically fetch
        the reviews, analyze sentiments, and generate a full dashboard of
        product insights.
      </p>

      <p className="mb-4 text-gray-700">
        ⏳ Processing takes approximately{" "}
        <strong>10 minutes per 1000 reviews</strong>, depending on the total
        volume.
      </p>

      <p className="mb-4 text-gray-700">
        ✅ Try it now with a sample link:
        <br />
        <a
          href="https://www.bestbuy.com/site/hp-14-chromebook-intel-celeron-4gb-memory-64gb-emmc-modern-grey/6612977.p?skuId=6612977"
          className="text-[#3a30ba] underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bestbuy.com/site/hp-14-chromebook-intel-celeron-4gb-memory-64gb-emmc-modern-grey/6612977.p?skuId=6612977
        </a>
      </p>

      <p className="text-[#3a30ba] font-semibold">
        🚀 What You’ll Get Instantly:
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Instant Review Analysis :{" "}
            </span>
            <span className="text-gray-700">
              Sentiment breakdown (positive, neutral, negative), key highlights,
              and trend detection.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Ready-to-Use Dashboards :{" "}
            </span>
            <span className="text-gray-700">
              Automatically generated visuals—word clouds, top pros & cons, and
              more.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ArrowRight className="text-[#3a30ba] mt-1 flex-shrink-0" size={18} />
          <div>
            <span className="text-[#3a30ba] font-medium">
              Export to Excel, PPT, or PNG :{" "}
            </span>
            <span className="text-gray-700">
              Download your insights in multiple formats to present or share
              with your team instantly.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
