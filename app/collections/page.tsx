"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  ShoppingBag,
  ShoppingCart,
  Search,
  Bot,
} from "lucide-react";

import {
  products,
  filterCategories,
} from "@/mockdata/collections";
import type { Product } from "@/mockdata/collections";

const ITEMS_PER_PAGE = 12;

/* ─── Star Rating (Myntra-style green pill) ─── */
function RatingBadge({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-[#388e3c] text-white text-[11px] font-semibold leading-none">
        {rating}
        <Star size={8} className="fill-white text-white" />
      </span>
      <span className="text-[12px] text-[#878787] font-normal">
        ({reviews})
      </span>
    </div>
  );
}

/* ─── Filter Section (Myntra-style expandable) ─── */
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e8e8e1] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-[14px] font-semibold text-[#282c3f] uppercase tracking-wide"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}

/* ─── Product Card (Myntra-style) ─── */
function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(product.isWishlisted || false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // For image carousel
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hovered && images.length > 1 && isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
      }, 2000);
    } else if (!hovered) {
      setCurrentImageIdx(0); // reset when not hovered
      setIsAutoPlaying(true); // resume autoplay for next hover
    }
    return () => clearInterval(interval);
  }, [hovered, images.length, isAutoPlaying]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative bg-white cursor-pointer block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f6]">
        <Image
          src={images[currentImageIdx]}
          alt={product.name}
          fill
          quality={100}
          unoptimized={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Carousel manual controls */}
        {hovered && images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/60 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/40"
            >
              <ChevronLeft size={16} className="text-[#282c3f]" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/60 z-10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/40"
            >
              <ChevronRight size={16} className="text-[#282c3f]" />
            </button>
            
            {/* Carousel dots */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5 z-10 transition-transform duration-300">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIdx ? "w-3 bg-white" : "w-1.5 bg-white/50"}`} 
                />
              ))}
            </div>
          </>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-0 left-0">
            <span
              className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                product.badge === "Trending"
                  ? "bg-[#ff3e6c] text-white"
                  : product.badge === "Best Seller"
                    ? "bg-[#ff8f00] text-white"
                    : product.badge === "New"
                      ? "bg-[#388e3c] text-white"
                      : "bg-[#ff3e6c] text-white"
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? "bg-white shadow-md"
              : hovered
                ? "bg-white/90 shadow-sm"
                : "bg-transparent"
          }`}
          style={{ opacity: wishlisted || hovered ? 1 : 0 }}
        >
          <Heart
            size={16}
            className={
              wishlisted
                ? "fill-[#ff3e6c] text-[#ff3e6c]"
                : "text-[#535766]"
            }
          />
        </button>

        {/* ─── Hover Actions Overlay ─── */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {/* Shop Now + Cart Row */}
          <div className="flex">
            <button className="flex-1 py-2.5 bg-white/95 backdrop-blur-sm border-t border-r border-[#d4d5d9] text-[#282c3f] text-[12px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 hover:bg-[#ff3f6c] hover:text-white transition-all duration-200">
              <ShoppingBag size={13} />
              Shop Now
            </button>
            <button
              className="w-12 py-2.5 bg-white/95 backdrop-blur-sm border-t border-[#d4d5d9] flex items-center justify-center text-[#282c3f] hover:bg-[#ff3f6c] hover:text-white transition-all duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
          {/* Virtual Try-On Row */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/virtual-tryon?saree=${encodeURIComponent(images[currentImageIdx])}`);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:from-[#6d28d9] hover:to-[#9333ea] transition-all duration-200"
          >
            <Bot size={14} className="animate-bounce-subtle" />
            <span className="text-[11px] font-semibold uppercase tracking-wider animate-pulse">Virtual Try-On</span>
            <span className="text-[10px] opacity-70 ml-1">→</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-2.5 pt-3 pb-3">
        {/* Product Name */}
        <h3 className="text-[14px] font-bold text-[#282c3f] truncate leading-tight">
          {product.name}
        </h3>
        {/* Category */}
        <p className="text-[13px] font-normal text-[#535766] truncate mt-0.5 leading-tight">
          {product.category}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[13px] font-bold text-[#282c3f]">
            LKR {product.price.toLocaleString("en-LK")}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-[12px] text-[#7e818c] line-through font-normal">
                LKR {product.originalPrice.toLocaleString("en-LK")}
              </span>
              <span className="text-[12px] text-[#ff905a] font-normal">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="mt-1.5">
          <RatingBadge rating={product.rating} reviews={product.reviews} />
        </div>
      </div>
    </Link>
  );
}

/* ─── Sort Options ─── */
const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "New Arrivals" },
];

