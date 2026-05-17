"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Section } from "./Section";

const categories = [
  {
    id: "silk",
    name: "Silk Sarees",
    subtitle: "Kanjivaram & Banarasi",
    items: "240+ Styles",
    image: "/images/collections/silk_saree.png",
    accent: "#7B3FA0",
  },
  {
    id: "cotton",
    name: "Cotton Sarees",
    subtitle: "Breathable & Elegant",
    items: "180+ Styles",
    image: "/images/collections/cotton_saree.png",
    accent: "#2E86AB",
  },
  {
    id: "handloom",
    name: "Handloom",
    subtitle: "Artisan Crafted",
    items: "150+ Styles",
    image: "/images/collections/handloom_saree.png",
    accent: "#C45E1B",
  },
  {
    id: "bridal",
    name: "Bridal",
    subtitle: "Wedding Collections",
    items: "120+ Styles",
    image: "/images/collections/bridal_saree.png",
    accent: "#B8112A",
  },
  {
    id: "dailywear",
    name: "Daily Wear",
    subtitle: "Comfort & Style",
    items: "300+ Styles",
    image: "/images/collections/dailywear_saree.png",
    accent: "#2D7A5F",
  },
];

export function Collections() {
  return (
    <Section align="center" heightClass="h-[140vh]" topClass="top-[calc(33%-200px)]">
      <div className="w-full flex flex-col items-center text-center" style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400 }}>
        {/* Heading */}
        <h2 className="text-5xl md:text-7xl font-bold mb-3 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Curated <span className="text-[#B88E52]">Collections</span>
        </h2>
        <p className="text-lg font-medium text-gray-700 mb-8 max-w-xl drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)]">
          From Banarasi brocades to everyday cotton — discover sarees for every occasion.
        </p>

        {/* Horizontal scrolling cards — one line */}
        <div className="w-full overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex gap-5 w-max mx-auto px-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative w-[200px] flex-shrink-0 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-white border border-white/60 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)] transition-all duration-400 cursor-pointer"
              >
                {/* Image */}
                <div className="relative w-full h-[260px] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Items badge */}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[11px] font-bold tracking-wide"
                    style={{ backgroundColor: cat.accent }}
                  >
                    {cat.items}
                  </div>
                </div>

                {/* Info */}
                <div className="px-4 pt-3 pb-4 flex flex-col gap-1">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{cat.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{cat.subtitle}</p>

                  {/* Add to Cart button */}
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link href="/collections">
          <button className="mt-8 px-10 py-3.5 border-2 font-bold tracking-wide rounded-full transition-all duration-300 border-[#B88E52] text-[#B88E52] bg-white/60 hover:bg-[#B88E52] hover:text-white shadow-lg hover:shadow-[0_8px_30px_rgb(184,142,82,0.3)] transform hover:-translate-y-1 backdrop-blur-sm">
            View All Collections
          </button>
        </Link>
      </div>
    </Section>
  );
}
