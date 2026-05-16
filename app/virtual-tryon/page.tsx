"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Sparkles, RefreshCw, Download, ChevronRight, ImageIcon, User, Wand2 } from "lucide-react";

type UploadState = {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
};

export default function VirtualTryOnPage() {
  const [saree, setSaree] = useState<UploadState>({ file: null, preview: null, isDragging: false });
  const [person, setPerson] = useState<UploadState>({ file: null, preview: null, isDragging: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasTriedOn, setHasTriedOn] = useState(false);

  const sareeRef = useRef<HTMLInputElement>(null);
  const personRef = useRef<HTMLInputElement>(null);

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

  const handleTryOn = () => {
    if (!saree.file || !person.file) return;
    setIsProcessing(true);
    setHasTriedOn(false);
    // Simulate AI processing
    setTimeout(() => {
      setResult(person.preview); // In production: replace with real API call result
      setIsProcessing(false);
      setHasTriedOn(true);
    }, 3000);
  };

  const handleReset = () => {
    setSaree({ file: null, preview: null, isDragging: false });
    setPerson({ file: null, preview: null, isDragging: false });
    setResult(null);
    setHasTriedOn(false);
  };

  const isReady = saree.file && person.file;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Decorative background blobs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #a1005b 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #a1005b 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.15em] uppercase mb-6"
            style={{ borderColor: "#a1005b", color: "#a1005b", backgroundColor: "rgba(161,0,91,0.05)" }}>
            <Sparkles size={12} />
            AI-Powered
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
            Virtual <span style={{ color: "#a1005b" }}>Try-On</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Upload a saree and your photo — our AI drapes it on you instantly. See how it looks before you buy.
          </p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs font-medium text-gray-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#a1005b" }}>1</span>
              Upload Saree
            </span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#a1005b" }}>2</span>
              Upload Your Photo
            </span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#a1005b" }}>3</span>
              See the Result
            </span>
          </div>
        </div>
      </section>

      {/* Main Try-On Area */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* === Column 1: Saree Upload === */}
          <UploadCard
            id="saree-upload"
            label="Saree Image"
            stepNumber={1}
            description="Upload any saree image from your gallery or catalogue"
            icon={<ImageIcon size={28} strokeWidth={1.2} />}
            state={saree}
            inputRef={sareeRef}
            onFileChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(setSaree, f);
            }}
            onDragOver={(e) => { e.preventDefault(); setSaree((p) => ({ ...p, isDragging: true })); }}
            onDragLeave={() => setSaree((p) => ({ ...p, isDragging: false }))}
            onDrop={(e) => handleDrop(setSaree, e)}
            onClear={() => setSaree({ file: null, preview: null, isDragging: false })}
            onBrowse={() => sareeRef.current?.click()}
            accentColor="#a1005b"
          />

          {/* === Column 2: Person Upload === */}
          <UploadCard
            id="person-upload"
            label="Your Photo"
            stepNumber={2}
            description="Upload a clear front-facing full-body photo of yourself"
            icon={<User size={28} strokeWidth={1.2} />}
            state={person}
            inputRef={personRef}
            onFileChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(setPerson, f);
            }}
            onDragOver={(e) => { e.preventDefault(); setPerson((p) => ({ ...p, isDragging: true })); }}
            onDragLeave={() => setPerson((p) => ({ ...p, isDragging: false }))}
            onDrop={(e) => handleDrop(setPerson, e)}
            onClear={() => setPerson({ file: null, preview: null, isDragging: false })}
            onBrowse={() => personRef.current?.click()}
            accentColor="#a1005b"
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

        {/* Info Note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Supports JPG, PNG, WebP · Max 10 MB per image · Your images are not stored
        </p>
      </section>

      {/* Tips Section */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-xl font-serif font-semibold text-gray-800 mb-10">Tips for Best Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "📸", title: "Full Body Photo", desc: "Use a clear, front-facing full-body photo with good lighting and a plain background." },
              { icon: "🥻", title: "Flat Saree Image", desc: "Upload an image of the saree laid flat or on a mannequin for best draping accuracy." },
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
    </main>
  );
}

/* ─────────────────────────────────────────────
   Upload Card Component
───────────────────────────────────────────── */
interface UploadCardProps {
  id: string;
  label: string;
  stepNumber: number;
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
}

function UploadCard({
  id, label, stepNumber, description, icon,
  state, inputRef, onFileChange, onDragOver, onDragLeave, onDrop,
  onClear, onBrowse, accentColor,
}: UploadCardProps) {
  const hasImage = !!state.preview;

  return (
    <div className="flex flex-col">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {stepNumber}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        id={id}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={!hasImage ? onBrowse : undefined}
        className="relative flex-1 rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer"
        style={{
          borderColor: state.isDragging ? accentColor : hasImage ? "#e5e7eb" : "#e5e7eb",
          backgroundColor: state.isDragging ? `rgba(161,0,91,0.03)` : hasImage ? "#f9fafb" : "#fafafa",
          minHeight: "280px",
        }}
      >
        {hasImage ? (
          /* Preview */
          <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
            <img
              src={state.preview!}
              alt={`${label} preview`}
              className="w-full h-full object-cover"
              style={{ minHeight: "280px", maxHeight: "360px" }}
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
            <p className="text-sm font-medium text-gray-700 mb-1">
              {state.isDragging ? "Drop to upload" : "Drag & drop here"}
            </p>
            <p className="text-xs text-gray-400 mb-5">or click to browse</p>
            <button
              id={`${id}-browse`}
              onClick={(e) => { e.stopPropagation(); onBrowse(); }}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: accentColor }}
            >
              Browse Files
            </button>
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
  return (
    <div className="flex flex-col">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          3
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">AI Result</p>
          <p className="text-[11px] text-gray-400 leading-tight">See how the saree looks on you</p>
        </div>
      </div>

      {/* Result Display */}
      <div
        className="relative flex-1 rounded-2xl border-2 border-gray-200 overflow-hidden transition-all duration-500"
        style={{
          minHeight: "280px",
          backgroundColor: "#fafafa",
          borderColor: hasTriedOn ? accentColor : "#e5e7eb",
          boxShadow: hasTriedOn ? `0 0 0 4px rgba(161,0,91,0.08)` : undefined,
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
              <p className="text-sm font-semibold text-gray-800 mb-1">AI is working its magic…</p>
              <p className="text-xs text-gray-400">Draping the saree on your photo</p>
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
          <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
            <img
              src={result}
              alt="Virtual try-on result"
              className="w-full h-full object-cover"
              style={{ minHeight: "280px", maxHeight: "360px" }}
            />
            {/* Result Badge */}
            <div
              className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
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
            {isReady ? (
              <>
                <p className="text-sm font-semibold text-gray-800 mb-1">Ready to try on!</p>
                <p className="text-xs text-gray-400">Click <strong style={{ color: accentColor }}>"Try It On"</strong> below</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-400 mb-1">Result will appear here</p>
                <p className="text-xs text-gray-300">Upload both images first</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
