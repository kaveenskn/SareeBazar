"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ShoppingBag,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Search,
  CalendarDays,
  MapPin,
  CreditCard,
  Banknote,
  XCircle,
} from "lucide-react";
import {
  computeDashboardStats,
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
                Track your orders &amp; purchase history
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
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition-all whitespace-nowrap ${activeFilter === tab
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
                <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-[16px] font-bold text-gray-400 mb-1">
                  No orders found
                </h3>
                <p className="text-[13px] text-gray-400">
                  {searchQuery ? "Try a different search term" : "No orders in this category"}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const sc = STATUS_CONFIG[order.deliveryStatus] ?? STATUS_CONFIG.Pending;

                return (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#fdf6fb]/60 transition-colors">
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
                        {order.items.map((item) => item.name).join(", ")}
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
                      <p className="text-[15px] font-extrabold text-[#1a1a2e]">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        {order.paymentMethod === "COD" ? (
                          <Banknote size={12} className="text-amber-600" />
                        ) : (
                          <CreditCard size={12} className="text-emerald-600" />
                        )}
                        <span
                          className={`text-[11px] font-semibold ${order.paymentMethod === "COD" ? "text-amber-600" : "text-emerald-600"
                            }`}
                        >
                          {order.paymentMethod === "COD" ? "COD" : "Paid"}
                        </span>
                      </div>
                    </div>

                    {/* View Full Details Button */}
                    <Link
                      href="/orders"
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fff0f6] text-[#a1005b] text-[12px] font-bold border border-[#ffd6e5] hover:bg-[#a1005b] hover:text-white hover:border-[#a1005b] transition-all duration-200"
                    >
                      <Eye size={13} />
                      View Details
                      <ChevronRight size={12} />
                    </Link>
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

