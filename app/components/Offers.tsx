"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Section } from "./Section";

const slides = [
  {
    src: "/images/offers/offer_saree_1.png",
    label: "Kanjivaram Silk",
    badge: "40% OFF",
    color: "#B88E52",
  },
  {
    src: "/images/offers/offer_saree_2.png",
    label: "Banarasi Elegance",
    badge: "35% OFF",
    color: "#5B7FBE",
  },
  {
    src: "/images/offers/offer_saree_3.png",
    label: "Chanderi Collection",
    badge: "30% OFF",
    color: "#4A7C59",
  },
];

export function Offers() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        setDirection(1);
        return (prev + 1) % slides.length;
      });
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDot = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(idx, idx > current ? 1 : -1);
    startTimer();
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <Section align="center" heightClass="h-[140vh]" topClass="top-[calc(40%-200px)]">
      {/* Two-column layout */}
      <div className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">

{/* LEFT — Text Content */}
<div className="flex-1 min-w-0 flex flex-col items-center text-center">
  {/* Tag pill */}
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B88E52]/15 border border-[#B88E52]/30 mb-5">
    <span className="w-2 h-2 rounded-full bg-[#B88E52] animate-pulse" />
    <span className="text-sm font-semibold text-[#B88E52] tracking-widest uppercase">
      Limited Time
    </span>
  </div>

  <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)]">
    Exclusive{" "}
    <span className="text-[#B88E52] relative">
      Offers
      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#B88E52] to-transparent rounded-full" />
    </span>
  </h2>

  <p className="text-lg font-medium leading-relaxed mb-8 text-gray-700 max-w-2xl drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)]">
    Embrace the season&apos;s joy with up to{" "}
    <span className="text-[#B88E52] font-bold">40% off</span> on our
    premium silk and handcrafted collections. Elevate your wardrobe with
    the magic of rich textures and vibrant hues.
  </p>

  {/* Feature pills */}
  <div className="flex flex-wrap justify-center gap-3 mb-10">
    {["Free Shipping", "Easy Returns", "Authentic Weaves"].map((tag) => (
      <span
        key={tag}
        className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/70 border border-gray-200 text-gray-700 shadow-sm backdrop-blur-sm"
      >
        {tag}
      </span>
    ))}
  </div>

  <button className="px-10 py-4 font-semibold tracking-wide rounded-full transition-all duration-300 transform hover:-translate-y-1 bg-[#B88E52] hover:bg-[#8C6B3D] text-white shadow-[0_8px_30px_rgb(184,142,82,0.35)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.55)]">
    Explore Offers
  </button>
</div>

        {/* RIGHT — Image Slider */}
        <div className="flex-shrink-0 w-full md:w-[340px] lg:w-[400px]">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.20)]">

            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-[#B88E52]/60 rounded-tl-xl z-10 pointer-events-none" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-[#B88E52]/60 rounded-tr-xl z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-[#B88E52]/60 rounded-bl-xl z-10 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#B88E52]/60 rounded-br-xl z-10 pointer-events-none" />

            {/* Slides */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current].src}
                  alt={slides[current].label}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge */}
                <div
                  className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: slides[current].color }}
                >
                  {slides[current].badge}
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 pt-4">
                  <p className="text-white font-semibold text-lg tracking-wide">
                    {slides[current].label}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDot(idx)}
                  className="transition-all duration-300"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${idx === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50"
                      }`}
                  />
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
              <motion.div
                key={`progress-${current}`}
                className="h-full bg-[#B88E52]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "linear" }}
              />
            </div>
          </div>

        </div>

      </div>
    </Section>
  );
}
