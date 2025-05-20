import React from "react";
import { Check } from "lucide-react";
import FlexHorizontal from "../elements/FlexHorizontal";
import { featuredOn } from "../../data/data";

function Hero() {
  return (
    <section className="py-16 text-center bg-[#FFF9F3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-[#030521]">
          Build Analysis with <br /> the Power of AI
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          It takes seconds to uncover deep product insights with
          Sentiview—AI-powered sentiment analysis for smarter business
          decisions.
        </p>

        {/* Features */}
        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
              <Check className="h-3 w-3 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm text-gray-700">
              Auto Sentiment Detection
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
              <Check className="h-3 w-3 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm text-gray-700">
              Competitor Review Comparison
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
              <Check className="h-3 w-3 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm text-gray-700">
              Keyword & Emotion Highlights
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
              <Check className="h-3 w-3 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm text-gray-700">
              Export to dashboard for analysis
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
              <Check className="h-3 w-3 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm text-gray-700">
              Visual Dashboard Insights
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative mt-10">
          <div className="absolute left-0 top-1/2 h-8 w-24 -translate-y-1/2 transform">
            <svg viewBox="0 0 100 30" className="h-full w-full">
              <path
                d="M0,15 Q30,5 60,20 T100,15"
                fill="none"
                stroke="#FFCC85"
                strokeWidth="4"
              />
            </svg>
          </div>
          <button className="relative rounded-md bg-[#3a30ba] px-6 py-3 text-white">
            Try Live Demo &gt;
          </button>
        </div>
      </div>
      <div className="pt-18 bg-[#FFF9F3]">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            <p className="text-sm text-gray-500">Featured on:</p>
            <FlexHorizontal data={featuredOn} />
          </div>
        </div>
        <img className="mx-auto mt-8" src="/logo/award.png" alt="" />
      </div>
    </section>
  );
}

export default Hero;
