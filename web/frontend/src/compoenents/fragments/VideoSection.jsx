import React from "react";
import { Play } from "lucide-react";

function VideoSection() {
  return (
    <section className="py-10 bg-[#FFF9F3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#3a30ba] p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute left-8 top-8 grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-white opacity-70"
              ></div>
            ))}
          </div>
          <div className="absolute bottom-16 left-16 flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-70"></div>
          </div>
          <div className="absolute right-12 top-12">
            <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
          <div className="absolute right-24 top-24 flex space-x-2">
            <div className="h-6 w-6 rotate-45 transform bg-yellow-300"></div>
            <div className="h-4 w-4 rotate-12 transform border-2 border-white"></div>
          </div>
          <div className="absolute bottom-24 right-24 flex space-x-2">
            <div className="h-4 w-4 rotate-45 transform bg-white opacity-70"></div>
          </div>

          {/* Squiggly lines */}
          <div className="absolute -right-4 top-0 h-full w-16">
            <svg viewBox="0 0 50 300" className="h-full w-full">
              <path
                d="M40,0 Q60,50 40,100 Q20,150 40,200 Q60,250 40,300"
                fill="none"
                stroke="#8c3bfc"
                strokeWidth="3"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-medium text-[#ffcc85]">Introducing</h2>
          <h1 className="mt-4 text-6xl font-bold text-white">Sentiview AI</h1>
          <p className="mt-4 text-2xl font-medium text-[#ffcc85]">
            The Future of Business <br /> is Here
          </p>

          {/* Play button */}
          <div className="mx-auto mt-8 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white">
            <Play className="h-6 w-6 text-[#3a30ba]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
