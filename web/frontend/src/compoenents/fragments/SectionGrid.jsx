import React from "react";
function SectionGrid({
  title,
  button,
  Component,
  dark,
  addOnBottom,
  titleLeft,
}) {
  return (
    <section
      className={`py-16 px-4 md:px-8 lg:px-16 ${
        dark ? "bg-[#030521] text-white" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`${
            !titleLeft && "text-center"
          } text-3xl md:text-4xl font-bold leading-tight ${
            dark ? "text-white" : "text-[#030521]"
          }`}
        >
          {title}
        </h2>
        {Component}
        {button && <div className="mt-12">{button}</div>}
      </div>
      {addOnBottom && (
        <div className="mx-auto !w-full mt-16">{addOnBottom}</div>
      )}
    </section>
  );
}

export default SectionGrid;
