"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColorVariant } from "@/mockdata/collections";

interface ProductGalleryProps {
  video?: string;
  images: string[];
  colorVariants?: ColorVariant[];
  productName: string;
}

export default function ProductGallery({
  video,
  images,
  colorVariants,
  productName,
}: ProductGalleryProps) {
  // Default to the first image
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const [activeColor, setActiveColor] = useState<string | null>(
    colorVariants && colorVariants.length > 0 ? colorVariants[0].name : null
  );

  const handleColorClick = (variant: ColorVariant) => {
    setActiveColor(variant.name);
    setActiveImage(variant.image);
  };

  return (
    <div className="w-full lg:w-[60%] flex flex-col gap-4">
      {/* ── Two-Card Grid: Video + Image ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Video Card */}
        {video && (
          <div className="relative aspect-[3/4] bg-[#f5f5f6] rounded-[8px] overflow-hidden group cursor-pointer shadow-sm">
            <video
              src={video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Video badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Video
            </div>
          </div>
        )}

        {/* Image Card */}
        <div className="relative aspect-[3/4] bg-[#f5f5f6] rounded-[8px] overflow-hidden group cursor-zoom-in shadow-sm">
          <Image
            src={activeImage}
            alt={`${productName} - ${activeColor || "View"}`}
            fill
            quality={100}
            unoptimized={true}
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            key={activeImage} // force re-mount for crossfade
          />
        </div>
      </div>

      {/* ── Color Selector Section ── */}
      {colorVariants && colorVariants.length > 0 && (
        <div className="mt-2">
          <h4 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide mb-3">
            Select Colour
          </h4>
          <div className="flex items-center gap-3 flex-wrap">
            {colorVariants.map((variant) => {
              const isActive = activeColor === variant.name;
              return (
                <button
                  key={variant.name}
                  onClick={() => handleColorClick(variant)}
                  className="group/swatch flex flex-col items-center gap-1.5 transition-all duration-200"
                  title={variant.name}
                >
                  {/* Swatch circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full transition-all duration-300 ease-out
                      ${isActive
                        ? "ring-[3px] ring-offset-2 ring-[#ff3f6c] scale-110 shadow-lg"
                        : "ring-1 ring-[#d4d5d9] hover:ring-2 hover:ring-[#282c3f] hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: variant.hex }}
                  />
                  {/* Color name label */}
                  <span
                    className={`
                      text-[11px] transition-colors duration-200 max-w-[60px] text-center leading-tight
                      ${isActive
                        ? "text-[#ff3f6c] font-bold"
                        : "text-[#94969f] group-hover/swatch:text-[#282c3f]"
                      }
                    `}
                  >
                    {variant.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
