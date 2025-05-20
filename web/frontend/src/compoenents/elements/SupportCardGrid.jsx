import React from "react";
import SupportCard from "./SupportCard";

function SupportCardGrid({ cards, gridCols }) {
  return (
    <div
      className={`mt-12 grid ${gridCols} gap-8 items-center justify-items-center`}
    >
      {cards.map(({ title, description, buttonText }) => (
        <SupportCard
          title={title}
          description={description}
          buttonText={buttonText}
        />
      ))}
    </div>
  );
}

export default SupportCardGrid;
