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
    id: "ORD-29481",
    items: [
      {
        productId: 1,
        slug: "kanjivaram-silk-saree",
        name: "Banarasi Silk Royale",
        selectedColor: "Ruby Magenta",
        selectedColorHex: "#9b1b5e",
        selectedColorImage: `${IMG}/bridal-banarasi.png`,
        quantity: 1,
        price: 18999,
        image: `${IMG}/bridal-banarasi.png`,
        category: "Silk Sarees",
        fabric: "Banarasi Silk",
      },
    ],
    shipping: {
      fullName: "Ananya Sharma",
      email: "ananya@email.com",
      phone: "+91 9876543210",
      addressLine1: "42 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400002",
      country: "India",
    },
    subtotal: 18999,
    shippingFee: 0,
    discount: 0,
    total: 18999,
    paymentId: "PAY-SB-001",
    paymentMethod: "Online",
    status: "delivered" as OrderStatus,
    createdAt: "2026-05-26T10:42:00.000Z",
    customerName: "Ananya Sharma",
    customerCity: "Mumbai",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-29480",
    items: [
      {
        productId: 2,
        slug: "bridal-red-banarasi",
        name: "Kanjivaram Aurora",
        selectedColor: "Forest Gold",
        selectedColorHex: "#B88E52",
        selectedColorImage: `${IMG}/kanjivaram-silk.png`,
        quantity: 1,
        price: 24500,
        image: `${IMG}/kanjivaram-silk.png`,
        category: "Silk Sarees",
        fabric: "Pure Silk",
      },
    ],
    shipping: {
      fullName: "Meera Iyer",
      email: "meera@email.com",
      phone: "+91 9876543211",
      addressLine1: "15 Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600040",
      country: "India",
    },
    subtotal: 24500,
    shippingFee: 0,
    discount: 0,
    total: 24500,
    paymentId: "PAY-SB-002",
    paymentMethod: "Online",
    status: "shipped" as OrderStatus,
    createdAt: "2026-05-26T09:18:00.000Z",
    customerName: "Meera Iyer",
    customerCity: "Chennai",
    deliveryStatus: "Shipped",
  },
  {
    id: "ORD-29479",
    items: [
      {
        productId: 3,
        slug: "pastel-chanderi-cotton",
        name: "Chanderi Whisper",
        selectedColor: "Blush Pink",
        selectedColorHex: "#f4a0b5",
        selectedColorImage: `${IMG}/chanderi-cotton.png`,
        quantity: 2,
        price: 4299,
        image: `${IMG}/chanderi-cotton.png`,
        category: "Cotton Sarees",
        fabric: "Chanderi Cotton",
      },
    ],
    shipping: {
      fullName: "Riya Patel",
      email: "riya@email.com",
      phone: "+91 9876543212",
      addressLine1: "8 SG Highway",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380015",
      country: "India",
    },
    subtotal: 8598,
    shippingFee: 0,
    discount: 0,
    total: 8598,
    paymentId: "PAY-SB-003",
    paymentMethod: "Online",
    status: "processing" as OrderStatus,
    createdAt: "2026-05-26T08:03:00.000Z",
    customerName: "Riya Patel",
    customerCity: "Ahmedabad",
    deliveryStatus: "Processing",
  },
  {
    id: "ORD-29478",
    items: [
      {
        productId: 5,
        slug: "tussar-silk-heritage",
        name: "Mysore Silk Dusk",
        selectedColor: "Sunset Ember",
        selectedColorHex: "#d4632a",
        selectedColorImage: `${IMG}/tussar-silk.png`,
        quantity: 1,
        price: 7899,
        image: `${IMG}/tussar-silk.png`,
        category: "Silk Sarees",
        fabric: "Tussar Silk",
      },
    ],
    shipping: {
      fullName: "Kavya Reddy",
      email: "kavya@email.com",
      phone: "+91 9876543213",
      addressLine1: "23 Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
      country: "India",
    },
    subtotal: 7899,
    shippingFee: 0,
    discount: 0,
    total: 7899,
    paymentId: "COD",
    paymentMethod: "COD",
    status: "pending" as OrderStatus,
    createdAt: "2026-05-25T14:30:00.000Z",
    customerName: "Kavya Reddy",
    customerCity: "Hyderabad",
    deliveryStatus: "Pending",
  },
  {
    id: "ORD-29477",
    items: [
      {
        productId: 6,
        slug: "royal-banarasi-brocade",
        name: "Royal Banarasi Brocade",
        selectedColor: "Deep Red",
        selectedColorHex: "#8b0000",
        selectedColorImage: `${IMG}/bridal-banarasi.png`,
        quantity: 1,
        price: 34500,
        image: `${IMG}/bridal-banarasi.png`,
        category: "Bridal",
        fabric: "Banarasi Silk",
      },
      {
        productId: 4,
        slug: "emerald-georgette",
        name: "Emerald Georgette",
        selectedColor: "Emerald Green",
        selectedColorHex: "#16a34a",
        selectedColorImage: `${IMG}/emerald-georgette.png`,
        quantity: 1,
        price: 12500,
        image: `${IMG}/emerald-georgette.png`,
        category: "Handloom",
        fabric: "Georgette",
      },
    ],
    shipping: {
      fullName: "Priya Menon",
      email: "priya@email.com",
      phone: "+91 9876543214",
      addressLine1: "12 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
    },
    subtotal: 47000,
    shippingFee: 0,
    discount: 2350,
    total: 44650,
    paymentId: "PAY-SB-005",
    paymentMethod: "Online",
    status: "delivered" as OrderStatus,
    createdAt: "2026-05-24T16:45:00.000Z",
    customerName: "Priya Menon",
    customerCity: "Bangalore",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-29476",
    items: [
      {
        productId: 9,
        slug: "designer-georgette-party",
        name: "Designer Georgette Party",
        selectedColor: "Green",
        selectedColorHex: "#16a34a",
        selectedColorImage: `${IMG}/emerald-georgette.png`,
        quantity: 1,
        price: 15200,
        image: `${IMG}/emerald-georgette.png`,
        category: "Daily Wear",
        fabric: "Georgette",
      },
    ],
    shipping: {
      fullName: "Sneha Nair",
      email: "sneha@email.com",
      phone: "+91 9876543215",
      addressLine1: "56 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700016",
      country: "India",
    },
    subtotal: 15200,
    shippingFee: 0,
    discount: 0,
    total: 15200,
    paymentId: "PAY-SB-006",
    paymentMethod: "Online",
    status: "delivered" as OrderStatus,
    createdAt: "2026-05-23T11:20:00.000Z",
    customerName: "Sneha Nair",
    customerCity: "Kolkata",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-29475",
    items: [
      {
        productId: 11,
        slug: "festive-red-banarasi",
        name: "Festive Red Banarasi",
        selectedColor: "Red",
        selectedColorHex: "#dc2626",
        selectedColorImage: `${IMG}/bridal-banarasi.png`,
        quantity: 1,
        price: 28900,
        image: `${IMG}/bridal-banarasi.png`,
        category: "Bridal",
        fabric: "Banarasi Silk",
      },
    ],
    shipping: {
      fullName: "Deepa Krishnan",
      email: "deepa@email.com",
      phone: "+91 9876543216",
      addressLine1: "9 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302001",
      country: "India",
    },
    subtotal: 28900,
    shippingFee: 0,
    discount: 1445,
    total: 27455,
    paymentId: "COD",
    paymentMethod: "COD",
    status: "delivered" as OrderStatus,
    createdAt: "2026-05-22T09:15:00.000Z",
    customerName: "Deepa Krishnan",
    customerCity: "Jaipur",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-29474",
    items: [
      {
        productId: 7,
        slug: "soft-cotton-handloom",
        name: "Soft Cotton Handloom",
        selectedColor: "Light Pink",
        selectedColorHex: "#fbcfe8",
        selectedColorImage: `${IMG}/chanderi-cotton.png`,
        quantity: 3,
        price: 3200,
        image: `${IMG}/chanderi-cotton.png`,
        category: "Cotton Sarees",
        fabric: "Cotton",
      },
    ],
    shipping: {
      fullName: "Lakshmi Devi",
      email: "lakshmi@email.com",
      phone: "+91 9876543217",
      addressLine1: "34 Residency Road",
      city: "Lucknow",
      state: "Uttar Pradesh",
      postalCode: "226001",
      country: "India",
    },
    subtotal: 9600,
    shippingFee: 0,
    discount: 0,
    total: 9600,
    paymentId: "PAY-SB-008",
    paymentMethod: "Online",
    status: "cancelled" as OrderStatus,
    createdAt: "2026-05-21T15:00:00.000Z",
    customerName: "Lakshmi Devi",
    customerCity: "Lucknow",
    deliveryStatus: "Cancelled",
  },
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
