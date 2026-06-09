"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Section } from "./Section";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const OFFER_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
];

export function Offers() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % OFFER_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section align="right" heightClass="h-[150vh]" topClass="top-[15%]">
      <div className="flex flex-col items-end w-full max-w-2xl px-4 space-y-8 text-right">
        {/* Title */}
        <motion.h2 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)] leading-tight"
        >
          Exclusive <span className="text-[#B88E52]">Offers</span>
        </motion.h2>

        {/* Portrait Image Slider */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-[3/4] w-full max-w-sm group overflow-hidden rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm"
        >
          <div className="absolute -inset-4 bg-[#B88E52]/10 rounded-[2rem] blur-2xl group-hover:bg-[#B88E52]/20 transition-all duration-500" />
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={OFFER_IMAGES[currentIndex]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt={`Saree Offer ${currentIndex + 1}`}
            />
          </AnimatePresence>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-6 right-6 flex gap-2 z-10">
            {OFFER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Premium Badge */}
          <div className="absolute top-6 left-6 bg-[#B88E52] text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest shadow-lg">
            LIMITED TIME
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-end"
        >
          <button className="px-10 py-4 font-semibold tracking-wide rounded-full transition-all duration-300 transform hover:-translate-y-1 bg-[#B88E52] hover:bg-[#8C6B3D] text-white shadow-[0_8px_30px_rgb(184,142,82,0.3)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.5)]">
            Explore Offers
          </button>
          <button className="px-10 py-4 font-semibold tracking-wide rounded-full transition-all duration-300 border-2 border-[#B88E52] text-[#B88E52] hover:bg-[#B88E52] hover:text-white">
            View Catalog
          </button>
        </motion.div>
      </div>
    </Section>
  );
}
