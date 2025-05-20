import React from "react";
import { Link } from "react-router-dom";

function SupportCard({ title, description, buttonText }) {
  return (
    <div className="border border-[#d1d0db] rounded-lg p-6 text-left">
      <h3 className="text-lg font-semibold mb-4 text-[#030521]">{title}</h3>
      <p className="text-[#45426e] text-sm mb-6">{description}</p>
      <Link href="#" className="text-[#3a30ba] font-medium text-sm">
        {buttonText}
      </Link>
    </div>
  );
}

export default SupportCard;
