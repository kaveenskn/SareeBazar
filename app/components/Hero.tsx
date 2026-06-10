"use client";

import { useState, useEffect } from "react";
import { Section } from "./Section";
import { motion, AnimatePresence } from "framer-motion";

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
  const description = shopInfo?.description || "Explore bridal, silk, and designer sarees that blend traditional beauty with contemporary fashion and elegance.";

  return (
    <Section align="left" heightClass="h-[150vh]" isFirst={true} topClass="top-[200px]">
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            key="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-xl text-left -ml-2 sm:-ml-6 md:-ml-10 lg:-ml-16 relative"
          >
            {/* White shadow-like gradient behind the content */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.8 } },
                exit: { opacity: 0, transition: { duration: 0.4 } }
              }}
              className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[220%] h-[160%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_80%)] blur-3xl -z-10 rounded-[100%] pointer-events-none" 
            />

            <h1 
              className="text-6xl md:text-8xl tracking-tighter mb-6 drop-shadow-md"
              style={{ fontFamily: 'var(--font-rounded)', fontWeight: 800, WebkitTextStroke: '1.5px currentColor' }}
            >
              <AnimatedText text={firstName} className="text-primary" />{" "}
              <AnimatedText text={secondName} className="text-gray-900" />
            </h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl font-semibold leading-relaxed text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
              {description}
            </motion.p>

            <motion.div variants={itemVariants}>
              <button className="mt-8 px-8 py-3.5 text-[15px] bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(161,0,91,0.3)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.5)] transform hover:-translate-y-1">
                Explore Collection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
