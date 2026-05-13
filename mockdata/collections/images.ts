/* ─────────────────────────────────────────────
 *  Collection Images Manifest
 *  Maps image keys to public paths.
 *  When migrating to a backend/CDN, replace
 *  these paths with cloud storage URLs.
 *
 *  Example backend migration:
 *    const IMG_BASE = process.env.NEXT_PUBLIC_CDN_URL;
 *    kanjivaram: `${IMG_BASE}/kanjivaram-silk.webp`,
 * ───────────────────────────────────────────── */

const IMG = "/images/collections";

export const collectionImages = {
  // ── Product Images ──
  kanjivaramSilk: `${IMG}/kanjivaram-silk.png`,
  bridalBanarasi: `${IMG}/bridal-banarasi.png`,
  chanderiCotton: `${IMG}/chanderi-cotton.png`,
  emeraldGeorgette: `${IMG}/emerald-georgette.png`,
  tussarSilk: `${IMG}/tussar-silk.png`,

  // ── Banner Images ──
  heroBanner: `${IMG}/hero-banner.png`,
} as const;

/** All product image keys for validation */
export type CollectionImageKey = keyof typeof collectionImages;

/** Helper to get image path by key */
export function getCollectionImage(key: CollectionImageKey): string {
  return collectionImages[key];
}
