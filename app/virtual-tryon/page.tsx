"use client";

import { useState, useRef, useCallback, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, RefreshCw, Download, ImageIcon, User, Wand2, Search, X, ChevronLeft, ChevronRight, LogIn, Maximize2 } from "lucide-react";
import { fetchAllProducts } from "@/lib/productApi";
import { products as staticProducts } from "@/mockdata/collections";
import type { Product } from "@/mockdata/collections";
import { useAuthGate } from "@/lib/useAuthGate";
import AuthGateModal from "@/app/components/AuthGate";
import toast from "react-hot-toast";

/* eslint-disable @next/next/no-img-element */

// Pre-computed try-on outputs
// Key format: "saree_name|color_name|user_filename_base" (all lower-case, normalized)
const SAMPLE_OUTPUTS: Array<{
  saree: string;
  color: string;
  user: string;
  output: string;
}> = [
  { saree: "aura pattu saree",  color: "medium orchid", user: "user1", output: "/Outputs/Aura Pattu Saree_Medium Orchid_user1.jfif" },
  { saree: "aura pattu saree",  color: "royal blue",    user: "user1", output: "/Outputs/Aura Pattu Saree_Royal Blue_user1.jfif" },
  { saree: "weavers rhythm",    color: "dark salmon",   user: "user2", output: "/Outputs/Weaver's Rhythm_Dark salmon_user2.jfif" },
];

