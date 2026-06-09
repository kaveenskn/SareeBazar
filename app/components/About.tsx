"use client";

import { useState, useEffect } from "react";
import { Gem, Crown, Flower2, Sparkles } from "lucide-react";

export function About() {
  const [shopInfo, setShopInfo] = useState<{storeName: string} | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  const storeName = shopInfo?.storeName || "Saree Bazar";

  const cards = [
    {
      icon: <Gem size={18} className="text-white" strokeWidth={1.5} />,
      title: "Premium Handpicked Collections",
      desc: "Curated weaves from master artisans.",
    },
    {
      icon: <Crown size={18} className="text-white" strokeWidth={1.5} />,
      title: "Elegant Bridal & Party Wear",
      desc: "Statement pieces for milestone moments.",
    },
    {
      icon: <Flower2 size={18} className="text-white" strokeWidth={1.5} />,
      title: "Traditional Craftsmanship",
      desc: "Heritage techniques, generations refined.",
    },
    {
      icon: <Sparkles size={18} className="text-white" strokeWidth={1.5} />,
      title: "Modern Styles, Cultural Beauty",
      desc: "Contemporary drapes rooted in tradition.",
    },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 bg-[var(--background)] overflow-hidden">
      {/* Top text content */}
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center mb-16 md:mb-24 relative z-10">
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-8">
          Where Tradition Meets <br />
          <span className="text-primary font-bold">
            Timeless Elegance
          </span>
        </h2>
        <p className="text-lg md:text-[19px] font-medium leading-relaxed text-gray-700">
          At {storeName}, every saree tells a story of culture, grace, and craftsmanship.
          From festive collections to modern classics, we bring handpicked elegance to every woman&apos;s wardrobe.
        </p>
      </div>

      {/* Decorative Background Shape */}
      <div className="absolute left-0 top-[35%] w-full h-full z-0 opacity-40 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-primary/10 fill-current">
          <path d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,229.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <div className="w-full h-full bg-primary/10 -mt-1" />
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#fcfaf7] border border-black/[0.03] rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(161,0,91,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-start h-full"
            >
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center mb-4 shadow-md flex-shrink-0">
                {card.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed text-sm mt-auto">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
