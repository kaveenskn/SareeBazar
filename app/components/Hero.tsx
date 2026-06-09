"use client";

import { useState, useEffect } from "react";
import { Section } from "./Section";

export function Hero() {
  const [shopInfo, setShopInfo] = useState<{storeName: string, description: string} | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  const storeName = shopInfo?.storeName || "Saree Bazar";
  const firstName = storeName.includes(" ") ? storeName.split(" ")[0] : "Saree";
  const secondName = storeName.includes(" ") ? storeName.split(" ").slice(1).join(" ") : "Bazar";
  const description = shopInfo?.description || "Explore bridal, silk, and designer sarees that blend traditional beauty with contemporary fashion and elegance.";

  return (
    <Section align="left" heightClass="h-[300vh]" isFirst={true} topClass="top-[200px]">
      <div className="max-w-xl text-left">
        <h1 className="text-6xl md:text-8xl font-sans font-bold tracking-tighter mb-6 drop-shadow-md">
          <span className="text-primary">{firstName}</span>{" "}
          <span className="text-gray-900">{secondName}</span>
        </h1>

        <p className="text-xl md:text-2xl font-normal leading-relaxed text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          {description}
        </p>

        <button className="mt-8 px-8 py-3.5 text-[15px] bg-primary hover:bg-primary/90 text-white font-semibold tracking-wide rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(161,0,91,0.3)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.5)] transform hover:-translate-y-1">
          Explore Collection
        </button>
      </div>
    </Section>
  );
}
