"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { getOrders, type Order } from "@/lib/ordersStore";
import Navbar from "@/app/components/Navbar";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:    { bg: "bg-yellow-50",  text: "text-yellow-700" },
  confirmed:  { bg: "bg-blue-50",    text: "text-blue-700" },
  processing: { bg: "bg-purple-50",  text: "text-purple-700" },
  shipped:    { bg: "bg-orange-50",  text: "text-orange-700" },
  delivered:  { bg: "bg-green-50",   text: "text-green-700" },
  cancelled:  { bg: "bg-red-50",     text: "text-red-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    const sync = () => setOrders(getOrders());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f0f4] pt-[90px]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <Navbar />

      <div className="max-w-[780px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-bold text-[#282c3f] flex items-center gap-2">
            <Package size={24} className="text-[#ff3f6c]" /> My Orders
          </h1>
          <p className="text-[14px] text-[#535766] mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-[#eaeaec]">
            <ShoppingBag size={48} className="text-[#d4d5d9] mx-auto mb-4" />
            <h2 className="text-[18px] font-bold text-[#282c3f] mb-2">No orders yet</h2>
            <p className="text-[14px] text-[#535766] mb-6">Looks like you haven&apos;t placed any orders.</p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff3f6c] text-white font-bold rounded-xl text-[14px] hover:bg-[#ed315d] transition-colors"
            >
              Shop Now <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const sc = STATUS_COLORS[order.status] ?? { bg: "bg-gray-50", text: "text-gray-700" };
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#eaeaec] bg-[#fdf6fb]">
                    <div>
                      <p className="text-[12px] text-[#535766] uppercase tracking-wide font-semibold">Order ID</p>
                      <p className="text-[14px] font-bold text-[#ff3f6c] tracking-wide">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#535766] uppercase tracking-wide font-semibold">Date</p>
                      <p className="text-[13px] font-semibold text-[#282c3f]">
                        {new Date(order.createdAt).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#535766] uppercase tracking-wide font-semibold">Total</p>
                      <p className="text-[14px] font-bold text-[#282c3f]">LKR {order.total.toLocaleString("en-LK")}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide ${sc.bg} ${sc.text}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#f5f5f6]">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 px-6 py-4 items-center">
                        <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <Image
                            src={item.selectedColorImage || item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-[14px] font-bold text-[#282c3f] hover:text-[#ff3f6c] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[12px] text-[#535766] mt-0.5">{item.category}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-md flex-shrink-0"
                              style={{ background: item.selectedColorHex }}
                            />
                            <span className="text-[12px] font-semibold text-[#282c3f] bg-[#fff0f5] px-2 py-0.5 rounded-full border border-[#ffd6e5]">
                              {item.selectedColor}
                            </span>
                            <span className="text-[12px] text-[#535766]">× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[14px] font-bold text-[#282c3f]">
                            LKR {(item.price * item.quantity).toLocaleString("en-LK")}
                          </p>
                          <p className="text-[11px] text-[#535766] mt-0.5">
                            LKR {item.price.toLocaleString("en-LK")} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#eaeaec] bg-[#fafafa]">
                    <div className="text-[12px] text-[#535766]">
                      <span className="font-semibold text-[#282c3f]">{order.paymentMethod}</span>
                      {" · "}Payment ID: <span className="font-mono text-[11px]">{order.paymentId}</span>
                    </div>
                    <Link
                      href={`/order-success?id=${order.id}`}
                      className="flex items-center gap-1.5 text-[13px] font-bold text-[#ff3f6c] hover:underline"
                    >
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
