import React, { useState } from "react";

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    <>
      <img
        src={images[currentIndex]}
        alt="slider"
        className="w-full object-contain rounded"
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-between gap-2 mt-2">
        <button
          onClick={prevSlide}
          className="text-xs bg-gray-300 px-2 py-1 rounded"
        >
          Prev
        </button>
        <button
          onClick={nextSlide}
          className="text-xs bg-gray-300 px-2 py-1 rounded"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default ImageSlider;
