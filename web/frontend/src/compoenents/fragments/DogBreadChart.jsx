import React from "react";

import { useEffect, useRef } from "react";

const dogBreeds = [
  { name: "Border Collie", color: "#16dbcc", time: 30 },
  { name: "Pug", color: "#ffd482", time: 20 },
  { name: "French Bulldog", color: "#fff282", time: 25 },
  { name: "Beagle", color: "#82bbff", time: 22 },
  { name: "Bulldog", color: "#aa82ff", time: 18 },
  { name: "Dachshund", color: "#f582ff", time: 35 },
  { name: "Labrador Retriever", color: "#ff8291", time: 40 },
  { name: "German Shepherd", color: "#9bff82", time: 45 },
  { name: "Chihuahua", color: "#1cfff1", time: 15 },
];

export function DogBreedChart() {
  const canvasRef = useRef < HTMLCanvasElement > null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;
    const barWidth = chartWidth / dogBreeds.length / 1.5;
    const barSpacing =
      (chartWidth - barWidth * dogBreeds.length) / (dogBreeds.length - 1);
    const maxTime = 50; // Maximum time in minutes

    // Draw y-axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "right";

    const timeIntervals = [0, 10, 20, 30, 40, 50];
    timeIntervals.forEach((time) => {
      const y = 30 + chartHeight - (time / maxTime) * chartHeight;
      ctx.fillText(`${time}`, 30, y + 4);
    });

    // Draw x-axis label
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "left";
    ctx.fillText("Time", 10, 15);

    // Draw bars
    dogBreeds.forEach((breed, index) => {
      const x = 40 + index * (barWidth + barSpacing);
      const barHeight = (breed.time / maxTime) * chartHeight;
      const y = 30 + chartHeight - barHeight;

      // Draw rounded rectangle
      const radius = barWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barHeight - radius);
      ctx.quadraticCurveTo(
        x + barWidth,
        y + barHeight,
        x + barWidth - radius,
        y + barHeight
      );
      ctx.lineTo(x + radius, y + barHeight);
      ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.fillStyle = breed.color;
      ctx.fill();
    });
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="h-[300px] relative">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {dogBreeds.map((breed) => (
            <div key={breed.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: breed.color }}
              ></div>
              <span className="text-sm text-gray-600">{breed.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
