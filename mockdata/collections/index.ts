/* ─────────────────────────────────────────────
 *  Barrel Export — Collections Mock Data
 *
 *  Usage:
 *    import { products, filterCategories, heroBanners } from "@/mockdata/collections";
 *    import type { Product, FilterCategory } from "@/mockdata/collections";
 *
 *  Backend Migration:
 *    Replace these imports with API service calls.
 *    See each file for the suggested fetch pattern.
 * ───────────────────────────────────────────── */

// Types
export type {
  Product,
  FilterCategory,
  HeroBanner,
  CollectionMeta,
  ColorVariant,
} from "./types";

// Data
export { products } from "./products";
export { filterCategories } from "./categories";
export { heroBanners } from "./banners";

// Images
export { collectionImages, getCollectionImage } from "./images";
export type { CollectionImageKey } from "./images";
