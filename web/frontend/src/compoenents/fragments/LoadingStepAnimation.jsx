import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import scanningAimation from "../../assets/animation/scanning.lottie";
import analyzingAnimation from "../../assets/animation/analyzing.lottie";

//  <LoadingStepAnimation
//             step={["Get Product Info", "Get Review", "Get Dashboard & Analyze"]}
//             activeStep={1} // if 1, "Get Product Info" is done
//           />
function LoadingStepAnimation({ step = [], activeStep = 0 }) {
  const animations = [
    { text: "Scanning", anim: scanningAimation },
    { text: "Analyzing", anim: analyzingAnimation },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[500px] w-full flex flex-col items-center justify-center">
      {/* Animation */}
      <div className="w-64 h-64 flex items-center justify-center">
        <DotLottieReact src={animations[currentIndex].anim} autoplay />
      </div>

      {/* Loading text */}
      <p className="text-lg text-center -mt-12 text-gray-400 font-semibold flex items-center gap-1">
        {animations[currentIndex].text}
        <span className="dot-pulse ml-1">
          <span>.</span> <span>.</span> <span>.</span>
        </span>
      </p>

      {/* Steps */}
      <ol className="flex w-full max-w-md items-center justify-between mt-6 relative">
        {step.map((label, index) => (
          <li
            key={index}
            className="relative flex-1 flex flex-col items-center text-center"
          >
            {/* Progress Line */}
            {index !== 0 && (
              <div
                className={`absolute top-5 left-[-50%] w-full h-1 z-0 ${
                  index <= activeStep
                    ? "bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}

            {/* Step Bubble */}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full lg:w-12 lg:h-12 font-semibold ${
                index < activeStep
                  ? "bg-green-500 text-white"
                  : index === activeStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {index < activeStep ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Label */}
            <div
              className={`mt-2 text-sm w-24 text-center break-words min-h-[2.5rem] ${
                index === activeStep
                  ? "text-gray-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {label}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default LoadingStepAnimation;
