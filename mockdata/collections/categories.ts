/* ─────────────────────────────────────────────
 *  Mock Filter Categories
 *  Replace this with API call:
 *    const res = await fetch('/api/categories');
 *    const categories = await res.json();
 * ───────────────────────────────────────────── */

import { FilterCategory } from "./types";

export const filterCategories: FilterCategory[] = [
  { icon: "✦", label: "Silk Sarees", slug: "silk-sarees", count: 3 },
  { icon: "❋", label: "Cotton Sarees", slug: "cotton-sarees", count: 2 },
  { icon: "◈", label: "Handloom", slug: "handloom", count: 2 },
  { icon: "✿", label: "Bridal", slug: "bridal", count: 3 },
  { icon: "☀", label: "Daily Wear", slug: "daily-wear", count: 2 },
];
