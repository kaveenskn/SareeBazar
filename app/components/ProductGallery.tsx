"use client";

import { useState, useCallback } from "react";
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
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const [activeColor, setActiveColor] = useState<string | null>(
    colorVariants && colorVariants.length > 0 ? colorVariants[0].name : null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);

  const handleColorClick = useCallback(
    (variant: ColorVariant) => {
      if (variant.name === activeColor) return;

      // Set up crossfade: keep previous image visible behind new one
      setPrevImage(activeImage);
      setIsTransitioning(true);
      setActiveColor(variant.name);
      setActiveImage(variant.image);

      // Clean up transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevImage(null);
      }, 600);
    },
    [activeColor, activeImage]
  );

  return (
    <div className="w-full lg:w-[60%] flex flex-col gap-5">
      {/* ── Two-Card Grid: Video + Image ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Video Card */}
        {video && (
          <div className="relative aspect-[3/4] bg-[#f5f5f6] rounded-[12px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300">
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

        {/* Image Card with Crossfade */}
        <div className="relative aspect-[3/4] bg-[#f5f5f6] rounded-[12px] overflow-hidden group cursor-zoom-in shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Previous image (fades out) */}
          {prevImage && isTransitioning && (
            <Image
              src={prevImage}
              alt={`${productName} - Previous`}
              fill
              quality={100}
              unoptimized={true}
              className="object-cover absolute inset-0 z-10 animate-[fadeOut_0.6s_ease-in-out_forwards]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Active image (fades in) */}
          <Image
            src={activeImage}
            alt={`${productName} - ${activeColor || "View"}`}
            fill
            quality={100}
            unoptimized={true}
            className={`
              object-cover transition-transform duration-500 group-hover:scale-105
              ${isTransitioning ? "animate-[fadeInScale_0.6s_ease-out_forwards]" : ""}
            `}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Active color label overlay */}
          {activeColor && (
            <div
              className={`
                absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#282c3f] text-[12px]
                font-semibold px-3 py-1.5 rounded-full shadow-sm
                ${isTransitioning ? "animate-[slideUp_0.4s_ease-out_0.2s_both]" : ""}
              `}
            >
              {activeColor}
            </div>
          )}
        </div>
      </div>

      {/* ── Color Selector Section ── */}
      {colorVariants && colorVariants.length > 0 && (
        <div className="bg-[#fafafa] rounded-[14px] p-5 border border-[#eaeaec]">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wider">
              Select Colour
            </h4>
            {activeColor && (
              <span className="text-[13px] text-[#535766] font-medium">
                {activeColor}
              </span>
            )}
          </div>

          {/* Swatches row */}
          <div className="flex items-center gap-4">
            {colorVariants.map((variant, idx) => {
              const isActive = activeColor === variant.name;
              return (
                <button
                  key={variant.name}
                  onClick={() => handleColorClick(variant)}
                  className="group/swatch relative flex flex-col items-center gap-2 focus:outline-none"
                  title={variant.name}
                  style={{
                    animationDelay: `${idx * 80}ms`,
                  }}
                >
                  {/* Outer ring container */}
                  <div
                    className={`
                      relative w-[46px] h-[46px] rounded-full flex items-center justify-center
                      transition-all duration-300 ease-out
                      ${isActive
                        ? "bg-gradient-to-br from-[#ff3f6c] to-[#ff6b8a] p-[3px] shadow-[0_0_12px_rgba(255,63,108,0.35)] scale-110"
                        : "bg-transparent p-[3px] hover:scale-110"
                      }
                    `}
                  >
                    {/* Inner swatch */}
                    <div
                      className={`
                        w-full h-full rounded-full transition-all duration-300
                        ${isActive
                          ? "ring-2 ring-white"
                          : "ring-1 ring-[#d4d5d9] group-hover/swatch:ring-2 group-hover/swatch:ring-[#535766]"
                        }
                      `}
                      style={{ backgroundColor: variant.hex }}
                    />

                    {/* Checkmark for active */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center animate-[popIn_0.3s_ease-out]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Color name label */}
                  <span
                    className={`
                      text-[11px] leading-tight text-center max-w-[56px] transition-all duration-300
                      ${isActive
                        ? "text-[#ff3f6c] font-bold translate-y-0"
                        : "text-[#94969f] font-medium group-hover/swatch:text-[#282c3f]"
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

      {/* Inline animation keyframes */}
      <style jsx>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.03);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.97);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          60% {
            opacity: 1;
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
