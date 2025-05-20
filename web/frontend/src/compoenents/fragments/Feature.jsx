import React from "react";
import FeatureCard from "../elements/FeatureCard";

function Feature({ title, desc, feature = [] }) {
  return (
    <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#030521]">
          {title}
        </h2>
        <p className="text-[#45426e] mb-16">{desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feature.map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.element}
              title={item.title}
              description={item.description}
              iconBg={item.iconBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feature;
