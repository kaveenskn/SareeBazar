/* ─────────────────────────────────────────────
 *  Mock Filter Categories
 *  Replace this with API call:
 *    const res = await fetch('/api/categories');
 *    const categories = await res.json();
 * ───────────────────────────────────────────── */

import { FilterCategory } from "./types";

export const filterCategories: FilterCategory[] = [
  { icon: "✦", label: "Silk Sarees", slug: "silk-sarees", count: 1 },
];
