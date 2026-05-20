/* ─────────────────────────────────────────────
 *  Orders Store (localStorage-based demo)
 *  Replace with real API calls when backend ready.
 * ───────────────────────────────────────────── */

export interface OrderItem {
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

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentId: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

const ORDERS_KEY = "sb_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrder(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order); // newest first
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SB-${ts}-${rand}`;
}
