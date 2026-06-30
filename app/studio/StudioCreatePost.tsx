"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Search,
  ChevronDown,
  Check,
  ImagePlus,
  Film,
  Package,
  Hash,
  Type,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

/* ─── Types ─── */

interface SelectedProduct {
  id: string;
  name: string;
  image: string;
  source: "order" | "search" | "manual";
}

interface RecentOrderCard {
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  orderDate: string;
}

interface MockProduct {
  id: string;
  name: string;
  image: string;
  category: string;
}

/* ─── Mock Data (replace with API calls later) ─── */

const MOCK_RECENT_ORDERS: RecentOrderCard[] = [
  {
    orderId: "ORD-1001",
    productId: "p1",
    productName: "Banarasi Silk Saree – Royal Blue",
    productImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop",
    orderDate: "18 Jun 2026",
  },
  {
    orderId: "ORD-1002",
    productId: "p2",
    productName: "Kanjivaram Silk – Deep Maroon",
    productImage:
      "https://images.unsplash.com/photo-1583391733958-d15fa6937185?w=300&h=300&fit=crop",
    orderDate: "12 Jun 2026",
  },
  {
    orderId: "ORD-1003",
    productId: "p3",
    productName: "Chanderi Cotton – Mint Green",
    productImage:
      "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=300&h=300&fit=crop",
    orderDate: "5 Jun 2026",
  },
  {
    orderId: "ORD-1004",
    productId: "p4",
    productName: "Mysore Silk – Golden Yellow",
    productImage:
      "https://images.unsplash.com/photo-1614093302611-8efc4de12964?w=300&h=300&fit=crop",
    orderDate: "28 May 2026",
  },
  {
    orderId: "ORD-1005",
    productId: "p5",
    productName: "Linen Saree – Off White",
    productImage:
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300&h=300&fit=crop",
    orderDate: "20 May 2026",
  },
];

