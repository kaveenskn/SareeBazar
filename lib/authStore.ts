
/* ─────────────────────────────────────────────
 *  Auth Store
 *  Token stored in localStorage, validated by
 *  checking JWT expiry on every isLoggedIn call.
 * ───────────────────────────────────────────── */

// Use Next.js proxy so cookies & CORS work correctly

export const API_BASE = "/api/backend/auth";
export const AUTH_KEY = "sb_user";
export const TOKEN_KEY = "accessToken";

export interface User {
  id: string;
  name: string;
  email: string;
}

/** Decode JWT payload without verifying signature (client-side only) */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns the stored access token if it exists AND is not expired */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  // Check if token is expired
  const payload = decodeJwtPayload(token);
  if (payload?.exp) {
    const expiresAt = payload.exp * 1000; // convert to ms
    if (Date.now() >= expiresAt) {
      // Token expired — clean up and force re-login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event("auth-updated"));
      return null;
    }
  }
  return token;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Returns true only if user has a valid, non-expired token */
export function isLoggedIn(): boolean {
  return getToken() !== null;
}

export function loginUser(user: User, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth-updated"));
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("auth-updated"));

  // Clear httpOnly cookies on server
  fetch(`${API_BASE}/logout`, { method: "POST", credentials: "include" }).catch(() => { });
}