/* ─── Main Page ─── */
function CollectionsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  
  useEffect(() => {
    if (categoryParam) {
      setSelectedFilters((prev) => 
        prev.includes(categoryParam) ? prev : [categoryParam]
      );
    }
  }, [categoryParam]);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFilter = (category: string) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((f) => f !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
  };

  /* ─── Filtering ─── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q)),
      );
    }

    if (selectedFilters.length > 0) {
      result = result.filter((p) => selectedFilters.includes(p.category));
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "popular":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return result;
  }, [selectedFilters, sortBy, searchQuery]);

  /* ─── Pagination ─── */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || "Recommended";

  return (
    <main
      className="min-h-screen bg-[#f5f5f6] pt-[100px]"
      style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400 }}
    >
      {/* ─── Search Bar ─── */}
      <div className="bg-white border-b border-[#e8e8e1]">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="relative max-w-2xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94969f]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search for sarees, colors..."
              className="w-full pl-11 pr-10 py-2.5 rounded-[4px] border border-[#d4d5d9] bg-[#f5f5f6] text-[14px] text-[#282c3f] placeholder-[#94969f] focus:outline-none focus:border-[#ff3f6c] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94969f] hover:text-[#282c3f] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>


      {/* ─── Page Title Bar ─── */}
      <div className="bg-white border-b border-[#e8e8e1]">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-bold text-[#282c3f]">
              Sarees
              <span className="text-[13px] font-normal text-[#94969f] ml-2">
                - {filteredProducts.length} items
              </span>
            </h1>
          </div>

          {/* Sort Dropdown (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#282c3f] hover:text-[#ff3f6c] transition-colors"
            >
              Sort by: <span className="font-bold">{currentSortLabel}</span>
              <ChevronDown size={14} />
            </button>
            {sortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-[220px] bg-white border border-[#d4d5d9] shadow-lg z-20 rounded-[4px]">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[13px] transition-colors ${
                        sortBy === opt.value
                          ? "text-[#ff3f6c] font-semibold bg-[#fef2f5]"
                          : "text-[#282c3f] hover:bg-[#f5f5f6]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Active Filters Tags ─── */}
      {selectedFilters.length > 0 && (
        <div className="bg-white border-b border-[#e8e8e1]">
          <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-[#94969f] font-medium uppercase tracking-wide">
              Filters:
            </span>
            {selectedFilters.map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className="inline-flex items-center gap-1 px-3 py-1 border border-[#d4d5d9] rounded-full text-[12px] text-[#282c3f] hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-colors"
              >
                {f}
                <X size={12} />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-[12px] text-[#ff3f6c] font-semibold ml-2 hover:underline"
            >
              CLEAR ALL
            </button>
          </div>
        </div>
      )}

      {/* ─── Mobile Filter Toggle ─── */}
      <div className="lg:hidden bg-white border-b border-[#e8e8e1]">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#282c3f] uppercase tracking-wide"
          >
            <SlidersHorizontal size={14} />
            Filters
            {selectedFilters.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#ff3f6c] text-white text-[10px] flex items-center justify-center font-bold">
                {selectedFilters.length}
              </span>
            )}
          </button>

          {/* Mobile Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[13px] text-[#282c3f] font-semibold border-none bg-transparent focus:outline-none cursor-pointer uppercase tracking-wide"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-[1400px] mx-auto flex">
        {/* ─── Sidebar Filters (Desktop) ─── */}
        <aside className="hidden lg:block w-[250px] flex-shrink-0 bg-white border-r border-[#e8e8e1] min-h-[calc(100vh-180px)]">
          <div className="sticky top-[70px] p-4 overflow-y-auto max-h-[calc(100vh-70px)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide">
                Filters
              </h3>
              {selectedFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[12px] text-[#ff3f6c] font-semibold hover:underline"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Category Filter */}
            <FilterSection title="Categories">
              {filterCategories.map((cat) => (
                <label
                  key={cat.label}
                  className="flex items-center gap-3 cursor-pointer group/check"
                >
                  <div
                    className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                      selectedFilters.includes(cat.label)
                        ? "bg-[#ff3f6c] border-[#ff3f6c]"
                        : "border-[#d4d5d9] group-hover/check:border-[#ff3f6c]"
                    }`}
                    onClick={() => toggleFilter(cat.label)}
                  >
                    {selectedFilters.includes(cat.label) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[13px] text-[#282c3f] font-normal"
                    onClick={() => toggleFilter(cat.label)}
                  >
                    {cat.label}
                  </span>
                  {cat.count && (
                    <span className="text-[11px] text-[#94969f] ml-auto">
                      ({cat.count})
                    </span>
                  )}
                </label>
              ))}
            </FilterSection>

            {/* Price Filter */}
            <FilterSection title="Price">
              {[
                { label: "Under LKR 500", range: "0-500" },
                { label: "LKR 500 - LKR 1000", range: "500-1000" },
                { label: "LKR 1000 - LKR 2000", range: "1000-2000" },
                { label: "Above LKR 2000", range: "2000+" },
              ].map((price) => (
                <label
                  key={price.range}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-[3px] border-2 border-[#d4d5d9] flex items-center justify-center hover:border-[#ff3f6c] transition-colors" />
                  <span className="text-[13px] text-[#282c3f] font-normal">
                    {price.label}
                  </span>
                </label>
              ))}
            </FilterSection>

            {/* Customer Ratings */}
            <FilterSection title="Customer Ratings" defaultOpen={false}>
              {[4, 3, 2].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-[3px] border-2 border-[#d4d5d9] flex items-center justify-center hover:border-[#ff3f6c] transition-colors" />
                  <span className="flex items-center gap-1 text-[13px] text-[#282c3f]">
                    {r}
                    <Star size={10} className="fill-[#388e3c] text-[#388e3c]" />
                    & above
                  </span>
                </label>
              ))}
            </FilterSection>
          </div>
        </aside>

        {/* ─── Mobile Filter Overlay ─── */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl overflow-y-auto animate-slide-in">
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-4 border-b border-[#e8e8e1]">
                <h3 className="text-[16px] font-bold text-[#282c3f] uppercase tracking-wide">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#f5f5f6] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-4 pb-20">
                <FilterSection title="Categories">
                  {filterCategories.map((cat) => (
                    <label
                      key={cat.label}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                          selectedFilters.includes(cat.label)
                            ? "bg-[#ff3f6c] border-[#ff3f6c]"
                            : "border-[#d4d5d9]"
                        }`}
                        onClick={() => toggleFilter(cat.label)}
                      >
                        {selectedFilters.includes(cat.label) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-[#282c3f]" onClick={() => toggleFilter(cat.label)}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </FilterSection>
              </div>

              {/* Apply Button */}
              <div className="fixed bottom-0 left-0 w-[300px] bg-white border-t border-[#e8e8e1] p-4 flex gap-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-3 border border-[#d4d5d9] text-[13px] font-bold text-[#282c3f] uppercase tracking-wide"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#ff3f6c] text-white text-[13px] font-bold uppercase tracking-wide"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Products Grid ─── */}
        <div className="flex-1 min-w-0">
          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-[#e8e8e1]">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {paginatedProducts.length === 0 && (
            <div className="text-center py-20 bg-white">
              <p className="text-[#7e818c] text-[16px] font-medium">
                No sarees match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-3 text-[#ff3f6c] text-[13px] font-semibold hover:underline uppercase tracking-wide"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 py-8 bg-white">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center text-[#282c3f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f5f5f6] transition-colors rounded"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-[13px] font-semibold rounded transition-all ${
                      currentPage === page
                        ? "bg-[#ff3f6c] text-white"
                        : "text-[#282c3f] hover:bg-[#f5f5f6]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center text-[#282c3f] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f5f5f6] transition-colors rounded"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Page Info */}
          <div className="py-4 text-center bg-white border-t border-[#e8e8e1]">
            <p className="text-[12px] text-[#94969f]">
              Page {currentPage} of {totalPages} |{" "}
              <span className="font-medium text-[#282c3f]">
                {filteredProducts.length} Products
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
