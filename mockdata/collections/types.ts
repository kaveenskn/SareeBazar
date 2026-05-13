/* ─────────────────────────────────────────────
 *  Collection Types
 *  Shared interfaces for collections data.
 *  When connecting to a backend, these types
 *  can be reused for API response validation.
 * ───────────────────────────────────────────── */

export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  isWishlisted?: boolean;
  description?: string;
  fabric?: string;
  color?: string;
  inStock?: boolean;
  createdAt?: string;
}

export interface FilterCategory {
  icon: string;
  label: string;
  slug: string;
  count?: number;
}

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

export interface CollectionMeta {
  totalProducts: number;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
