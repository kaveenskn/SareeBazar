/* ─────────────────────────────────────────────
 *  Collection Types
 *  Shared interfaces for collections data.
 *  When connecting to a backend, these types
 *  can be reused for API response validation.
 * ───────────────────────────────────────────── */

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  images?: string[];
  video?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  badge?: string;
  status?: string;
  isWishlisted?: boolean;
  description?: string;
  fabric?: string;
  color?: string;
  colorVariants?: ColorVariant[];
  inStock?: boolean;
  stock?: number;
  discountPercent?: number;
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
