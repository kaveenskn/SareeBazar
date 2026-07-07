/* ─────────────────────────────────────────────
 *  Mock Products Data
 *  Replace this with API call:
 *    const res = await fetch('/api/products');
 *    const products = await res.json();
 * ───────────────────────────────────────────── */

import { Product } from "./types";

/**
 * Image base path — all collection images live under /images/collections/
 * When migrating to a backend, replace these with CDN/cloud URLs.
 */
const IMG = "/images/collections";

export const products: Product[] = [
  {
    id: 1,
    name: "Kanjivaram Silk Saree",
    slug: "kanjivaram-silk-saree",
    image: `${IMG}/kanjivaram-silk.png`,
    price: 245,
    originalPrice: 390,
    rating: 5,
    reviews: 42,
    category: "Silk Sarees",
    badge: "New",
    description:
      "Luxurious golden Kanjivaram silk saree with rich zari work, perfect for weddings and festive occasions.",
    fabric: "Pure Silk",
    color: "Gold",
    inStock: true,
    createdAt: "2026-05-01",
    images: [
      "/images/products/kanjivaram-silk-saree/saree1_blue.jpeg",
      "/images/products/kanjivaram-silk-saree/saree1_green.jpeg",
      "/images/products/kanjivaram-silk-saree/saree1_purple.jpeg",
      "/images/products/kanjivaram-silk-saree/saree1_red.jpeg"
    ],
    colorVariants: [
      { name: "Royal Blue", hex: "#1e40af", image: "/images/products/kanjivaram-silk-saree/saree1_blue.jpeg", stock: 10 },
      { name: "Emerald Green", hex: "#16a34a", image: "/images/products/kanjivaram-silk-saree/saree1_green.jpeg", stock: 10 },
      { name: "Purple", hex: "#7c3aed", image: "/images/products/kanjivaram-silk-saree/saree1_purple.jpeg", stock: 10 },
      { name: "Red", hex: "#dc2626", image: "/images/products/kanjivaram-silk-saree/saree1_red.jpeg", stock: 10 },
    ],
    video: "/images/products/kanjivaram-silk-saree/0517.mp4",
  },
];
