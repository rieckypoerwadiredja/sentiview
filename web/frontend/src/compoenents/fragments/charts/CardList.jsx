import React from "react";
import TitleChart from "../../elements/text/TitleChart";

function CardList({ title, children }) {
  return (
    <div className="p-2 rounded">
      <TitleChart>{title}</TitleChart>
      {children}
    </div>
  );
}

export default CardList;
