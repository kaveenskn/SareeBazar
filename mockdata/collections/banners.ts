/* ─────────────────────────────────────────────
 *  Mock Hero Banners
 *  Replace this with API call:
 *    const res = await fetch('/api/banners');
 *    const banners = await res.json();
 * ───────────────────────────────────────────── */

import { HeroBanner } from "./types";

const IMG = "/images/collections";

export const heroBanners: HeroBanner[] = [
  {
    id: 1,
    title: "The Heritage Weave",
    subtitle:
      "Discover our curated collection of timeless classics, woven with tradition and modern elegance.",
    image: `${IMG}/hero-banner.png`,
    link: "/collections",
  },
];
