import React from "react";

function LogoGrid({ logos, gridCols, hoverEffect }) {
  return (
    <div
      className={`mt-12 grid ${gridCols} gap-8 items-center justify-items-center`}
    >
      {logos.map(({ idx, src, alt, width, height }) => (
        <div
          key={idx}
          className={
            hoverEffect
              ? "grayscale hover:grayscale-0 transition-all"
              : undefined
          }
        >
          <img src={src} alt={alt} width={width} height={height} />
        </div>
      ))}
    </div>
  );
}

export default LogoGrid;
