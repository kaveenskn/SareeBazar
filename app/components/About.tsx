"use client";

import { useState, useEffect } from "react";
import { Gem, Crown, Flower2, Sparkles } from "lucide-react";
import { Section } from "./Section";
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
    <Section align="center" heightClass="h-[150vh]" topClass="top-[20vh]">
      <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-[45%] text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-primary/20 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">
              Our Legacy
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)] leading-[1.1] tracking-tight"
          >
            Our <span className="text-primary">Heritage</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-[19px] font-medium leading-relaxed text-gray-800 drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)] mb-8 max-w-xl"
          >
            At {storeName}, every saree tells a story of culture, grace, and craftsmanship.
            From festive collections to modern classics, we bring handpicked elegance to every woman&apos;s wardrobe.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm tracking-wide rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(161,0,91,0.3)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.5)] transform hover:-translate-y-1"
          >
            Read Our Story
          </motion.button>
        </div>

        {/* Right Side: Cards Grid */}
        <div className="w-full lg:w-[55%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                className="group relative bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(161,0,91,0.15)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col items-start h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300">
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
    </Section>
  );
}
