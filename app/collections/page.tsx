"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

/* ─── Data ─── */
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  isWishlisted?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Kanjivaram Silk Saree",
    image: "/images/collections/kanjivaram-silk.png",
    price: 245,
    originalPrice: 390,
    rating: 5,
    reviews: 42,
    category: "Silk Sarees",
    badge: "New",
  },
  {
    id: 2,
    name: "Bridal Red Banarasi",
    image: "/images/collections/bridal-banarasi.png",
    price: 520,
    rating: 4.5,
    reviews: 128,
    category: "Bridal",
  },
  {
    id: 3,
    name: "Pastel Chanderi Cotton",
    image: "/images/collections/chanderi-cotton.png",
    price: 110,
    originalPrice: 180,
    rating: 4,
    reviews: 88,
    category: "Cotton Sarees",
    badge: "-15%",
  },
  {
    id: 4,
    name: "Emerald Georgette",
    image: "/images/collections/emerald-georgette.png",
    price: 185,
    rating: 4.5,
    reviews: 89,
    category: "Handloom",
  },
  {
    id: 5,
    name: "Tussar Silk Heritage",
    image: "/images/collections/tussar-silk.png",
    price: 320,
    originalPrice: 450,
    rating: 5,
    reviews: 64,
    category: "Silk Sarees",
    badge: "Best Seller",
  },
  {
    id: 6,
    name: "Royal Banarasi Brocade",
    image: "/images/collections/bridal-banarasi.png",
    price: 680,
    rating: 5,
    reviews: 156,
    category: "Bridal",
  },
  {
    id: 7,
    name: "Soft Cotton Handloom",
    image: "/images/collections/chanderi-cotton.png",
    price: 95,
    originalPrice: 140,
    rating: 4,
    reviews: 73,
    category: "Cotton Sarees",
  },
  {
    id: 8,
    name: "Pure Silk Kanjivaram",
    image: "/images/collections/kanjivaram-silk.png",
    price: 410,
    rating: 4.5,
    reviews: 102,
    category: "Silk Sarees",
  },
  {
    id: 9,
    name: "Designer Georgette Party",
    image: "/images/collections/emerald-georgette.png",
    price: 210,
    originalPrice: 290,
    rating: 4,
    reviews: 55,
    category: "Daily Wear",
    badge: "-28%",
  },
  {
    id: 10,
    name: "Golden Tussar Weave",
    image: "/images/collections/tussar-silk.png",
    price: 275,
    rating: 4.5,
    reviews: 47,
    category: "Handloom",
  },
  {
    id: 11,
    name: "Festive Red Banarasi",
    image: "/images/collections/bridal-banarasi.png",
    price: 550,
    originalPrice: 720,
    rating: 5,
    reviews: 91,
    category: "Bridal",
    badge: "Trending",
  },
  {
    id: 12,
    name: "Daily Comfort Cotton",
    image: "/images/collections/chanderi-cotton.png",
    price: 75,
    rating: 4,
    reviews: 134,
    category: "Daily Wear",
  },
];

const filterCategories = [
  { icon: "✦", label: "Silk Sarees" },
  { icon: "❋", label: "Cotton Sarees" },
  { icon: "◈", label: "Handloom" },
  { icon: "✿", label: "Bridal" },
  { icon: "☀", label: "Daily Wear" },
];

const ITEMS_PER_PAGE = 8;

/* ─── Star Rating Component ─── */
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : star - 0.5 <= rating
                ? "fill-amber-400/50 text-amber-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-[11px] text-gray-500">({reviews})</span>
    </div>
  );
}

/* ─── Product Card ─── */
function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(product.isWishlisted || false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Wishlist Button */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-500 hover:text-red-400"
            }
          />
        </button>

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ${
              product.badge === "New"
                ? "bg-emerald-500 text-white"
                : product.badge === "Best Seller"
                ? "bg-amber-500 text-white"
                : product.badge === "Trending"
                ? "bg-purple-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <StarRating rating={product.rating} reviews={product.reviews} />
        <h3 className="mt-1.5 text-sm font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-base font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <button className="mt-3 w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 bg-[#8B1A1A] text-white hover:bg-[#6B1010] active:scale-[0.98]">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function CollectionsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleFilter = (category: string) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((f) => f !== category)
        : [...prev, category]
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
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [selectedFilters, sortBy]);

  /* ─── Pagination ─── */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#FBF9F7] pt-[70px]">
      {/* ─── Breadcrumb ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link
            href="/"
            className="hover:text-[#B88E52] transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <Link
            href="/collections"
            className="text-[#B88E52] font-medium"
          >
            Collections
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-700 font-medium">Sarees</span>
        </nav>
      </div>

      {/* ─── Page Title ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#8B1A1A]">
          Saree Collections
        </h1>
      </div>

      {/* ─── Hero Banner ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
        <div className="relative rounded-2xl overflow-hidden h-[260px] md:h-[340px]">
          <Image
            src="/images/collections/hero-banner.png"
            alt="The Heritage Weave Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white max-w-md">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 drop-shadow-lg">
              The Heritage Weave
            </h2>
            <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 drop-shadow-md">
              Discover our curated collection of timeless classics, woven with
              tradition and modern elegance.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Toggle ─── */}
      <div className="lg:hidden max-w-7xl mx-auto px-6 md:px-8 mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#B88E52] transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {selectedFilters.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#8B1A1A] text-white text-[10px]">
              {selectedFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── Content Area ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-16">
        <div className="flex gap-8">
          {/* ─── Sidebar (Desktop) ─── */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="sticky top-[90px]">
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Filter By
                </h3>
                <p className="text-xs text-[#B88E52] mb-5 font-medium">
                  Refine your selection
                </p>

                <div className="space-y-2">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => toggleFilter(cat.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedFilters.includes(cat.label)
                          ? "bg-[#8B1A1A] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setSelectedFilters(filterCategories.map(c => c.label))}
                    className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide bg-[#8B1A1A] text-white hover:bg-[#6B1010] transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide border-2 border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Mobile Filter Overlay ─── */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-6 shadow-2xl overflow-y-auto animate-slide-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filter By</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => toggleFilter(cat.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedFilters.includes(cat.label)
                          ? "bg-[#8B1A1A] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      setMobileFilterOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide bg-[#8B1A1A] text-white"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      clearFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide border-2 border-gray-200 text-gray-600"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Products Grid ─── */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-[#B88E52] font-medium">
                Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
                results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#B88E52] cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {paginatedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-medium">
                  No sarees match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-[#B88E52] text-sm font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#B88E52] hover:text-[#B88E52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#8B1A1A] text-white shadow-md"
                          : "border border-gray-200 text-gray-600 hover:border-[#B88E52] hover:text-[#B88E52]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#B88E52] hover:text-[#B88E52] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
