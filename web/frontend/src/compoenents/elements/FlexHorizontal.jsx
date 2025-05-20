import React from "react";

function FlexHorizontal({ data }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {data.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className={item.className}
        />
      ))}
    </div>
  );
}

export default FlexHorizontal;
