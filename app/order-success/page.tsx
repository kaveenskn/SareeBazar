"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Package, Truck, MapPin, ArrowRight, Home } from "lucide-react";
import { getOrder, type Order } from "@/lib/ordersStore";
import Navbar from "@/app/components/Navbar";

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const id = params.get("id");
    if (!id) { router.replace("/"); return; }
    const fetchOrder = async () => {
      const found = await getOrder(id);
      if (!found) { router.replace("/"); return; }
      setOrder(found);
    };
    fetchOrder();
  }, [params, router]);

  if (!order) return null;

  const statusSteps = ["confirmed", "processing", "shipped", "delivered"];
  const currentIdx = statusSteps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-[#f7f0f4] pt-[90px]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <Navbar />

      <div className="max-w-[720px] mx-auto px-4 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#535766] hover:text-[#ff3f6c] transition-colors font-semibold text-[14px] mb-6"
        >
          <ArrowRight size={18} className="rotate-180" />
          Back
        </button>

        {/* ── Success Banner ── */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#eaeaec] mb-6">
          <div className="w-20 h-20 rounded-full bg-[#f0fdf4] border-4 border-[#86efac] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-[#16a34a]" />
          </div>
          <h1 className="text-[26px] font-bold text-[#282c3f]">Order Placed! 🎉</h1>
          <p className="text-[15px] text-[#535766] mt-2">
            Thank you, <strong className="text-[#282c3f]">{order.shipping.fullName}</strong>! Your saree is on its way.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#fdf6fb] border border-[#f0dce8] rounded-full px-5 py-2">
            <span className="text-[13px] text-[#535766]">Order ID:</span>
            <span className="text-[14px] font-bold text-[#ff3f6c] tracking-wide">{order.id}</span>
          </div>
          <p className="text-[13px] text-[#535766] mt-2">
            Confirmation sent to <strong>{order.shipping.email}</strong>
          </p>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center gap-2">
            <Package size={18} className="text-[#ff3f6c]" />
            <h2 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide">Your Items</h2>
          </div>
          <div className="divide-y divide-[#eaeaec]">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-5">
                <div className="relative w-16 h-22 flex-shrink-0 rounded-xl overflow-hidden shadow-sm" style={{ height: "88px" }}>
                  <Image src={item.selectedColorImage || item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#282c3f]">{item.name}</p>
                  <p className="text-[12px] text-[#535766] mt-0.5">{item.category}{item.fabric ? ` · ${item.fabric}` : ""}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white shadow-md" style={{ background: item.selectedColorHex }} />
                    <span className="text-[12px] font-semibold text-[#282c3f] bg-[#fff0f5] px-2 py-0.5 rounded-full border border-[#ffd6e5]">
                      {item.selectedColor}
                    </span>
                    <span className="text-[12px] text-[#535766]">× {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[15px] font-bold text-[#282c3f]">LKR {(item.price * item.quantity).toLocaleString("en-LK")}</p>
                  {item.originalPrice && (
                    <p className="text-[12px] text-[#7e818c] line-through">LKR {(item.originalPrice * item.quantity).toLocaleString("en-LK")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[#fdf6fb] border-t border-[#eaeaec] space-y-1.5">
            <div className="flex justify-between text-[13px] text-[#535766]">
              <span>Subtotal</span><span>LKR {order.subtotal.toLocaleString("en-LK")}</span>
            </div>
            <div className="flex justify-between text-[13px] text-[#535766]">
              <span>Shipping</span><span>LKR {order.shippingFee.toLocaleString("en-LK")}</span>
            </div>
            <div className="flex justify-between text-[16px] font-bold text-[#282c3f] pt-1 border-t border-[#eaeaec] mt-2">
              <span>Total Paid</span><span>LKR {order.total.toLocaleString("en-LK")}</span>
            </div>
            <p className="text-[12px] text-[#535766]">Via: {order.paymentMethod}</p>
          </div>
        </div>

        {/* ── Shipping Address ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center gap-2">
            <MapPin size={18} className="text-[#ff3f6c]" />
            <h2 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide">Shipping To</h2>
          </div>
          <div className="p-6 text-[14px] text-[#535766] space-y-1">
            <p className="font-bold text-[#282c3f] text-[15px]">{order.shipping.fullName}</p>
            <p>{order.shipping.addressLine1}</p>
            {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
            <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
            <p>{order.shipping.country}</p>
            <p className="mt-2">📞 {order.shipping.phone}</p>
          </div>
        </div>

        {/* ── Status Tracker ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#eaeaec] flex items-center gap-2">
            <Truck size={18} className="text-[#ff3f6c]" />
            <h2 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide">Order Status</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-0">
              {statusSteps.map((s, idx) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all ${
                      idx <= currentIdx ? "bg-[#ff3f6c] border-[#ff3f6c] text-white" : "bg-white border-[#d4d5d9] text-[#94969f]"
                    }`}>
                      {idx < currentIdx ? "✓" : idx + 1}
                    </div>
                    <span className={`text-[10px] font-semibold capitalize whitespace-nowrap ${idx <= currentIdx ? "text-[#ff3f6c]" : "text-[#94969f]"}`}>
                      {s}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 ${idx < currentIdx ? "bg-[#ff3f6c]" : "bg-[#d4d5d9]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="flex-1 h-12 bg-[#ff3f6c] text-white rounded-xl font-bold text-[14px] uppercase tracking-wider hover:bg-[#ed315d] transition-colors flex items-center justify-center gap-2">
            <Package size={18} /> View My Orders <ArrowRight size={16} />
          </Link>
          <Link href="/collections" className="flex-1 h-12 bg-white border-2 border-[#282c3f] text-[#282c3f] rounded-xl font-bold text-[14px] uppercase tracking-wider hover:bg-[#282c3f] hover:text-white transition-all flex items-center justify-center gap-2">
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
