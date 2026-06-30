"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAllProducts } from "@/lib/productApi";
import { fetchAllCollections, type ApiCollection } from "@/lib/collectionApi";
import type { Product } from "@/mockdata/collections";



const accentColors: Record<string, string> = {
  "Silk Sarees": "#A0153E",
  "Kanjivaram Silk Saree": "#7B3FA0",
  "Cotton Sarees": "#4A7C59",
  "Handloom": "#5B7FBE",
  "Bridal": "#D4175C",
  "Daily Wear": "#6B8E23",
  "Georgette": "#9370DB",
  "Designer": "#D93097",
  "Party Wear": "#FF6347",
};

export function Collections() {
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiCollections, setApiCollections] = useState<ApiCollection[]>([]);

  useEffect(() => {
    fetchAllProducts().then((data) => {
      if (data.length > 0) {
        setApiProducts(data);
      }
    });
    fetchAllCollections().then((data) => {
      if (data.length > 0) {
        setApiCollections(data);
      }
    });
  }, []);

  // Build category cards — prefer API collections with cover images
  const categories = useMemo(() => {
    if (apiCollections.length === 0 && apiProducts.length === 0) return [];

    // Build a map of product images per category as fallback
    const productImageMap: Record<string, string> = {};
    apiProducts.forEach((p) => {
      if (!productImageMap[p.category] && p.image && !p.image.startsWith("blob:")) {
        productImageMap[p.category] = p.image;
      }
    });

    // Build a map of product counts per category
    const productCountMap: Record<string, number> = {};
    apiProducts.forEach((p) => {
      productCountMap[p.category] = (productCountMap[p.category] || 0) + 1;
    });

    // If we have API collections, use them
    if (apiCollections.length > 0) {
      const collectionCards = apiCollections.map((col) => {
        // Use coverImage if available, otherwise fallback to first product image in that category
        let safeImage = col.coverImage || "";
        if (!safeImage || safeImage.startsWith("blob:")) {
          safeImage = productImageMap[col.title] || "/images/collections/kanjivaram-silk.png";
        }

        const productCount = col.productCount || productCountMap[col.title] || 0;

        return {
          id: col.slug || col.title.toLowerCase().replace(/\s+/g, "-"),
          name: col.title,
          subtitle: col.description || `${productCount} product${productCount !== 1 ? "s" : ""} available`,
          items: `${productCount}+ Styles`,
          image: safeImage,
          accent: accentColors[col.title] || "#7B3FA0",
          hasCoverImage: !!col.coverImage && !col.coverImage.startsWith("blob:"),
        };
      });

      // Add any product categories not covered by collections
      const collectionNames = new Set(apiCollections.map(c => c.title));
      const extraCategories = Object.entries(productCountMap)
        .filter(([cat]) => !collectionNames.has(cat))
        .map(([category, count]) => ({
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          subtitle: `${count} product${count > 1 ? "s" : ""} available`,
          items: `${count}+ Styles`,
          image: productImageMap[category] || "/images/collections/kanjivaram-silk.png",
          accent: accentColors[category] || "#7B3FA0",
          hasCoverImage: false,
        }));

      const all = [...collectionCards, ...extraCategories];
      if (all.length > 0) return all;
    }

    // Fallback: group products by category (original behavior)
    if (apiProducts.length > 0) {
      const grouped: Record<string, Product[]> = {};
      apiProducts.forEach((p) => {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      });

      const apiCategories = Object.entries(grouped).map(([category, products]) => {
        let safeImage = products[0].image;
        if (!safeImage || safeImage.startsWith("blob:")) {
          safeImage = "/images/collections/kanjivaram-silk.png";
        }

        return {
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          subtitle: `${products.length} product${products.length > 1 ? "s" : ""} available`,
          items: `${products.length}+ Styles`,
          image: safeImage,
          accent: accentColors[category] || "#7B3FA0",
          hasCoverImage: false,
        };
      });

      if (apiCategories.length > 0) {
        return apiCategories;
      }
    }

    return [];
  }, [apiProducts, apiCollections]);

  return (
    <section className="relative w-full py-24 bg-[var(--background)] overflow-hidden">
      {/* Decorative Background Shape */}
      <div className="absolute left-0 top-[35%] w-full h-full z-0 opacity-40 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-primary/10 fill-current">
          <path d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,229.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <div className="w-full h-full bg-primary/10 -mt-1" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 flex flex-col items-center text-center relative z-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-gray-900 leading-[1.05] tracking-tight">
          Curated <span className="text-primary">Collections</span>
        </h2>
        <p className="text-base md:text-[17px] font-normal leading-relaxed text-gray-700 mb-16 max-w-2xl">
          From Banarasi brocades to everyday cotton — discover sarees for every occasion.
        </p>

        <div className="w-full flex flex-wrap justify-center gap-8">
          {categories.map((cat) => (
            <Link
              href={`/collections?category=${encodeURIComponent(cat.name)}`}
              key={cat.id}
              className="group relative w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)] lg:w-[calc(33.333%-1.333rem)] max-w-[420px] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] bg-white border border-white/60 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500 cursor-pointer block"
            >
              {/* Natural Image Layout */}
              <div className="relative w-full overflow-hidden flex bg-gray-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Items badge */}
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-[12px] font-bold tracking-wider"
                  style={{ backgroundColor: cat.accent }}
                >
                  {cat.items}
                </div>
              </div>

              {/* Minimal Info */}
              <div className="px-6 py-5 flex items-center justify-center">
                <h3 className="text-[20px] font-bold text-gray-900 leading-tight text-center">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/collections">
          <button className="mt-20 px-8 py-3.5 text-[15px] font-semibold tracking-wide rounded-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgba(161,0,91,0.3)] hover:shadow-[0_8px_30px_rgba(161,0,91,0.5)] transform hover:-translate-y-1">
            View All Collections
          </button>
        </Link>
      </div>
    </section>
  );
}
