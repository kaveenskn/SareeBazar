/* ─────────────────────────────────────────────
 *  Product API Service
 *  Fetches products from the backend API.
 *  Used across Collections, Product Detail,
 *  Today's Offers, and homepage sections.
 * ───────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import type { Product } from "@/mockdata/collections";

interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  video: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  category: string;
  badge: string;
  description: string;
  fabric: string;
  color: string;
  colorVariants: { name: string; hex: string; image: string }[];
  inStock: boolean;
  stock: number;
  sizes: string[];
  isFeatured: boolean;
  isLatest: boolean;
  isTrending: boolean;
  createdAt: string;
}

function sanitizeImage(url: string | undefined): string {
  if (!url || url.startsWith("blob:")) return "";
  return url;
}

function mapApiToProduct(api: ApiProduct): Product {
  return {
    id: api._id as unknown as number,
    name: api.name,
    slug: api.slug,
    image: sanitizeImage(api.image),
    images: api.images?.filter(Boolean).map(sanitizeImage).filter(Boolean) || [],
    video: sanitizeImage(api.video) || undefined,
    price: api.price,
    originalPrice: api.originalPrice ?? undefined,
    rating: api.rating,
    reviews: api.reviews,
    category: api.category,
    badge: api.badge || undefined,
    description: api.description,
    fabric: api.fabric,
    color: api.color,
    colorVariants: (api.colorVariants || []).map(cv => ({ ...cv, image: sanitizeImage(cv.image) })),
    inStock: api.inStock,
    createdAt: api.createdAt,
  };
}

/**
 * Fetch all products from backend
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ApiProduct[] = await res.json();
    return data.map(mapApiToProduct);
  } catch (err) {
    console.error("Failed to fetch products from API:", err);
    return [];
  }
}

/**
 * Fetch products with "Sale" badge — used for Today's Offers
 */
export async function fetchSaleProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products?badge=Sale`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ApiProduct[] = await res.json();
    return data.map(mapApiToProduct);
  } catch (err) {
    console.error("Failed to fetch sale products:", err);
    return [];
  }
}

/**
 * Fetch a single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data: ApiProduct = await res.json();
    return mapApiToProduct(data);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}
