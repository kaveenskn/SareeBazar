"use client";

import { useState, useEffect } from "react";
import { Gem, Crown, Flower2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  const [shopInfo, setShopInfo] = useState<{ storeName: string } | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  const storeName = shopInfo?.storeName || "Saree Bazar";

  const cards = [
    {
      icon: <Gem size={20} className="text-primary" strokeWidth={1.5} />,
      title: "Premium Collections",
      desc: "Curated weaves from master artisans.",
    },
    {
      icon: <Crown size={20} className="text-primary" strokeWidth={1.5} />,
      title: "Bridal & Party Wear",
      desc: "Statement pieces for milestone moments.",
    },
    {
      icon: <Flower2 size={20} className="text-primary" strokeWidth={1.5} />,
      title: "Traditional Craft",
      desc: "Heritage techniques, generations refined.",
    },
    {
      icon: <Sparkles size={20} className="text-primary" strokeWidth={1.5} />,
      title: "Modern Elegance",
      desc: "Contemporary drapes rooted in tradition.",
    },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 bg-[var(--background)] overflow-hidden z-20 pointer-events-auto">
      {/* Decorative Background Shape matching the screenshot's soft waves */}
      <div className="absolute bottom-0 left-0 w-full z-0 opacity-40 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-primary/5 fill-current">
          <path d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,192C1120,181,1280,139,1360,117.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
        
        {/* Top Text Content */}
        <div className="max-w-3xl text-center mb-16 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold mb-6 text-gray-900 leading-[1.1] tracking-tight"
          >
            Where Tradition <br className="hidden sm:block" /> Meets <br />
            <span className="text-primary font-bold">
              Timeless Elegance
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base md:text-lg lg:text-[19px] font-medium leading-relaxed text-gray-700 max-w-2xl mx-auto"
          >
            At {storeName}, every saree tells a story of culture, grace, and craftsmanship.
            From festive collections to modern classics, we bring handpicked elegance to every woman&apos;s wardrobe.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-black/[0.03] rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(161,0,91,0.08)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col items-center text-center h-full"
              >
                <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-all duration-300">
                  {card.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed mt-auto">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
