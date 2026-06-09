"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ShoppingBag,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Filter,
  Search,
  CalendarDays,
  MapPin,
  CreditCard,
  Banknote,
} from "lucide-react";
import {
  computeDashboardStats,
  type MockOrder,
} from "@/mockdata/orders";
import { getOrders } from "@/lib/ordersStore";

/* ─── Status badge config ─── */
const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  Delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: <CheckCircle2 size={12} />,
  },
  Shipped: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: <Truck size={12} />,
  },
  Processing: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    icon: <Package size={12} />,
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: <Clock size={12} />,
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: <XCircle size={12} />,
  },
};

/* ─── Mini bar chart component (no deps) ─── */
function MiniBarChart({ data }: { data: { month: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div className="flex items-end gap-2 h-[120px] w-full pt-4">
      {data.map((d, i) => {
        const heightPct = (d.amount / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[10px] font-bold text-gray-500 mb-1">
              ₹{(d.amount / 1000).toFixed(0)}k
            </span>
            <div
              className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                isLast
                  ? "bg-gradient-to-t from-[#a1005b] to-[#d4437a]"
                  : "bg-gradient-to-t from-[#f0d0e0] to-[#f8e8f0]"
              }`}
              style={{ height: `${heightPct}%`, minHeight: "8px" }}
            />
            <span
              className={`text-[11px] font-semibold ${
                isLast ? "text-[#a1005b]" : "text-gray-400"
              }`}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Category donut component ─── */
function CategoryDonut({
  data,
}: {
  data: { category: string; count: number; amount: number }[];
}) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const colors = ["#a1005b", "#d4437a", "#e88aaf", "#B88E52", "#16a34a", "#7c3aed"];

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = (d.amount / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: colors[i % colors.length] };
  });

  const gradientStops = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
    .join(", ");

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-[100px] h-[100px] rounded-full flex-shrink-0 relative"
        style={{
          background: `conic-gradient(${gradientStops})`,
        }}
      >
        <div className="absolute inset-[20px] rounded-full bg-white flex items-center justify-center">
          <span className="text-[11px] font-bold text-gray-600">{data.length}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {segments.map((s) => (
          <div key={s.category} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-[12px] text-gray-600 truncate flex-1">
              {s.category}
            </span>
            <span className="text-[11px] font-bold text-gray-800">
              ₹{(s.amount / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Order tracking step indicator ─── */
function OrderTracker({ status }: { status: string }) {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const isCancelled = status === "Cancelled";
  const currentIndex = isCancelled ? -1 : steps.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
        <XCircle size={14} className="text-red-500" />
        <span className="text-[12px] font-bold text-red-600">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isActive
                    ? "bg-[#a1005b] text-white shadow-md shadow-[#a1005b]/30 scale-110"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {isCompleted && !isActive ? "✓" : i + 1}
              </div>
              <span
                className={`text-[9px] mt-1 font-semibold ${
                  isActive ? "text-[#a1005b]" : isCompleted ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-0.5 mx-0.5 rounded-full mb-4 ${
                  i < currentIndex ? "bg-emerald-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Filter tabs ─── */
type FilterType = "All" | "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

const FILTER_TABS: FilterType[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/* ─── Main Dashboard Component ─── */
export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const fetched = await getOrders();
        const mapped: MockOrder[] = fetched.map(o => {
          let mappedStatus = o.status.charAt(0).toUpperCase() + o.status.slice(1);
          if (mappedStatus === "Confirmed") mappedStatus = "Processing";
          return {
            ...o,
            id: o.orderId || o.id,
            customerName: o.shipping?.fullName || "Unknown",
            customerCity: o.shipping?.city || "Unknown",
            deliveryStatus: mappedStatus as MockOrder["deliveryStatus"]
          };
        });
        setOrders(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => computeDashboardStats(orders), [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (activeFilter !== "All") {
      filtered = filtered.filter((o) => o.deliveryStatus === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q)) ||
          o.shipping.fullName.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeFilter, searchQuery, orders]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return `Today, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    if (isYesterday) return `Yesterday, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#fdf6fb] via-[#f7eff3] to-[#faf5f0] pt-[100px] pb-16"
      style={{ fontFamily: "var(--font-figtree), sans-serif" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* ─── Page Header ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a1005b] to-[#d4437a] flex items-center justify-center shadow-lg shadow-[#a1005b]/20">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-[28px] font-extrabold text-[#1a1a2e] tracking-tight">
                My Dashboard
              </h1>
              <p className="text-[13px] text-[#6b7280] -mt-0.5">
                Track your orders & purchase history
              </p>
            </div>
          </div>
        </div>

        {/* ─── Stats Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            {
              label: "Total Orders",
              value: stats.totalOrders,
              icon: <ShoppingBag size={18} />,
              gradient: "from-[#a1005b] to-[#c73e7a]",
              shadow: "shadow-[#a1005b]/15",
            },
            {
              label: "Pending",
              value: stats.pendingOrders,
              icon: <Clock size={18} />,
              gradient: "from-amber-500 to-amber-400",
              shadow: "shadow-amber-500/15",
            },
            {
              label: "Processing",
              value: stats.processingOrders,
              icon: <Package size={18} />,
              gradient: "from-violet-600 to-violet-400",
              shadow: "shadow-violet-500/15",
            },
            {
              label: "Shipped",
              value: stats.shippedOrders,
              icon: <Truck size={18} />,
              gradient: "from-blue-600 to-blue-400",
              shadow: "shadow-blue-500/15",
            },
            {
              label: "Delivered",
              value: stats.deliveredOrders,
              icon: <CheckCircle2 size={18} />,
              gradient: "from-emerald-600 to-emerald-400",
              shadow: "shadow-emerald-500/15",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden bg-white rounded-2xl p-4 border border-white/60 shadow-lg ${card.shadow} hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  {card.icon}
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-gray-300 group-hover:text-[#a1005b] transition-colors"
                />
              </div>
              <p className="text-[26px] font-extrabold text-[#1a1a2e] leading-none">
                {card.value.toLocaleString()}
              </p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Charts Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Spending Overview */}
          <div className="bg-white rounded-2xl p-6 border border-white/60 shadow-lg shadow-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#1a1a2e]">
                  Spending Overview
                </h3>
                <p className="text-[12px] text-gray-400">Last 6 months</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <TrendingUp size={13} className="text-emerald-600" />
                <span className="text-[12px] font-bold text-emerald-700">
                  ₹{(stats.totalSpent / 1000).toFixed(1)}k total
                </span>
              </div>
            </div>
            <MiniBarChart data={stats.monthlySpending} />
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-white/60 shadow-lg shadow-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#1a1a2e]">
                  Category Breakdown
                </h3>
                <p className="text-[12px] text-gray-400">By purchase amount</p>
              </div>
              <div className="flex items-center gap-2 bg-[#fff0f5] px-3 py-1.5 rounded-full border border-[#ffd6e5]">
                <IndianRupee size={13} className="text-[#a1005b]" />
                <span className="text-[12px] font-bold text-[#a1005b]">
                  Avg ₹{(stats.averageOrderValue / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
            <CategoryDonut data={stats.categoryBreakdown} />
          </div>
        </div>

        {/* ─── Orders Section ─── */}
        <div className="bg-white rounded-2xl border border-white/60 shadow-lg shadow-gray-200/50 overflow-hidden">
          {/* Orders Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-[#a1005b]" />
                <h2 className="text-[18px] font-bold text-[#1a1a2e]">
                  Order History
                </h2>
                <span className="text-[12px] bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
                  {filteredOrders.length}
                </span>
              </div>
              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by order ID, product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-[260px] focus:outline-none focus:ring-2 focus:ring-[#a1005b]/20 focus:border-[#a1005b]/40 transition-all text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition-all whitespace-nowrap ${
                    activeFilter === tab
                      ? "bg-[#a1005b] text-white shadow-md shadow-[#a1005b]/20"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-[#a1005b]/20 border-t-[#a1005b] rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-[16px] font-bold text-gray-400 mb-1">
                  Loading orders...
                </h3>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag
                  size={48}
                  className="text-gray-200 mx-auto mb-4"
                />
                <h3 className="text-[16px] font-bold text-gray-400 mb-1">
                  No orders found
                </h3>
                <p className="text-[13px] text-gray-400">
                  {searchQuery
                    ? "Try a different search term"
                    : "No orders in this category"}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const sc = STATUS_CONFIG[order.deliveryStatus] ?? STATUS_CONFIG.Pending;
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="group hover:bg-[#fdf6fb]/50 transition-colors"
                  >
                    {/* Collapsed Row */}
                    <div
                      className="px-6 py-4 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Thumbnail */}
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                          <Image
                            src={order.items[0].selectedColorImage || order.items[0].image}
                            alt={order.items[0].name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {order.items.length > 1 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white text-[11px] font-bold">
                                +{order.items.length - 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13px] font-extrabold text-[#a1005b]">
                              {order.id}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
                            >
                              {sc.icon}
                              {order.deliveryStatus}
                            </span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#282c3f] truncate">
                            {order.items
                              .map((item) => item.name)
                              .join(", ")}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <CalendarDays size={10} />
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} />
                              {order.shipping.city}
                            </span>
                          </div>
                        </div>

                        {/* Amount & Payment */}
                        <div className="text-right flex-shrink-0 hidden sm:block">
                          <p className="text-[16px] font-extrabold text-[#1a1a2e]">
                            ₹{order.total.toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-0.5">
                            {order.paymentMethod === "COD" ? (
                              <Banknote size={12} className="text-amber-600" />
                            ) : (
                              <CreditCard size={12} className="text-emerald-600" />
                            )}
                            <span
                              className={`text-[11px] font-semibold ${
                                order.paymentMethod === "COD"
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {order.paymentMethod === "COD" ? "COD" : "Paid"}
                            </span>
                          </div>
                        </div>

                        {/* Expand Arrow */}
                        <ChevronRight
                          size={18}
                          className={`text-gray-300 transition-transform duration-200 flex-shrink-0 ${
                            isExpanded ? "rotate-90 text-[#a1005b]" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-5 animate-slide-in">
                        {/* Tracker */}
                        <div className="bg-gradient-to-r from-[#fdf6fb] to-[#faf5f0] rounded-xl p-4 mb-4 border border-[#f0d0e0]/50">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Order Tracking
                          </p>
                          <OrderTracker status={order.deliveryStatus} />
                        </div>

                        {/* Items Detail */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 bg-gray-50/70 rounded-xl p-3 border border-gray-100"
                            >
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                <Image
                                  src={item.selectedColorImage || item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-[#282c3f] truncate">
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
                                    style={{ background: item.selectedColorHex }}
                                  />
                                  <span className="text-[11px] text-gray-500">
                                    {item.selectedColor}
                                  </span>
                                  <span className="text-[11px] text-gray-400">
                                    × {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-[14px] font-bold text-[#282c3f]">
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-[10px] text-gray-400">
                                    ₹{item.price.toLocaleString("en-IN")} each
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-[12px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {order.shipping.city}, {order.shipping.state}
                            </span>
                            <span className="flex items-center gap-1">
                              {order.paymentMethod === "COD" ? (
                                <Banknote size={12} />
                              ) : (
                                <CreditCard size={12} />
                              )}
                              {order.paymentMethod}
                            </span>
                          </div>
                          <Link
                            href={`/order-success?id=${order.id}`}
                            className="flex items-center gap-1.5 text-[12px] font-bold text-[#a1005b] hover:underline"
                          >
                            <Eye size={13} />
                            View Full Details
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
