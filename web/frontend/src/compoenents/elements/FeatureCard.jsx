import React from "react";

function FeatureCard({
  icon,
  title,
  description,
  iconBg,
  classCard,
  dark = false,
}) {
  return (
    <div className={`${classCard && classCard} p-6 rounded-lg`}>
      {icon && iconBg && (
        <div
          className={`h-10 w-10 ${iconBg} rounded-md flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
      )}
      <h3
        className={`text-lg text-left font-semibold text-[#030521] ${
          dark && "text-white"
        } `}
      >
        {title}
      </h3>
      <p
        className={`mt-2 text-left text-[#a2a1b7] ${dark && "text-[#a2a1b7] "}`}
      >
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
