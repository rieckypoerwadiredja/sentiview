import React from "react";
import FeatureCard from "./FeatureCard";

function FeatureCardGrid({ cards, gridCols }) {
  return (
    <div
      className={`mt-12 grid ${gridCols} gap-8 items-center justify-items-center`}
    >
      {cards.map(({ title, description, classCard, dark }) => (
        <FeatureCard
          title={title}
          description={description}
          classCard={classCard}
          dark={dark}
        />
      ))}
    </div>
  );
}

export default FeatureCardGrid;