/** Normalize a string for fuzzy matching: lowercase, strip apostrophes/quotes, collapse spaces */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''`]/g, "")   // strip apostrophes / curly quotes
    .replace(/[^a-z0-9 ]/g, " ") // replace other special chars with space
    .replace(/\s+/g, " ")    // collapse multiple spaces
    .trim();
}

type UploadState = {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
};

function VirtualTryOnContent() {
  const searchParams = useSearchParams();
  const { isLoggedIn, requireAuth, showGate, dismissGate, gateAction } = useAuthGate();
  const [saree, setSaree] = useState<UploadState>({ file: null, preview: null, isDragging: false });
  const [person, setPerson] = useState<UploadState>({ file: null, preview: null, isDragging: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasTriedOn, setHasTriedOn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSareeInfo, setSelectedSareeInfo] = useState<{ productName: string; colorName: string } | null>(null);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const personRef = useRef<HTMLInputElement>(null);

  // Load products
  useEffect(() => {
    setLoadingProducts(true);
    fetchAllProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setApiProducts(data);
        }
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoadingProducts(false);
      });
  }, []);

  // Merge products
  const products = useMemo(() => {
    if (apiProducts.length > 0) {
      const apiSlugs = new Set(apiProducts.map((p) => p.slug));
      const uniqueStatic = staticProducts.filter((p) => !apiSlugs.has(p.slug));
      return [...apiProducts, ...uniqueStatic];
    }
    return staticProducts;
  }, [apiProducts]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filtered products for modal
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(modalSearchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, modalSearchQuery, selectedCategory]);

  const selectSaree = (imgUrl: string, productName = "", colorName = "") => {
    if (!imgUrl) return;

    setSelectedSareeInfo({ productName, colorName });

    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const fileName = imgUrl.split("/").pop() || "saree.png";
        const file = new File([blob], fileName, { type: blob.type });
        const reader = new FileReader();
        reader.onload = (e) => {
          setSaree({
            file,
            preview: e.target?.result as string,
            isDragging: false,
          });
        };
        reader.readAsDataURL(file);
      })
      .catch((err) => {
        console.error("Failed to load saree image from collection:", err);
        setSaree({
          file: null,
          preview: imgUrl,
          isDragging: false,
        });
      });

    setIsCollectionModalOpen(false);
  };

  /* ─── Auto-load saree image from query param ─── */
  useEffect(() => {
    const sareeParam = searchParams.get("saree");
    if (sareeParam && !saree.preview) {
      // Fetch the image and convert to a File object for consistency
      fetch(sareeParam)
        .then((res) => res.blob())
        .then((blob) => {
          const fileName = sareeParam.split("/").pop() || "saree.png";
          const file = new File([blob], fileName, { type: blob.type });
          const reader = new FileReader();
          reader.onload = (e) => {
            setSaree({
              file,
              preview: e.target?.result as string,
              isDragging: false,
            });
          };
          reader.readAsDataURL(file);
        })
        .catch((err) => {
          console.error("Failed to load saree image from URL:", err);
        });
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = useCallback(
    (setter: React.Dispatch<React.SetStateAction<UploadState>>, file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setter((prev) => ({
          ...prev,
          file,
          preview: e.target?.result as string,
          isDragging: false,
        }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback(
    (setter: React.Dispatch<React.SetStateAction<UploadState>>, e: React.DragEvent) => {
      e.preventDefault();
      setter((prev) => ({ ...prev, isDragging: false }));
      const file = e.dataTransfer.files[0];
      if (file) handleFile(setter, file);
    },
    [handleFile]
  );

  /* ── Auth-gated wrappers for person upload ── */
  const gatedPersonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requireAuth("upload your photo for virtual try-on")) return;
    const f = e.target.files?.[0];
    if (f) handleFile(setPerson, f);
  };
  const gatedPersonDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!requireAuth("upload your photo for virtual try-on")) return;
    handleDrop(setPerson, e);
  };
  const gatedPersonBrowse = () => {
    if (!requireAuth("upload your photo for virtual try-on")) return;
    personRef.current?.click();
  };

  const handleTryOn = async () => {
    if (!requireAuth("use the virtual try-on feature")) return;
    if (!saree.preview || !person.preview) return;
    setIsProcessing(true);
    setHasTriedOn(false);
    setResult(null);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      if (!selectedSareeInfo) {
        // Saree was loaded via URL param without collection modal — no sample available
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setErrorMessage("Please select a saree from the collection to use the try-on feature.");
        return;
      }

      const userBase = person.file
        ? normalize(person.file.name.replace(/\.[^.]+$/, ""))
        : "";
      const sareeNorm = normalize(selectedSareeInfo.productName);
      const colorNorm = normalize(selectedSareeInfo.colorName);

      console.log("[VirtualTryOn] Lookup:", { sareeNorm, colorNorm, userBase });

      // Step 1: Find all outputs where saree name and user filename base both match
      const sareeUserCandidates = SAMPLE_OUTPUTS.filter((entry) => {
        const sareeMatch =
          sareeNorm.includes(entry.saree) || entry.saree.includes(sareeNorm);
        const userMatch =
          userBase === entry.user ||
          userBase.startsWith(entry.user) ||
          entry.user.startsWith(userBase);
        return sareeMatch && userMatch;
      });

      let match = undefined;

      if (sareeUserCandidates.length === 1) {
        match = sareeUserCandidates[0];
        console.log("[VirtualTryOn] Single match:", match.output);
      } else if (sareeUserCandidates.length > 1) {
        // Multiple outputs — pick by color
        match = sareeUserCandidates.find((entry) => {
          const entryColor = normalize(entry.color);
          return (
            colorNorm === entryColor ||
            colorNorm.includes(entryColor) ||
            entryColor.includes(colorNorm)
          );
        }) ?? sareeUserCandidates[0]; // fallback to first if color not matched
        console.log("[VirtualTryOn] Multi-match resolved:", match?.output);
      }

      if (match) {
        // Simulate AI processing (7–10 s)
        const delay = 7000 + Math.random() * 3000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        setResult(match.output);
        setHasTriedOn(true);
        setStatusMessage("✅ Done! Click Download to save.");
      } else {
        // No pre-computed output for this saree/user combination
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setErrorMessage(
          "No preview available for this combination yet. Try with one of the featured sarees."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSaree({ file: null, preview: null, isDragging: false });
    setPerson({ file: null, preview: null, isDragging: false });
    setResult(null);
    setHasTriedOn(false);
    setStatusMessage(null);
    setErrorMessage(null);
    setSelectedSareeInfo(null);
  };

  const isReady = !!saree.preview && !!person.preview;

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/virtual-tryon-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Hero Banner */}
      <section className="relative pt-[100px] pb-16 overflow-hidden z-10">

        <div className="max-w-5xl mx-auto px-6 text-center relative">


          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
            Virtual <span style={{ color: "#a1005b" }}>Try-On</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Choose a saree from our collection and upload your photo — our AI drapes it on you instantly. See how it looks before you buy.
          </p>

          {/* Guest banner */}
          {!isLoggedIn && (
            <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a1005b]/5 border border-[#a1005b]/15 text-sm text-[#a1005b] font-medium animate-[fadeIn_0.4s_ease]">
              <LogIn size={15} />
              Sign in to try on sarees virtually
            </div>
          )}
        </div>
      </section>

      {/* Main Try-On Area */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* === Column 1: Saree Selection === */}
          <SareeCard
            id="saree-select"
            label="Saree Image"
            state={saree}
            onClear={() => setSaree({ file: null, preview: null, isDragging: false })}
            onChooseFromCollection={() => setIsCollectionModalOpen(true)}
            accentColor="#a1005b"
          />

          {/* === Column 2: Person Upload (gated) === */}
          <UploadCard
            id="person-upload"
            label="Your Photo"
            description="Upload a clear front-facing full-body photo of yourself"
            icon={<User size={28} strokeWidth={1.2} />}
            state={person}
            inputRef={personRef}
            onFileChange={gatedPersonFileChange}
            onDragOver={(e) => { e.preventDefault(); setPerson((p) => ({ ...p, isDragging: true })); }}
            onDragLeave={() => setPerson((p) => ({ ...p, isDragging: false }))}
            onDrop={gatedPersonDrop}
            onClear={() => setPerson({ file: null, preview: null, isDragging: false })}
            onBrowse={gatedPersonBrowse}
            accentColor="#a1005b"
            locked={!isLoggedIn}
          />

          {/* === Column 3: Result === */}
          <ResultCard
            isReady={!!isReady}
            isProcessing={isProcessing}
            hasTriedOn={hasTriedOn}
            result={result}
            accentColor="#a1005b"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="try-on-btn"
            onClick={handleTryOn}
            disabled={!isReady || isProcessing}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: "#a1005b", boxShadow: isReady && !isProcessing ? "0 8px 30px rgba(161,0,91,0.3)" : undefined }}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Wand2 size={17} />
                Try It On
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </>
            )}
          </button>

          {(saree.file || person.file || result) && (
            <button
              id="reset-btn"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all duration-200"
            >
              <RefreshCw size={15} />
              Start Over
            </button>
          )}

          {result && (
            <a
              id="download-btn"
              href={result}
              download="virtual-tryon-result.jpg"
              className="flex items-center gap-2 px-6 py-4 rounded-full text-sm font-medium border transition-all duration-200"
              style={{ borderColor: "#a1005b", color: "#a1005b" }}
            >
              <Download size={15} />
              Download Result
            </a>
          )}
        </div>

        {/* Status / Error Messages */}
        {statusMessage && (
          <p className="text-center text-sm font-medium mt-4" style={{ color: "#a1005b" }}>
            {statusMessage}
          </p>
        )}
        {errorMessage && (
          <div className="max-w-lg mx-auto mt-4 p-4 rounded-xl border border-red-200 bg-red-50 text-center">
            <p className="text-sm text-red-700 font-medium">⚠️ {errorMessage}</p>
          </div>
        )}

        {/* Info Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Supports JPG, PNG, WebP · Max 10 MB per image · Your images are not stored · 3 Images per Day
        </p>
      </section>

      {/* Tips Section */}
      <section className="border-t border-gray-100 py-16" style={{ backgroundColor: "#f9f2f5" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-xl font-serif font-semibold text-gray-800 mb-10">Tips for Best Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "📸", title: "Full Body Photo", desc: "Use a clear, front-facing full-body photo with good lighting and a plain background." },
              { icon: "🥻", title: "Saree Selection", desc: "Choose a saree from our collections that drapes beautifully on you." },
              { icon: "💡", title: "Good Lighting", desc: "Ensure both images are well-lit without harsh shadows for realistic results." },
            ].map((tip) => (
              <div key={tip.title} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Gate Modal */}
      <AuthGateModal show={showGate} onDismiss={dismissGate} action={gateAction} />

      {/* Collection Selector Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900">Choose from Collection</h3>
                <p className="text-xs text-gray-500">Select a saree to try on virtually</p>
              </div>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="Search sarees..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#a1005b] focus:ring-1 focus:ring-[#a1005b] transition-all"
                />
                {modalSearchQuery && (
                  <button
                    onClick={() => setModalSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                      ? "bg-[#a1005b] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of sarees */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[#a1005b]/20 border-t-[#a1005b] rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-500">Loading collection...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-base text-gray-500 font-medium">No sarees found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search or category filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredProducts.map((prod) => (
                    <ModalProductCard
                      key={prod.slug}
                      product={prod}
                      onSelect={(imgUrl, productName, colorName) =>
                        selectSaree(imgUrl, productName, colorName)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────
   Saree Collection Card Component
───────────────────────────────────────────── */
interface SareeCardProps {
  id: string;
  label: string;
  state: UploadState;
  onClear: () => void;
  onChooseFromCollection: () => void;
  accentColor: string;
}

function SareeCard({
  id, label, state, onClear, onChooseFromCollection, accentColor,
}: SareeCardProps) {
  const hasImage = !!state.preview;

  return (
    <div className="flex flex-col h-full">
      <div
        id={id}
        onClick={!hasImage ? onChooseFromCollection : undefined}
        className="group relative flex-1 rounded-2xl border-2 transition-all duration-300 ease-out overflow-hidden cursor-pointer hover:-translate-y-4 hover:scale-[1.02] hover:border-[#a1005b]"
        style={{
          borderColor: hasImage ? "transparent" : "#e5e7eb",
          backgroundColor: hasImage ? "#ffffff" : "#fdf9fa",
          minHeight: "320px",
          boxShadow: hasImage
            ? "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px -8px rgba(0,0,0,0.14)"
            : "0 2px 4px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.06), 0 20px 40px -8px rgba(0,0,0,0.10)",
        }}
      >
        {hasImage ? (
          /* Preview */
          <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
            <img
              src={state.preview!}
              alt={`${label} preview`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              style={{ minHeight: "320px", maxHeight: "400px" }}
            />
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-all duration-200 flex items-end justify-between p-4 group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChooseFromCollection();
                }}
                className="opacity-0 group-hover:opacity-100 px-3.5 py-1.5 bg-white text-gray-900 rounded-full text-xs font-semibold hover:bg-gray-100 transition-all shadow-md"
              >
                Change Saree
              </button>
              <button
                id={`${id}-clear`}
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="opacity-0 group-hover:opacity-100 text-white bg-red-500 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold transition-all shadow-md"
              >
                ✕
              </button>
            </div>
            {/* Selected Saree Badge */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              ✓ Selected Saree
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors"
              style={{ backgroundColor: "rgba(161,0,91,0.07)", color: accentColor }}
            >
              <ImageIcon size={28} strokeWidth={1.2} />
            </div>
            <p className="text-2xl font-serif font-bold text-gray-900 mb-2">
              {label}
            </p>
            <p className="text-sm text-gray-500 mb-6 px-2 leading-relaxed">
              Choose a premium saree from our exclusive collection for try-on
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); onChooseFromCollection(); }}
              className="px-6 py-3 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              Choose from Collection
            </button>
          </div>
        )}

        {/* Reflection Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Upload Card Component
───────────────────────────────────────────── */
interface UploadCardProps {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  state: UploadState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
  onBrowse: () => void;
  accentColor: string;
  locked?: boolean;
}

function UploadCard({
  id, label, description, icon,
  state, inputRef, onFileChange, onDragOver, onDragLeave, onDrop,
  onClear, onBrowse, accentColor, locked,
}: UploadCardProps) {
  const hasImage = !!state.preview;

  return (
    <div className="flex flex-col h-full">
      {/* Drop Zone */}
      <div
        id={id}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={!hasImage ? onBrowse : undefined}
        className="group relative flex-1 rounded-2xl border-2 transition-all duration-300 ease-out overflow-hidden cursor-pointer hover:-translate-y-4 hover:scale-[1.02] hover:border-[#a1005b]"
        style={{
          borderColor: state.isDragging ? accentColor : hasImage ? "transparent" : "#e5e7eb",
          backgroundColor: state.isDragging ? `rgba(161,0,91,0.03)` : hasImage ? "#ffffff" : "#fdf9fa",
          minHeight: "320px",
          boxShadow: hasImage
            ? "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px -8px rgba(0,0,0,0.14)"
            : "0 2px 4px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.06), 0 20px 40px -8px rgba(0,0,0,0.10)",
        }}
      >
        {hasImage ? (
          /* Preview */
          <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
            <img
              src={state.preview!}
              alt={`${label} preview`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              style={{ minHeight: "320px", maxHeight: "400px" }}
            />
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-200 flex items-end justify-between p-3 group">
              <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] font-medium bg-black/50 px-2 py-1 rounded-full transition-opacity">
                {state.file?.name}
              </span>
              <button
                id={`${id}-clear`}
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="opacity-0 group-hover:opacity-100 text-white bg-red-500 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>
            {/* Uploaded Badge */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: accentColor }}
            >
              ✓ Uploaded
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors"
              style={{ backgroundColor: state.isDragging ? `rgba(161,0,91,0.12)` : "rgba(161,0,91,0.07)", color: accentColor }}
            >
              {icon}
            </div>
            <p className="text-2xl font-serif font-bold text-gray-900 mb-2">
              {label}
            </p>
            <p className="text-sm text-gray-500 mb-4 px-2 leading-relaxed">
              {description}
            </p>
            {locked ? (
              <>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#a1005b]/5 border border-[#a1005b]/15 text-[11px] font-medium text-[#a1005b] mb-3">
                  <LogIn size={12} />
                  Sign in required
                </div>
                <button
                  id={`${id}-browse`}
                  onClick={(e) => { e.stopPropagation(); onBrowse(); }}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: accentColor }}
                >
                  Sign In & Upload
                </button>
              </>
            ) : (
              <>
                <p className="text-[11px] font-medium text-gray-400 mb-4 uppercase tracking-wider">
                  {state.isDragging ? "Drop to upload" : "Drag & drop or"}
                </p>
                <button
                  id={`${id}-browse`}
                  onClick={(e) => { e.stopPropagation(); onBrowse(); }}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: accentColor }}
                >
                  Browse Files
                </button>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          id={`${id}-input`}
        />

        {/* Reflection Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Result Card Component
───────────────────────────────────────────── */
interface ResultCardProps {
  isReady: boolean;
  isProcessing: boolean;
  hasTriedOn: boolean;
  result: string | null;
  accentColor: string;
}

function ResultCard({ isReady, isProcessing, hasTriedOn, result, accentColor }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Result Display */}
        <div
          className="group relative flex-1 rounded-2xl border-2 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-[1.02] hover:border-[#a1005b]"
          style={{
            minHeight: "320px",
            backgroundColor: "#ffffff",
            borderColor: hasTriedOn ? "transparent" : "#e5e7eb",
            boxShadow: hasTriedOn
              ? "0 2px 4px rgba(161,0,91,0.06), 0 8px 16px rgba(161,0,91,0.10), 0 24px 48px -8px rgba(161,0,91,0.18)"
              : "0 2px 4px rgba(0,0,0,0.04), 0 6px 12px rgba(0,0,0,0.06), 0 20px 40px -8px rgba(0,0,0,0.10)",
          }}
        >
          {isProcessing ? (
            /* Processing State */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full border-[3px] border-t-transparent animate-spin"
                  style={{ borderColor: `${accentColor}30`, borderTopColor: accentColor }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={18} style={{ color: accentColor }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gray-900 mb-2">Loading...</p>
                <p className="text-sm text-gray-500">Generating</p>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: accentColor, animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          ) : result ? (
            /* Result Image */
            <div className="relative w-full h-full group/img" style={{ minHeight: "320px" }}>
              <img
                src={result}
                alt="Virtual try-on result"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                style={{ minHeight: "320px", maxHeight: "400px" }}
              />
              
              {/* Expand Button Overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100 z-10">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold text-sm shadow-xl hover:scale-105 transition-transform"
                >
                  <Maximize2 size={16} />
                  View Full Image
                </button>
              </div>

              {/* Result Badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white shadow-sm z-20"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles size={10} />
                AI Result
              </div>
            </div>
          ) : (
            /* Empty / Waiting State */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(161,0,91,0.07)" }}
              >
                <Wand2 size={26} strokeWidth={1.2} style={{ color: isReady ? accentColor : "#d1d5db" }} />
              </div>
              <p className="text-2xl font-serif font-bold text-gray-900 mb-2">AI Result</p>
              <p className="text-sm text-gray-500 mb-5 px-2 leading-relaxed">
                See how the saree looks on you
              </p>

              {isReady ? (
                <>
                  <p className="text-xs font-medium text-gray-600 mb-1">Ready to try on!</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Click <strong style={{ color: accentColor }}>&quot;Try It On&quot;</strong> below</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-gray-400 mb-1">Result will appear here</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-wider">Upload both images first</p>
                </>
              )}
            </div>
          )}

          {/* Reflection Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-bl from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Fullscreen Expanded Modal */}
      {isExpanded && result && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 animate-[fadeIn_0.3s_ease]">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="relative w-full max-w-4xl max-h-full flex flex-col items-center justify-center">
            <img
              src={result}
              alt="Expanded try-on result"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-6">
              <a
                href={result}
                download="virtual-tryon-result.jpg"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#a1005b] text-white hover:bg-[#a1005b]/90 transition-colors shadow-lg"
              >
                <Download size={16} />
                Download Result
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Modal Product Card (with Carousel)
───────────────────────────────────────────── */
function ModalProductCard({ product, onSelect }: { product: Product, onSelect: (imgUrl: string, productName: string, colorName: string) => void }) {
  const [hovered, setHovered] = useState(false);

  const images = useMemo(() => {
    const mainImage = product.image && product.image.trim() !== "" ? [product.image] : [];
    const extraImages = (product.images || []).filter(
      (img) => img && img.trim() !== "" && img !== product.image
    );
    return [...mainImage, ...extraImages];
  }, [product.images, product.image]);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hovered && images.length > 1 && isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
      }, 2000);
    } else if (!hovered) {
      setCurrentImageIdx(0);
      setIsAutoPlaying(true);
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

  const currentImageSrc = images.length > 0 ? images[currentImageIdx] : null;

  return (
    <div
      onClick={() => {
        if (!currentImageSrc) return;
        // 1. Try exact image URL match against colorVariants
        let colorName =
          product.colorVariants?.find((cv) => cv.image === currentImageSrc)?.name;
        // 2. Fallback: match by index (colorVariants[currentImageIdx])
        if (!colorName && product.colorVariants && product.colorVariants[currentImageIdx]) {
          colorName = product.colorVariants[currentImageIdx].name;
        }
        // 3. Fallback: product.color field
        if (!colorName) colorName = product.color || "";

        console.log("[VirtualTryOn] Saree selected:", product.name, "| Color:", colorName, "| img idx:", currentImageIdx);
        onSelect(currentImageSrc, product.name, colorName);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer bg-white border border-gray-100 rounded-2xl p-2.5 hover:shadow-md hover:border-[#a1005b]/30 transition-all duration-200 flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-50 mb-3">
        {currentImageSrc ? (
          <>
            <img
              src={currentImageSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Carousel manual controls */}
            {hovered && images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-md p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10 shadow-sm border border-white/40"
                >
                  <ChevronLeft size={16} className="text-[#a1005b]" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-md p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white z-10 shadow-sm border border-white/40"
                >
                  <ChevronRight size={16} className="text-[#a1005b]" />
                </button>

                {/* Carousel dots */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all ${idx === currentImageIdx ? "w-2.5 bg-[#a1005b]" : "w-1.5 bg-white/70"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Try on this color button overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div className="w-full py-1.5 bg-[#a1005b]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider text-center rounded-lg shadow-sm">
                Try this color
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 bg-gray-100">
            No Image
          </div>
        )}
      </div>
      <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-tight mb-1">
        {product.name}
      </h4>
      <p className="text-[10px] text-gray-500 mt-auto">{product.category}</p>
    </div>
  );
}

export default function VirtualTryOnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading…</div>}>
      <VirtualTryOnContent />
    </Suspense>
  );
}
