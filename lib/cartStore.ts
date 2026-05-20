/* ─────────────────────────────────────────────
 *  Cart & Checkout State Store
 *  Uses a module-level store pattern with
 *  localStorage persistence (no extra deps).
 * ───────────────────────────────────────────── */

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  selectedColor: string;         // color name
  selectedColorHex: string;      // hex for display
  selectedColorImage: string;    // variant image URL
  quantity: number;
  price: number;                 // unit price (LKR)
  originalPrice?: number;
  image: string;                 // fallback image
  category: string;
  fabric?: string;
}

export interface CheckoutVariant {
  productId: number;
  slug: string;
  name: string;
  selectedColor: string;
  selectedColorHex: string;
  selectedColorImage: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  fabric?: string;
}

const CART_KEY = "sb_cart";
const CHECKOUT_KEY = "sb_checkout";

/* ─── Helpers ─── */

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.findIndex(
    (c) => c.productId === item.productId && c.selectedColor === item.selectedColor
  );
  if (existing >= 0) {
    cart[existing].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(productId: number, color: string): void {
  const cart = getCart().filter(
    (c) => !(c.productId === productId && c.selectedColor === color)
  );
  saveCart(cart);
}

export function updateCartQty(productId: number, color: string, qty: number): void {
  const cart = getCart().map((c) =>
    c.productId === productId && c.selectedColor === color
      ? { ...c, quantity: Math.max(1, qty) }
      : c
  );
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, c) => sum + c.quantity, 0);
}

/* ─── Checkout session (single or multi-item) ─── */

export function setCheckoutItems(items: CheckoutVariant[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
}

export function getCheckoutItems(): CheckoutVariant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutVariant[]) : [];
  } catch {
    return [];
  }
}

export function clearCheckoutItems(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_KEY);
}
