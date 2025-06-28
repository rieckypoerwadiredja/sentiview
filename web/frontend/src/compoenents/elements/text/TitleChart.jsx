import React from "react";

function TitleChart({ children }) {
  return (
    <h3 className="text-lg lg:text-xl text-left pb-4 font-bold flex items-center">
      {children}
    </h3>
  );
}

export default TitleChart;
