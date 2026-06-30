"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Section } from "./Section";
import { fetchSaleProducts } from "@/lib/productApi";
import type { Product } from "@/mockdata/collections";

/* ── Default static slides (fallback when no Sale products exist) ── */
const defaultSlides = [
  {
    src: "/images/offers/offer_saree_1.png",
    label: "Kanjivaram Silk",
    badge: "40% OFF",
    color: "#B88E52",
    link: "/collections",
  },
  {
    src: "/images/offers/offer_saree_2.png",
    label: "Banarasi Elegance",
    badge: "35% OFF",
    color: "#5B7FBE",
    link: "/collections",
  },
  {
    src: "/images/offers/offer_saree_3.png",
    label: "Chanderi Collection",
    badge: "30% OFF",
    color: "#4A7C59",
    link: "/collections",
  },
];

interface OfferSlide {
  src: string;
  label: string;
  badge: string;
  color: string;
  link: string;
}

/* ── Convert a Sale-status product into an offer slide ── */
function productToSlide(product: Product): OfferSlide {
  const discount = product.discountPercent || 0;

  // Pick a color accent based on category
  const colorMap: Record<string, string> = {
    "Silk Sarees": "#B88E52",
    "Cotton Sarees": "#4A7C59",
    "Handloom": "#5B7FBE",
    "Bridal": "#A0153E",
    "Daily Wear": "#6B8E23",
    "Georgette": "#9370DB",
    "Designer": "#D93097",
    "Party Wear": "#FF6347",
  };

  let safeImage = product.image;
  // If the image is a local blob from the admin panel, it won't work in the user app
  if (!safeImage || safeImage.startsWith("blob:")) {
    safeImage = "/images/offers/offer_saree_1.png";
  }

  return {
    src: safeImage,
    label: product.name,
    badge: discount > 0 ? `${discount}% OFF` : "SALE",
    color: colorMap[product.category] || "#B88E52",
    link: `/products/${product.slug}`,
  };
}

export function Offers() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [slides, setSlides] = useState<OfferSlide[]>(defaultSlides);

  // Fetch Sale products from the backend
  useEffect(() => {
    fetchSaleProducts().then((saleProducts) => {
      if (saleProducts.length > 0) {
        const saleSlides = saleProducts.map(productToSlide);
        // Combine sale products with defaults for a richer carousel
        setSlides([...saleSlides, ...defaultSlides.slice(0, Math.max(0, 3 - saleSlides.length))]);
      }
    });
  }, []);

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
  }, [slides.length]);

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

  // Guard against empty slides
  const activeSlide = slides[current] || slides[0];

  return (
    <Section id="offers" align="center" heightClass="h-[150vh]" topClass="top-[10vh] md:top-[12vh]">
      {/* Two-column layout */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">

{/* LEFT — Text Content */}
<div className="w-full md:w-[50%] lg:w-[55%] flex flex-col items-start text-left">
  {/* Tag pill */}
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-3">
    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
    <span className="text-sm font-semibold text-primary tracking-widest">
      Limited Time
    </span>
  </div>

  <h2 className="text-5xl md:text-[5rem] lg:text-[6.5rem] font-serif font-bold mb-4 text-gray-900 leading-[1.05] tracking-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)]">
    Today&apos;s{" "}
    <span className="text-primary relative inline-block">
      Offers
      <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
    </span>
  </h2>

  <p className="text-base md:text-[18px] lg:text-[19px] font-normal leading-relaxed mb-6 text-gray-700 max-w-2xl drop-shadow-[0_2px_15px_rgba(255,255,255,0.9)]">
    Embrace the season&apos;s joy with up to{" "}
    <span className="text-primary font-bold">40% off</span> on our
    premium silk and handcrafted collections. Elevate your wardrobe with
    the magic of rich textures and vibrant hues.
  </p>

  {/* Feature pills */}
  <div className="flex flex-wrap justify-start gap-3 mb-6">
    {["Free Shipping", "Easy Returns", "Authentic Weaves"].map((tag) => (
      <span
        key={tag}
        className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/70 border border-gray-200 text-gray-700 shadow-sm backdrop-blur-sm"
      >
        {tag}
      </span>
    ))}
  </div>

  <Link href="/collections?category=Today's Offer">
    <button className="px-8 py-3.5 text-[15px] font-semibold tracking-wide rounded-xl transition-all duration-300 transform hover:-translate-y-1 bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgba(161,0,91,0.35)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.55)]">
      Explore Today's Offers
    </button>
  </Link>
</div>

        {/* RIGHT — Image Slider */}
        <div className="w-full md:w-[45%] lg:w-[45%] flex-shrink-0 flex justify-center md:justify-end">
          <div className="relative w-[85%] max-w-[350px] md:w-auto md:max-w-none md:h-[70vh] lg:h-[80vh] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.20)]">

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
                {activeSlide.link ? (
                  <Link href={activeSlide.link} className="block w-full h-full">
                    <Image
                      src={activeSlide.src}
                      alt={activeSlide.label}
                      fill
                      className="object-cover"
                      priority
                    />
                  </Link>
                ) : (
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.label}
                    fill
                    className="object-cover"
                    priority
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge */}
                <div
                  className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: activeSlide.color }}
                >
                  {activeSlide.badge}
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 pt-4 pointer-events-none">
                  <p className="text-white font-semibold text-lg tracking-wide">
                    {activeSlide.label}
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
                className="h-full bg-primary"
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
