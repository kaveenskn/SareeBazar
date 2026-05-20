"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  getCart, removeFromCart, updateCartQty,
  setCheckoutItems, type CartItem,
} from "@/lib/cartStore";
import Navbar from "@/app/components/Navbar";

const SHIPPING_FEE = 350;

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  const sync = () => setItems(getCart());

  useEffect(() => {
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total    = subtotal + (items.length ? SHIPPING_FEE : 0);

  const handleRemove = (productId: number, color: string) => {
    removeFromCart(productId, color);
    toast("Removed from bag", { icon: "🗑️" });
  };

  const handleCheckout = () => {
    if (!items.length) return;
    setCheckoutItems(items.map((i) => ({ ...i })));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#f7f0f4] pt-[90px]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <h1 className="text-[22px] font-bold text-[#282c3f] mb-6 flex items-center gap-2">
          <ShoppingBag size={22} className="text-[#ff3f6c]" />
          My Bag
          <span className="text-[15px] font-normal text-[#535766]">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-[#eaeaec]">
            <ShoppingBag size={56} className="text-[#d4d5d9] mx-auto mb-4" />
            <h2 className="text-[20px] font-bold text-[#282c3f] mb-2">Your bag is empty</h2>
            <p className="text-[14px] text-[#535766] mb-6">Add some beautiful sarees to get started.</p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff3f6c] text-white font-bold rounded-xl text-[14px] hover:bg-[#ed315d] transition-colors"
            >
              Browse Collections <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items List */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.selectedColor}`}
                  className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm flex gap-4 p-5">
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src={item.selectedColorImage || item.image}
                      alt={item.name}
                      fill className="object-cover" unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="text-[15px] font-bold text-[#282c3f] hover:text-[#ff3f6c] transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-[13px] text-[#535766] mt-0.5">{item.category}{item.fabric ? ` · ${item.fabric}` : ""}</p>

                    {/* Color Variant Chip */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                        style={{ background: item.selectedColorHex }} />
                      <span className="text-[12px] font-semibold text-[#282c3f] bg-[#fff0f5] px-2.5 py-0.5 rounded-full border border-[#ffd6e5]">
                        {item.selectedColor}
                      </span>
                    </div>

                    {/* Qty + Price */}
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      <div className="flex items-center border border-[#d4d5d9] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.productId, item.selectedColor, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#282c3f] hover:bg-[#f5f5f6] transition-colors text-[18px] font-bold"
                        >−</button>
                        <span className="w-10 h-9 flex items-center justify-center text-[14px] font-bold text-[#282c3f] border-x border-[#d4d5d9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.selectedColor, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-[#282c3f] hover:bg-[#f5f5f6] transition-colors text-[18px] font-bold"
                        >+</button>
                      </div>

                      <div className="text-right">
                        <p className="text-[16px] font-bold text-[#282c3f]">
                          LKR {(item.price * item.quantity).toLocaleString("en-LK")}
                        </p>
                        {item.originalPrice && (
                          <p className="text-[12px] text-[#7e818c] line-through">
                            LKR {(item.originalPrice * item.quantity).toLocaleString("en-LK")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.productId, item.selectedColor)}
                    className="self-start p-2 text-[#94969f] hover:text-[#ff3f6c] transition-colors rounded-lg hover:bg-[#fff0f5]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="lg:w-[320px] flex-shrink-0">
              <div className="sticky top-[100px] bg-white rounded-2xl border border-[#eaeaec] shadow-sm p-6 space-y-4">
                <h2 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide border-b border-[#eaeaec] pb-3">
                  Price Details
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px] text-[#535766]">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                    <span>LKR {subtotal.toLocaleString("en-LK")}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#535766]">
                    <span>Shipping</span>
                    <span>LKR {SHIPPING_FEE.toLocaleString("en-LK")}</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-bold text-[#282c3f] pt-2 border-t border-[#eaeaec]">
                    <span>Total</span>
                    <span>LKR {total.toLocaleString("en-LK")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full h-13 py-3.5 bg-gradient-to-r from-[#ff3f6c] to-[#d63060] text-white rounded-xl font-bold text-[15px] uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-[#ff3f6c]/25 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div className="space-y-2 pt-1">
                  {["100% Original Products", "Easy 14-day Returns", "Secure Payment"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-[12px] text-[#535766]">
                      <ShieldCheck size={13} className="text-[#03a685] flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
