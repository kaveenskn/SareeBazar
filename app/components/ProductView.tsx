"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Star, Bot, Truck, Tag } from "lucide-react";
import type { Product, ColorVariant } from "@/mockdata/collections";

interface ProductViewProps {
  product: Product;
  gallery: string[];
  video?: string;
  discountPercent: number;
}

export default function ProductView({
  product,
  gallery,
  video,
  discountPercent,
}: ProductViewProps) {
  const colorVariants = product.colorVariants;
  const [activeImage, setActiveImage] = useState(gallery[0] || "");
  const [activeColor, setActiveColor] = useState<string | null>(
    colorVariants && colorVariants.length > 0 ? colorVariants[0].name : null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);

  const handleColorClick = useCallback(
    (variant: ColorVariant) => {
      if (variant.name === activeColor) return;
      setPrevImage(activeImage);
      setIsTransitioning(true);
      setActiveColor(variant.name);
      setActiveImage(variant.image);
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevImage(null);
      }, 500);
    },
    [activeColor, activeImage]
  );

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8">

        {/* ─── LEFT SIDE: Video + Image Cards ─── */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
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
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Video
                </div>
              </div>
            )}

            {/* Image Card with Crossfade */}
            <div className="relative aspect-[3/4] bg-[#f5f5f6] rounded-[12px] overflow-hidden group cursor-zoom-in shadow-sm hover:shadow-md transition-shadow duration-300">
              {prevImage && isTransitioning && (
                <Image
                  src={prevImage}
                  alt={`${product.name} - Previous`}
                  fill
                  quality={100}
                  unoptimized={true}
                  className="object-cover absolute inset-0 z-10"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ animation: "galleryFadeOut 0.5s ease-in-out forwards" }}
                />
              )}
              <Image
                src={activeImage}
                alt={`${product.name} - ${activeColor || "View"}`}
                fill
                quality={100}
                unoptimized={true}
                className={`object-cover transition-transform duration-500 group-hover:scale-105`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={isTransitioning ? { animation: "galleryFadeIn 0.5s ease-out forwards" } : {}}
              />
              {activeColor && (
                <div
                  className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#282c3f] text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm"
                  style={isTransitioning ? { animation: "gallerySlideUp 0.4s ease-out 0.15s both" } : {}}
                >
                  {activeColor}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT SIDE: Product Details (Sticky) ─── */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-[100px] flex flex-col">

            {/* Brand & Name */}
            <h1 className="text-[24px] font-bold text-[#282c3f] leading-tight">
              {product.name}
            </h1>
            <p className="text-[20px] text-[#535766] font-normal mt-1 leading-snug">
              {product.category}
            </p>

            {/* Rating Box */}
            <div className="mt-4 inline-flex items-center gap-2 border border-[#eaeaec] rounded-[2px] px-2 py-1 cursor-pointer hover:border-[#282c3f] transition-colors w-max">
              <span className="text-[14px] font-bold text-[#282c3f] flex items-center gap-1">
                {product.rating} <Star size={14} className="fill-[#14958f] text-[#14958f]" />
              </span>
              <span className="w-[1px] h-3 bg-[#d4d5d9]"></span>
              <span className="text-[14px] text-[#535766]">{product.reviews} Ratings</span>
            </div>

            <hr className="my-4 border-[#eaeaec]" />

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-[24px] font-bold text-[#282c3f]">
                Rs. {product.price.toLocaleString("en-LK")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[20px] text-[#7e818c] line-through font-normal">
                    Rs. {product.originalPrice.toLocaleString("en-LK")}
                  </span>
                  <span className="text-[20px] font-bold text-[#ff905a]">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[14px] text-[#03a685] font-bold mt-1">inclusive of all taxes</p>

            {/* ─── COLOR SELECTOR (below price) ─── */}
            {colorVariants && colorVariants.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[15px] text-[#535766]">
                    Color: <span className="text-[#282c3f] font-medium ml-1">{activeColor}</span>
                  </div>
                  <span className="text-[#94969f] text-[12px] font-bold tracking-widest">
                    &gt;&gt;&gt;
                  </span>
                </div>

                <div className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {colorVariants.map((variant) => {
                    const isActive = activeColor === variant.name;
                    return (
                      <button
                        key={variant.name}
                        onClick={() => handleColorClick(variant)}
                        className={`
                          group/swatch relative flex-shrink-0 focus:outline-none rounded-[14px] p-[3px] transition-all duration-300 ease-out
                          ${isActive 
                            ? "shadow-sm active-swatch" 
                            : "border border-transparent hover:border-[#d4d5d9]"}
                        `}
                        style={
                          isActive 
                            ? { boxShadow: `0 0 0 2px ${variant.hex}, 0 0 12px ${variant.hex}60` } 
                            : {}
                        }
                        title={variant.name}
                      >
                        <div className="relative w-[65px] h-[85px] rounded-[10px] overflow-hidden bg-[#f5f5f6]">
                          <Image
                            src={variant.image}
                            alt={variant.name}
                            fill
                            className={`object-cover transition-transform duration-500 ${isActive ? "" : "group-hover/swatch:scale-105"}`}
                            sizes="65px"
                            unoptimized
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Virtual Try-On Highlight */}
            <div className="mt-5 p-4 rounded-[8px] bg-gradient-to-r from-[#7c3aed]/10 to-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#282c3f]">See it on yourself!</h4>
                  <p className="text-[12px] text-[#535766]">Use our AI Virtual Try-On feature.</p>
                </div>
              </div>
              <Link href={`/virtual-tryon?saree=${encodeURIComponent(gallery[0])}`}>
                <button className="px-4 py-2 bg-[#282c3f] text-white text-[12px] font-bold uppercase rounded-[4px] hover:bg-black transition-colors">
                  Try Now
                </button>
              </Link>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <button className="flex-1 h-14 bg-[#ff3f6c] text-white rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:bg-[#ed315d] transition-colors">
                <ShoppingBag size={20} /> Add to Bag
              </button>
              <button className="flex-1 h-14 bg-white border border-[#d4d5d9] text-[#282c3f] rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 hover:border-[#282c3f] transition-colors">
                <Heart size={20} /> Wishlist
              </button>
            </div>

            {/* Delivery Options */}
            <div className="mt-8">
              <h4 className="text-[16px] font-bold text-[#282c3f] flex items-center gap-2 uppercase">
                Delivery Options <Truck size={18} />
              </h4>
              <div className="mt-4 relative max-w-[300px]">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full p-3 pr-20 border border-[#d4d5d9] rounded-[4px] text-[14px] focus:outline-none focus:border-[#282c3f]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#ff3f6c]">Check</button>
              </div>
              <p className="text-[13px] text-[#535766] mt-2">
                Please enter PIN code to check delivery time &amp; Pay on Delivery Availability
              </p>

              <ul className="mt-5 space-y-3 text-[14px] text-[#535766]">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  100% Original Products
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Pay on delivery might be available
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Easy 14 days returns and exchanges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Try &amp; Buy might be available
                </li>
              </ul>
            </div>

            {/* Best Offers */}
            <div className="mt-8 pt-6 border-t border-[#eaeaec]">
              <h4 className="text-[16px] font-bold text-[#282c3f] flex items-center gap-2 uppercase mb-4">
                Best Offers <Tag size={18} />
              </h4>
              <div className="text-[14px] text-[#282c3f]">
                <p className="font-bold">Applicable on: Orders above Rs. 1499</p>
                <p className="text-[#535766] mt-1">Coupon code: <span className="font-bold text-[#282c3f]">SAREE100</span></p>
                <p className="text-[#535766]">Coupon Discount: Rs. 100 off (check cart for final savings)</p>
              </div>
            </div>

            <hr className="my-6 border-[#eaeaec]" />

            {/* Product Details */}
            <div>
              <h4 className="text-[16px] font-bold text-[#282c3f] uppercase mb-4">Product Details</h4>
              <p className="text-[14px] text-[#535766] leading-relaxed">
                {product.description}
              </p>

              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">Size &amp; Fit</h5>
              <p className="text-[14px] text-[#535766]">Saree Length: 5.5 Metres</p>
              <p className="text-[14px] text-[#535766]">Blouse Piece: 0.8 Metres</p>

              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">Material &amp; Care</h5>
              <p className="text-[14px] text-[#535766]">Fabric: {product.fabric || "Silk blend"}</p>
              <p className="text-[14px] text-[#535766]">Dry Clean only</p>
            </div>

          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes galleryFadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.02); }
        }
        @keyframes galleryFadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes gallerySlideUp {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
