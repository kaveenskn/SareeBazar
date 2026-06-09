/* ─────────────────────────────────────────────
 *  Collection API Service
 *  Fetches collections from the backend API.
 *  Used by homepage Collections section and
 *  /collections page for banner display.
 * ───────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiCollection {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all collections from backend
 */
export async function fetchAllCollections(): Promise<ApiCollection[]> {
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ApiCollection[] = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch collections from API:", err);
    return [];
  }
}

/**
 * Fetch a single collection by ID
 */
export async function fetchCollectionById(id: string): Promise<ApiCollection | null> {
  try {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: ApiCollection = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch collection:", err);
    return null;
  }
}
