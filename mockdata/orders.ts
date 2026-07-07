/* ─────────────────────────────────────────────
 *  Mock Orders Data
 *  Based on admin panel order records.
 *  Replace with API call when backend is ready:
 *    const res = await fetch('/api/orders');
 *    const orders = await res.json();
 * ───────────────────────────────────────────── */

import type { Order, OrderStatus } from "@/lib/ordersStore";

const IMG = "/images/collections";

export interface MockOrder extends Order {
  customerName: string;
  customerCity: string;
  deliveryStatus: "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled";
}

export const mockOrders: MockOrder[] = [
  {
    id: "ORD-98234",
    orderId: "ORD-98234",
    items: [
      {
        productId: 1,
        slug: "kanchipuram-silk-saree",
        name: "Kanchipuram Silk Saree",
        selectedColor: "Red",
        selectedColorHex: "#FF0000",
        selectedColorImage: `${IMG}/kanchipuram.jpg`,
        quantity: 1,
        price: 15000,
        originalPrice: 18000,
        image: `${IMG}/kanchipuram.jpg`,
        category: "Sarees",
        fabric: "Silk",
      },
    ],
    shipping: {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      addressLine1: "123 Main St",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      country: "India",
    },
    subtotal: 15000,
    shippingFee: 0,
    discount: 0,
    total: 15000,
    paymentId: "PAY-9876",
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    status: "delivered",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerName: "Jane Doe",
    customerCity: "Chennai",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-98235",
    orderId: "ORD-98235",
    items: [
      {
        productId: 2,
        slug: "banarasi-silk-saree",
        name: "Banarasi Silk Saree",
        selectedColor: "Blue",
        selectedColorHex: "#0000FF",
        selectedColorImage: `${IMG}/banarasi.jpg`,
        quantity: 2,
        price: 12000,
        originalPrice: 14000,
        image: `${IMG}/banarasi.jpg`,
        category: "Sarees",
        fabric: "Silk",
      },
    ],
    shipping: {
      fullName: "John Smith",
      email: "john@example.com",
      phone: "9876543211",
      addressLine1: "456 Elm St",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    subtotal: 24000,
    shippingFee: 0,
    discount: 0,
    total: 24000,
    paymentId: "PAY-9877",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    status: "shipped",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customerName: "John Smith",
    customerCity: "Mumbai",
    deliveryStatus: "Shipped",
  },
  {
    id: "ORD-98236",
    orderId: "ORD-98236",
    items: [
      {
        productId: 3,
        slug: "cotton-saree",
        name: "Cotton Daily Wear Saree",
        selectedColor: "Green",
        selectedColorHex: "#00FF00",
        selectedColorImage: `${IMG}/cotton.jpg`,
        quantity: 1,
        price: 3000,
        originalPrice: 3500,
        image: `${IMG}/cotton.jpg`,
        category: "Sarees",
        fabric: "Cotton",
      },
    ],
    shipping: {
      fullName: "Alice Johnson",
      email: "alice@example.com",
      phone: "9876543212",
      addressLine1: "789 Oak St",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    },
    subtotal: 3000,
    shippingFee: 100,
    discount: 0,
    total: 3100,
    paymentId: "",
    paymentMethod: "COD",
    paymentStatus: "pending",
    status: "processing",
    createdAt: new Date().toISOString(),
    customerName: "Alice Johnson",
    customerCity: "Delhi",
    deliveryStatus: "Processing",
  }
];

/* ─── Dashboard Stats (computed from mockOrders) ─── */

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  monthlySpending: { month: string; amount: number }[];
  categoryBreakdown: { category: string; count: number; amount: number }[];
}

export function computeDashboardStats(orders: MockOrder[]): DashboardStats {
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.deliveryStatus === "Pending").length;
  const processingOrders = orders.filter((o) => o.deliveryStatus === "Processing").length;
  const shippedOrders = orders.filter((o) => o.deliveryStatus === "Shipped").length;
  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.deliveryStatus === "Cancelled").length;

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const averageOrderValue =
    activeOrders.length > 0
      ? Math.round(totalSpent / activeOrders.length)
      : 0;

  // Monthly spending mock data (last 6 months)
  const monthlySpending = [
    { month: "Dec", amount: 12400 },
    { month: "Jan", amount: 28900 },
    { month: "Feb", amount: 19500 },
    { month: "Mar", amount: 44650 },
    { month: "Apr", amount: 33700 },
    { month: "May", amount: 52797 },
  ];

  // Category breakdown
  const categoryMap = new Map<string, { count: number; amount: number }>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const existing = categoryMap.get(item.category) || { count: 0, amount: 0 };
      existing.count += item.quantity;
      existing.amount += item.price * item.quantity;
      categoryMap.set(item.category, existing);
    }
  }
  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({ category, ...data })
  );

  return {
    totalOrders,
    totalSpent,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    averageOrderValue,
    monthlySpending,
    categoryBreakdown,
  };
}
