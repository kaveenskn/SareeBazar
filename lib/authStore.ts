export const API_BASE = "http://localhost:5000/api/auth";
export const AUTH_KEY = "sb_user";
export const TOKEN_KEY = "accessToken";

export interface User {
  id: string;
  name: string;
  email: string;
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

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
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
  
  fetch(`${API_BASE}/logout`, { method: "POST" }).catch(() => {});
}
