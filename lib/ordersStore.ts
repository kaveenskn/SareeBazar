/* ─────────────────────────────────────────────
 *  Orders Store (API-backed)
 *  Connects to Express backend at /api/orders.
 * ───────────────────────────────────────────── */

const API_BASE = "http://localhost:5000/api/orders";

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
  orderId?: string;
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

/* ─── Auth helper ─── */

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/* ─── API Payload (matches backend schema exactly) ─── */

export interface OrderPayload {
  items: Array<{
    productId: number;
    slug: string;
    name: string;
    selectedColor: string;
    selectedColorHex: string;
    selectedColorImage: string;
    quantity: number;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    fabric: string;
  }>;
  shipping: ShippingDetails;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
}

/* ─── Place Order (POST) ─── */

export async function placeOrder(
  payload: OrderPayload
): Promise<{ order: Order & { orderId: string } }> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to place order");
  }
  return data;
}

/* ─── Confirm Payment (PATCH) ─── */

export async function confirmPayment(
  orderId: string,
  paymentId: string
): Promise<Order> {
  const response = await fetch(`${API_BASE}/${orderId}/payment`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      paymentId,
      paymentStatus: "paid",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to confirm payment");
  }
  return data;
}

/* ─── Get All Orders (GET) ─── */

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }
    // Backend may return { orders: [...] } or an array directly
    return Array.isArray(data) ? data : (data.orders ?? []);
  } catch {
    return [];
  }
}

/* ─── Get Single Order (GET) ─── */

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) return null;
    // Backend may return { order: {...} } or the order directly
    return data.order ?? data;
  } catch {
    return null;
  }
}
