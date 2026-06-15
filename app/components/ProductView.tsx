"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Star,
  Bot,
  Check,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  PenLine,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Product, ColorVariant } from "@/mockdata/collections";
import { addToCart, setCheckoutItems } from "@/lib/cartStore";
import { isLoggedIn } from "@/lib/authStore";

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
  const router = useRouter();
  const salePrice = discountPercent > 0
    ? Math.round(product.price * (1 - discountPercent / 100) * 100) / 100
    : product.price;
  const colorVariants = product.colorVariants;
  const [activeImage, setActiveImage] = useState(gallery[0] || "");
  const [activeColor, setActiveColor] = useState<string | null>(
    colorVariants && colorVariants.length > 0 ? colorVariants[0].name : null,
  );
  const [activeColorHex, setActiveColorHex] = useState<string>(
    colorVariants && colorVariants.length > 0 ? colorVariants[0].hex : "#000",
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToBag, setAddedToBag] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);

  const handleColorClick = useCallback(
    (variant: ColorVariant) => {
      if (variant.name === activeColor) return;
      setPrevImage(activeImage);
      setIsTransitioning(true);
      setActiveColor(variant.name);
      setActiveColorHex(variant.hex);
      setActiveImage(variant.image);
      setAddedToBag(false);
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevImage(null);
      }, 500);
    },
    [activeColor, activeImage],
  );

  const buildVariant = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    selectedColor: activeColor || product.color || "Default",
    selectedColorHex: activeColorHex,
    selectedColorImage: activeImage,
    quantity,
    price: salePrice,
    originalPrice: discountPercent > 0 ? product.price : undefined,
    image: gallery[0],
    category: product.category,
    fabric: product.fabric,
  });

  const handleAddToBag = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to add items to cart", { icon: "🔒" });
      router.push("/login");
      return;
    }
    addToCart(buildVariant());
    setAddedToBag(true);
    toast.success(
      `Added to bag: ${product.name} · ${activeColor || "Default"}`,
      { icon: "🛍️" },
    );
    setTimeout(() => setAddedToBag(false), 2500);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to purchase items", { icon: "🔒" });
      router.push("/login");
      return;
    }
    setCheckoutItems([buildVariant()]);
    router.push("/checkout");
  };

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
                  style={{
                    animation: "galleryFadeOut 0.5s ease-in-out forwards",
                  }}
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
                style={
                  isTransitioning
                    ? { animation: "galleryFadeIn 0.5s ease-out forwards" }
                    : {}
                }
              />
              {activeColor && (
                <div
                  className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#282c3f] text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm"
                  style={
                    isTransitioning
                      ? { animation: "gallerySlideUp 0.4s ease-out 0.15s both" }
                      : {}
                  }
                >
                  {activeColor}
                </div>
              )}
            </div>
          </div>
          {/* ─── CUSTOMER RATINGS & REVIEWS ─── */}
          <div className="mt-12 mb-4">
            <h2 className="text-[22px] font-bold text-[#282c3f] mb-6">
              Customer Ratings & Reviews
            </h2>
            <div className="bg-white border border-[#eaeaec] rounded-[12px] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Left: Overall Rating */}
                <div className="flex flex-col items-start justify-center min-w-[150px]">
                  <div className="flex items-center gap-2 text-[#282c3f]">
                    <span className="text-[52px] font-bold leading-none tracking-tight">
                      {(product.rating || 5.0).toFixed(1)}
                    </span>
                    <Star size={36} className="fill-[#14958f] text-[#14958f]" />
                  </div>
                  <div className="mt-3">
                    <p className="text-[16px] font-bold text-[#282c3f]">
                      Overall Rating
                    </p>
                    <p className="text-[14px] text-[#535766] mt-0.5">
                      {product.reviews || 1} Verified Buyers
                    </p>
                  </div>
                </div>

                {/* Right: Star Distribution */}
                <div className="flex-1 flex flex-col justify-center gap-3 md:border-l-0 md:pl-4 pt-4 md:pt-0">
                  {[
                    { stars: 5, percent: 75, color: "bg-[#14958f]" },
                    { stars: 4, percent: 15, color: "bg-[#14958f]" },
                    { stars: 3, percent: 5, color: "bg-[#ff905a]" },
                    { stars: 2, percent: 3, color: "bg-[#ff3f6c]" },
                    { stars: 1, percent: 2, color: "bg-[#ff3f6c]" },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <div className="flex items-center justify-end gap-1 w-8 text-[14px] font-bold text-[#282c3f]">
                        {row.stars}{" "}
                        <Star
                          size={12}
                          className="fill-[#535766] text-[#535766]"
                        />
                      </div>
                      <div className="flex-1 h-[6px] bg-[#f5f5f6] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color}`}
                          style={{ width: `${row.percent}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-right text-[13px] text-[#535766] font-medium">
                        {row.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-8 border-[#eaeaec]" />

              {/* What Customers Say */}
              <div>
                <h3 className="text-[16px] font-bold text-[#282c3f] mb-4">
                  What Customers Say
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Excellent Fabric",
                    "Great Color",
                    "Perfect Fit",
                    "Premium Quality",
                    "Value for Money",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-[#f5f5f6] text-[#282c3f] text-[13px] font-semibold rounded-full hover:bg-[#eaeaec] transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ─── DETAILED REVIEWS LIST ─── */}
          <div className="mt-8 mb-8">
            {/* Header: Tabs & Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eaeaec] pb-3 mb-6">
              <div className="flex items-center gap-6 text-[15px] font-bold">
                <button className="text-[#ff3f6c] border-b-2 border-[#ff3f6c] pb-3 -mb-[14px]">
                  All Reviews
                </button>
                <button className="text-[#535766] hover:text-[#282c3f] pb-3 -mb-[14px]">
                  With Images
                </button>
                <button className="text-[#535766] hover:text-[#282c3f] pb-3 -mb-[14px]">
                  Recent
                </button>
              </div>
              <button className="bg-[#ff3f6c] text-white px-5 py-2.5 rounded-[4px] font-bold text-[14px] flex items-center gap-2 hover:bg-[#ed315d] transition-colors shadow-sm">
                <PenLine size={16} />
                WRITE A REVIEW
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {/* Review 1 */}
              <div className="bg-white border border-[#eaeaec] rounded-[12px] p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#eaeaec] border border-[#d4d5d9] flex items-center justify-center text-[#282c3f] font-bold text-[18px]">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-[#282c3f]">
                          Anjali M.
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#03a685] bg-[#e6f6f4] px-1.5 py-0.5 rounded-sm uppercase">
                          <Check size={10} strokeWidth={3} /> Verified
                        </span>
                      </div>
                      <p className="text-[13px] text-[#94969f] mt-0.5">
                        12 May 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#14958f] text-white px-2 py-0.5 rounded-[3px] text-[13px] font-bold">
                    5 <Star size={10} className="fill-white" />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-[15px] text-[#282c3f]">
                    Absolutely Stunning and Premium Quality
                  </h4>
                  <p className="text-[14px] text-[#535766] mt-2 leading-relaxed">
                    I wore this saree for my sister's wedding and received so
                    many compliments! The fabric feels incredibly soft, and the
                    vibrant color exactly matches the pictures. The intricate
                    embroidery work is flawless. Highly recommend purchasing
                    from SareeBazar!
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-[13px] text-[#94969f] border-t border-[#eaeaec] pt-4">
                  <div className="flex items-center gap-4">
                    <span>Was this helpful?</span>
                    <button className="flex items-center gap-1.5 hover:text-[#282c3f] transition-colors">
                      <ThumbsUp size={16} /> Yes (45)
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#282c3f] transition-colors">
                      <ThumbsDown size={16} /> No
                    </button>
                  </div>
                  <button className="flex items-center gap-1 hover:text-[#282c3f] transition-colors">
                    <MoreVertical size={16} /> Report
                  </button>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white border border-[#eaeaec] rounded-[12px] p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f6] border border-[#d4d5d9] flex items-center justify-center text-[#535766] font-bold text-[18px]">
                      K
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-[#282c3f]">
                          Kavya S.
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#03a685] bg-[#e6f6f4] px-1.5 py-0.5 rounded-sm uppercase">
                          <Check size={10} strokeWidth={3} /> Verified
                        </span>
                      </div>
                      <p className="text-[13px] text-[#94969f] mt-0.5">
                        28 April 2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#14958f] text-white px-2 py-0.5 rounded-[3px] text-[13px] font-bold">
                    4 <Star size={10} className="fill-white" />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-[15px] text-[#282c3f]">
                    Beautiful color, good fabric
                  </h4>
                  <p className="text-[14px] text-[#535766] mt-2 leading-relaxed">
                    The saree is very beautiful and looks just like the
                    pictures. The only reason I am giving it 4 stars instead of
                    5 is because the blouse piece was slightly smaller than
                    expected. But overall a great purchase!
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-[13px] text-[#94969f] border-t border-[#eaeaec] pt-4">
                  <div className="flex items-center gap-4">
                    <span>Was this helpful?</span>
                    <button className="flex items-center gap-1.5 hover:text-[#282c3f] transition-colors">
                      <ThumbsUp size={16} /> Yes (12)
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#282c3f] transition-colors">
                      <ThumbsDown size={16} /> No (2)
                    </button>
                  </div>
                  <button className="flex items-center gap-1 hover:text-[#282c3f] transition-colors">
                    <MoreVertical size={16} /> Report
                  </button>
                </div>
              </div>
            </div>
            {/* Load More Reviews Button */}
            <div className="mt-8 text-center">
              <button className="bg-white border border-[#d4d5d9] text-[#282c3f] px-6 py-2.5 rounded-[4px] font-bold text-[14px] hover:border-[#282c3f] hover:bg-[#f5f5f6] transition-colors shadow-sm">
                Load More Reviews
              </button>
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
                {product.rating}{" "}
                <Star size={14} className="fill-[#14958f] text-[#14958f]" />
              </span>
              <span className="w-[1px] h-3 bg-[#d4d5d9]"></span>
              <span className="text-[14px] text-[#535766]">
                {product.reviews} Ratings
              </span>
            </div>

            <hr className="my-4 border-[#eaeaec]" />

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-[24px] font-bold text-[#282c3f]">
                Rs. {salePrice.toLocaleString("en-LK")}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-[20px] text-[#7e818c] line-through font-normal">
                    Rs. {product.price.toLocaleString("en-LK")}
                  </span>
                  <span className="text-[20px] font-bold text-[#ff905a]">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[14px] text-[#03a685] font-bold mt-1">
              inclusive of all taxes
            </p>

            {product.stock !== undefined && (
              <p
                className={`text-[14px] font-bold mt-2 ${product.stock === 0 ? "text-[#ff3e6c]" : product.stock <= 5 ? "text-[#ff905a]" : "text-[#388e3c]"}`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : product.stock <= 5
                    ? `Only ${product.stock} left in stock`
                    : "In Stock"}
              </p>
            )}

            {/* ─── COLOR SELECTOR (below price) ─── */}
            {colorVariants && colorVariants.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[15px] text-[#535766]">
                    Color:{" "}
                    <span className="text-[#282c3f] font-medium ml-1">
                      {activeColor}
                    </span>
                  </div>
                  <span className="text-[#94969f] text-[12px] font-bold tracking-widest">
                    &gt;&gt;&gt;
                  </span>
                </div>

                <div className="flex items-start gap-3 overflow-x-auto py-3 px-2 -mx-2 scrollbar-hide">
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
                            : "border border-transparent hover:border-[#d4d5d9]"
                          }
                        `}
                        style={
                          isActive
                            ? {
                              boxShadow: `0 0 0 2px white, 0 0 0 4px ${variant.hex}, 0 4px 12px ${variant.hex}60`,
                            }
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
                  <h4 className="text-[14px] font-bold text-[#282c3f]">
                    See it on yourself!
                  </h4>
                  <p className="text-[12px] text-[#535766]">
                    Use our AI Virtual Try-On feature.
                  </p>
                </div>
              </div>
              <Link
                href={`/virtual-tryon?saree=${encodeURIComponent(gallery[0])}`}
              >
                <button className="px-4 py-2 bg-[#282c3f] text-white text-[12px] font-bold uppercase rounded-[4px] hover:bg-black transition-colors">
                  Try Now
                </button>
              </Link>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-[14px] font-semibold text-[#535766] uppercase tracking-wide">
                Qty:
              </span>
              <div className="flex items-center border border-[#d4d5d9] rounded-[4px] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={product.stock === 0}
                  className="w-9 h-9 flex items-center justify-center text-[#282c3f] hover:bg-[#f5f5f6] transition-colors text-[18px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-10 h-9 flex items-center justify-center text-[15px] font-bold text-[#282c3f] border-x border-[#d4d5d9]">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 1, q + 1))
                  }
                  disabled={
                    product.stock === 0 || quantity >= (product.stock || 1)
                  }
                  className="w-9 h-9 flex items-center justify-center text-[#282c3f] hover:bg-[#f5f5f6] transition-colors text-[18px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddToBag}
                disabled={product.stock === 0}
                className={`flex-1 h-14 rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${addedToBag
                    ? "bg-[#03a685] text-white"
                    : "bg-[#ff3f6c] text-white hover:bg-[#ed315d]"
                  }`}
              >
                {addedToBag ? <Check size={20} /> : <ShoppingBag size={20} />}
                {addedToBag ? "Added!" : "Add to Bag"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 h-14 bg-white border-2 border-[#282c3f] text-[#282c3f] rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#282c3f] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#282c3f]"
              >
                <CreditCard size={20} /> Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button className="mt-3 w-full h-10 bg-transparent border border-[#d4d5d9] text-[#535766] rounded-[4px] font-semibold text-[14px] uppercase tracking-wide flex items-center justify-center gap-2 hover:border-[#282c3f] hover:text-[#282c3f] transition-colors">
              <Heart size={17} /> Add to Wishlist
            </button>

            {/* Product Details */}
            <div className="mt-8">
              <h4 className="text-[16px] font-bold text-[#282c3f] uppercase mb-4">
                Product Details
              </h4>
              <p className="text-[14px] text-[#535766] leading-relaxed">
                {product.description}
              </p>

              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">
                Size &amp; Fit
              </h5>
              <p className="text-[14px] text-[#535766]">
                Saree Length: 5.5 Metres
              </p>
              <p className="text-[14px] text-[#535766]">
                Blouse Piece: 0.8 Metres
              </p>

              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">
                Material &amp; Care
              </h5>
              <p className="text-[14px] text-[#535766]">
                Fabric: {product.fabric || "Silk blend"}
              </p>
              <p className="text-[14px] text-[#535766]">Dry Clean only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes galleryFadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.02);
          }
        }
        @keyframes galleryFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes gallerySlideUp {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes swatchPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.03);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .active-swatch {
          animation: swatchPulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
      `}</style>
    </>
  );
}
