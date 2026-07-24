"use client";

import { useState, useEffect } from "react";
import { Section } from "./Section";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Users, ShieldCheck, Star, Flower2, Truck, Headset, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.1, staggerDirection: 1, when: "afterChildren" },
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -80,
    scale: 0.95,
    filter: "blur(12px)",
    transition: { duration: 2.2, ease: "easeInOut" as const }
  }
};

const letterContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
  exit: {
    opacity: 1,
    transition: { staggerChildren: 0.04, staggerDirection: 1 },
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.8, type: "spring" as const, stiffness: 100, damping: 12 },
  },
  exit: {
    opacity: 0,
    y: -60,
    filter: "blur(12px)",
    scale: 0.85,
    transition: { duration: 2.0, ease: "easeInOut" as const },
  },
};

const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.span
      variants={letterContainerVariants}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              variants={letterVariants}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex !== words.length - 1 && <span style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
};

export function Hero() {
  const [shopInfo, setShopInfo] = useState<{storeName: string, description: string} | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storeName = shopInfo?.storeName || "Saree Bazar";
  const firstName = storeName.includes(" ") ? storeName.split(" ")[0] : "Saree";
  const secondName = storeName.includes(" ") ? storeName.split(" ").slice(1).join(" ") : "Bazar";
  
  return (
    <Section align="left" heightClass="h-[150vh]" isFirst={true} topClass="top-[140px]">
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            key="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl text-left -ml-2 sm:-ml-6 md:-ml-10 lg:-ml-16 relative"
          >
            {/* White shadow-like gradient behind the content */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.8 } },
                exit: { opacity: 0, transition: { duration: 0.4 } }
              }}
              className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[160%] h-[130%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.75)_35%,rgba(255,255,255,0)_65%)] blur-2xl -z-10 rounded-[100%] pointer-events-none" 
            />

            <h1 
              className="text-6xl md:text-8xl tracking-tighter mb-4 drop-shadow-sm"
              style={{ fontFamily: 'var(--font-rounded)', fontWeight: 800 }}
            >
              <AnimatedText text={firstName} className="text-primary" />{" "}
              <AnimatedText text={secondName} className="text-[#1a2b4c]" />
            </h1>

            {/* Decorative divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 w-full max-w-[280px] mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#cba358]"></div>
              <div className="text-[#cba358] rotate-45 w-1.5 h-1.5 border border-[#cba358]"></div>
              <div className="text-[#cba358] rotate-45 w-2.5 h-2.5 border border-[#cba358] mx-0.5 bg-[#cba358]/20"></div>
              <div className="text-[#cba358] rotate-45 w-1.5 h-1.5 border border-[#cba358]"></div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#cba358]"></div>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-2xl md:text-[28px] lg:text-[32px] font-serif text-[#1a2b4c] mb-4 font-medium tracking-wide drop-shadow-sm">
              Timeless Tradition. Contemporary You.
            </motion.h2>

            <motion.p variants={itemVariants} className="text-[15px] md:text-[17px] text-gray-700 max-w-xl mb-8 leading-relaxed font-medium">
              Discover an exquisite range of bridal, silk, and designer sarees crafted to celebrate every moment in style.
            </motion.p>

            {/* Mini features */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:flex md:items-center gap-y-6 gap-x-0 md:gap-8 divide-x-0 md:divide-x divide-gray-300/60 mb-10 max-w-full">
              <div className="flex flex-col items-center justify-center text-center pr-2 md:pr-0">
                <Flower2 className="text-primary mb-1.5" size={24} strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-gray-900 leading-tight">Premium Quality</span>
                <span className="text-[11px] text-gray-500">Finest Fabrics</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center pl-2 border-l border-gray-300/60 md:border-l-0 md:pl-8">
                <ShieldCheck className="text-primary mb-1.5" size={24} strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-gray-900 leading-tight">Authentic Designs</span>
                <span className="text-[11px] text-gray-500">Handpicked Collections</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center pr-2 md:pl-8 md:pr-0">
                <Truck className="text-primary mb-1.5" size={24} strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-gray-900 leading-tight">Secure Delivery</span>
                <span className="text-[11px] text-gray-500">Across Sri Lanka</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center pl-2 border-l border-gray-300/60 md:border-l-0 md:pl-8">
                <Headset className="text-primary mb-1.5" size={24} strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-gray-900 leading-tight">Dedicated Support</span>
                <span className="text-[11px] text-gray-500">We're Here to Help</span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link href="/collections" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(161,0,91,0.3)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.5)] transform hover:-translate-y-1">
                  Explore Collection <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/virtual-tryon" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] bg-white/60 hover:bg-white/90 backdrop-blur-sm text-primary border border-primary/20 font-bold tracking-wide rounded-full transition-all duration-300 transform hover:-translate-y-1">
                  <PlayCircle size={18} /> Virtual Try-On
                </button>
              </Link>
            </motion.div>


          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
