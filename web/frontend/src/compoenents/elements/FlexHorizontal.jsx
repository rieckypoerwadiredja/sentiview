import React from "react";

function FlexHorizontal({ data }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {data.map((item, index) => {
        const isSoon = item.status === "soon";
        return (
          <div
            key={index}
            className="relative flex flex-col items-center w-[120px]"
          >
            <div className="relative min-h-[80px] flex items-center justify-center">
              {/* Overlay transparan ringan */}
              {isSoon && (
                <div className="absolute inset-0 bg-white/10 z-10 rounded" />
              )}

              {/* Gambar */}
              <img
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className={`${item.className || ""} ${
                  isSoon ? "grayscale" : ""
                } transition duration-300`}
              />
            </div>

            {/* Tulisan SOON di bawah logo */}

            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 mt-2 text-sm font-bold text-gray-600 bg-gray-200/50 -mt-20 px-2 py-0.5 rounded shadow-sm">
              {isSoon && "SOON"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default FlexHorizontal;
