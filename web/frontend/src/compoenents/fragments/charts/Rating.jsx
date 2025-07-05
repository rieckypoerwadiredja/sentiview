import { Star, StarHalf } from "lucide-react";
import React from "react";

function Rating({ rating }) {
  const safeRating = Math.max(0, Math.min(Number(rating) || 0, 5)); // Default 0, max 5
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.3;

  return (
    <>
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} fill="#FACC15" className="text-yellow-500" />
        ))}
        {hasHalfStar && (
          <StarHalf key="half" fill="#FACC15" className="text-yellow-500" />
        )}
      </div>
      <dd className="text-gray-500">Average Rating</dd>
      <dt className="mb-2 text-3xl font-bold">{safeRating}/5</dt>
    </>
  );
}

export default Rating;