const MOCK_CATALOG: MockProduct[] = [
  { id: "p1", name: "Banarasi Silk Saree – Royal Blue", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop", category: "Silk" },
  { id: "p2", name: "Kanjivaram Silk – Deep Maroon", image: "https://images.unsplash.com/photo-1583391733958-d15fa6937185?w=300&h=300&fit=crop", category: "Silk" },
  { id: "p3", name: "Chanderi Cotton – Mint Green", image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=300&h=300&fit=crop", category: "Cotton" },
  { id: "p4", name: "Mysore Silk – Golden Yellow", image: "https://images.unsplash.com/photo-1614093302611-8efc4de12964?w=300&h=300&fit=crop", category: "Silk" },
  { id: "p5", name: "Linen Saree – Off White", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300&h=300&fit=crop", category: "Linen" },
  { id: "p6", name: "Patola Silk – Red & Gold", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop", category: "Silk" },
  { id: "p7", name: "Tussar Silk – Beige", image: "https://images.unsplash.com/photo-1583391733958-d15fa6937185?w=300&h=300&fit=crop", category: "Silk" },
  { id: "p8", name: "Georgette Saree – Pastel Pink", image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=300&h=300&fit=crop", category: "Georgette" },
  { id: "p9", name: "Chiffon Saree – Lavender", image: "https://images.unsplash.com/photo-1614093302611-8efc4de12964?w=300&h=300&fit=crop", category: "Chiffon" },
  { id: "p10", name: "Organza Saree – Peach", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300&h=300&fit=crop", category: "Organza" },
];

const OCCASIONS = ["Wedding", "Festival", "Casual", "Office", "Puja"];
const DRAPING_STYLES = [
  "Nivi",
  "Bengali",
  "Gujarati",
  "Maharashtrian",
  "Kodagu",
  "Other",
];

/* ─── Component ─── */

export default function StudioCreatePost({
  onClose,
}: {
  onClose: () => void;
}) {
  // ── Media state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Product tag state
  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MockProduct[]>([]);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualProductId, setManualProductId] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Caption state
  const [caption, setCaption] = useState("");
  const MAX_CAPTION = 300;

  // ── Tags state
  const [occasion, setOccasion] = useState("");
  const [drapingStyle, setDrapingStyle] = useState("");

  // ── Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = mediaFile !== null && selectedProduct !== null;

  /* ─── Search handler (filters mock catalog) ─── */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(() => {
      const lower = query.toLowerCase();
      const results = MOCK_CATALOG.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
      setSearchResults(results.slice(0, 8));
    }, 200);
  }, []);

  /* ─── File handler ─── */
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous preview
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);

    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreview(url);
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
  }

  function clearMedia() {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /* ─── Select product from order card ─── */
  function selectFromOrder(card: RecentOrderCard) {
    setSelectedProduct({
      id: card.productId,
      name: card.productName,
      image: card.productImage,
      source: "order",
    });
    setSearchQuery("");
    setSearchResults([]);
    setManualProductId("");
    setShowManualInput(false);
  }

  /* ─── Select product from search ─── */
  function selectFromSearch(product: MockProduct) {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      source: "search",
    });
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
    setManualProductId("");
    setShowManualInput(false);
  }

  /* ─── Select product by manual ID ─── */
  function selectByManualId() {
    if (!manualProductId.trim()) return;
    const found = MOCK_CATALOG.find(
      (p) => p.id === manualProductId.trim()
    );
    setSelectedProduct({
      id: manualProductId.trim(),
      name: found?.name || `Product #${manualProductId.trim()}`,
      image: found?.image || "",
      source: "manual",
    });
    setSearchQuery("");
    setSearchResults([]);
  }

  /* ─── Submit handler ─── */
  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // TODO: Wire to real API (POST multipart form data)
    await new Promise((res) => setTimeout(res, 1500));

    setIsSubmitting(false);
    onClose();
  }

  /* ─── Cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex justify-center">
      <div className="w-full max-w-[500px] bg-white h-full flex flex-col shadow-sm border-x border-gray-100">
        {/* ── Header ── */}
        <div className="shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-lg font-medium text-gray-900">New Post</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* ── Scrollable form body ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-28">
          {/* ──────────────────────────────────────────
              Section 1: Media Upload
          ────────────────────────────────────────── */}
          <section className="px-4 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">
                Upload Photo or Reel
              </h2>
            </div>

            {!mediaPreview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-gray-200 
                           hover:border-primary/40 hover:bg-primary/[0.02] 
                           transition-all duration-300 flex flex-col items-center justify-center gap-3 group"
              >
                <div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 
                              flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <Upload
                    size={28}
                    className="text-primary/60 group-hover:text-primary transition-colors"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    Tap to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Photo or Video • Max 50MB
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <ImagePlus size={12} /> Photo
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Film size={12} /> Reel
                  </span>
                </div>
              </button>
            ) : (
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 group">
                {mediaType === "video" ? (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    muted
                  />
                ) : (
                  <Image
                    src={mediaPreview}
                    alt="Upload preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                <button
                  onClick={clearMedia}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
                             flex items-center justify-center text-white hover:bg-black/70 
                             transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 
                              backdrop-blur-sm text-white text-[11px] font-medium 
                              flex items-center gap-1"
                >
                  {mediaType === "video" ? (
                    <Film size={11} />
                  ) : (
                    <ImagePlus size={11} />
                  )}
                  {mediaType === "video" ? "Reel" : "Photo"}
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </section>

          <div className="h-px bg-gray-100 mx-4" />

          {/* ──────────────────────────────────────────
              Section 2: Tag a Product
          ────────────────────────────────────────── */}
          <section className="px-4 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Package size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">
                Which saree are you posting about?
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 ml-9 mb-3">
              Required for verified badge{" "}
              <span className="inline-flex items-center gap-0.5">
                <Check size={10} className="text-emerald-500" />
              </span>
            </p>

            {/* Selected Product Chip */}
            {selectedProduct && (
              <div
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 mb-3
                            animate-[fadeIn_0.2s_ease]"
              >
                {selectedProduct.image ? (
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedProduct.name}
                  </p>
                  <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <Check size={10} /> Tagged
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Recent Orders */}
            {!selectedProduct && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2 ml-0.5">
                  Your recent orders
                </p>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                  {MOCK_RECENT_ORDERS.map((card, i) => (
                    <button
                      key={`${card.orderId}-${card.productId}-${i}`}
                      onClick={() => selectFromOrder(card)}
                      className="flex-shrink-0 w-[120px] rounded-xl border border-gray-200 
                                 hover:border-primary/40 hover:shadow-sm
                                 transition-all duration-200 overflow-hidden bg-white group"
                    >
                      <div className="w-full h-[90px] bg-gray-50 relative overflow-hidden">
                        {card.productImage ? (
                          <Image
                            src={card.productImage}
                            alt={card.productName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-medium text-gray-800 truncate leading-tight">
                          {card.productName}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {card.orderDate}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            {!selectedProduct && (
              <div className="relative mb-2">
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                    isSearchFocused
                      ? "border-primary/40 shadow-sm shadow-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <Search size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsSearchFocused(false), 200)
                    }
                    className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* Search Dropdown */}
                {searchResults.length > 0 && isSearchFocused && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                                rounded-xl shadow-lg shadow-black/5 overflow-hidden z-20 max-h-[240px] overflow-y-auto"
                  >
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => selectFromSearch(product)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 
                                   transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {product.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Manual ID Link */}
            {!selectedProduct && (
              <div className="ml-0.5">
                {!showManualInput ? (
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="text-xs text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Enter product ID manually
                  </button>
                ) : (
                  <div className="flex items-center gap-2 mt-1 animate-[fadeIn_0.2s_ease]">
                    <input
                      type="text"
                      placeholder="e.g. p1, p2..."
                      value={manualProductId}
                      onChange={(e) => setManualProductId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && selectByManualId()}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 
                                 outline-none focus:border-primary/40 transition-colors bg-white"
                    />
                    <button
                      onClick={selectByManualId}
                      disabled={!manualProductId.trim()}
                      className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg 
                                 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all"
                    >
                      Tag
                    </button>
                    <button
                      onClick={() => {
                        setShowManualInput(false);
                        setManualProductId("");
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="h-px bg-gray-100 mx-4" />

          {/* ──────────────────────────────────────────
              Section 3: Caption
          ────────────────────────────────────────── */}
          <section className="px-4 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Type size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Caption</h2>
            </div>

            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) =>
                  setCaption(e.target.value.slice(0, MAX_CAPTION))
                }
                placeholder="I wore this for..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 
                           bg-gray-50/80 rounded-xl border border-gray-200 outline-none 
                           focus:border-primary/40 focus:bg-white transition-all resize-none"
              />
              <span
                className={`absolute bottom-3 right-3 text-[11px] font-medium ${
                  caption.length >= MAX_CAPTION
                    ? "text-red-400"
                    : caption.length >= MAX_CAPTION * 0.85
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              >
                {caption.length}/{MAX_CAPTION}
              </span>
            </div>
          </section>

          <div className="h-px bg-gray-100 mx-4" />

          {/* ──────────────────────────────────────────
              Section 4: Tags (Optional)
          ────────────────────────────────────────── */}
          <section className="px-4 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Hash size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Tags</h2>
              <span className="text-[11px] text-gray-400">(optional)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Occasion Dropdown */}
              <div className="relative">
                <label className="text-[11px] text-gray-500 mb-1 block ml-0.5">
                  Occasion
                </label>
                <div className="relative">
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 text-sm text-gray-900 
                               bg-gray-50/80 rounded-xl border border-gray-200 outline-none 
                               focus:border-primary/40 focus:bg-white transition-all pr-8 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Draping Style Dropdown */}
              <div className="relative">
                <label className="text-[11px] text-gray-500 mb-1 block ml-0.5">
                  Draping Style
                </label>
                <div className="relative">
                  <select
                    value={drapingStyle}
                    onChange={(e) => setDrapingStyle(e.target.value)}
                    className="w-full appearance-none px-3 py-2.5 text-sm text-gray-900 
                               bg-gray-50/80 rounded-xl border border-gray-200 outline-none 
                               focus:border-primary/40 focus:bg-white transition-all pr-8 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    {DRAPING_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ──────────────────────────────────────────
            Section 5: Sticky Submit Button
        ────────────────────────────────────────── */}
        <div className="shrink-0 px-4 py-4 bg-white border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`w-full py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              canSubmit
                ? "bg-gradient-to-r from-primary to-primary/85 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Share to Studio
              </>
            )}
          </button>
          {!canSubmit && (
            <p className="text-center text-[11px] text-gray-400 mt-2">
              {!mediaFile && !selectedProduct
                ? "Upload media & tag a product to continue"
                : !mediaFile
                ? "Upload a photo or reel to continue"
                : "Tag a product to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
