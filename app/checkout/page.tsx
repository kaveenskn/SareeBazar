"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, Package, ChevronRight, Loader2, CreditCard, BadgeCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { getCheckoutItems, clearCheckoutItems, type CheckoutVariant } from "@/lib/cartStore";
import { placeOrder, type ShippingDetails, type OrderPayload } from "@/lib/ordersStore";
import { isLoggedIn } from "@/lib/authStore";
import Navbar from "@/app/components/Navbar";

interface ShippingCosts {
  cardPayment: number;
  cashOnDelivery: number;
}

const SRI_LANKA_REGIONS: Record<string, string[]> = {
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "North Western": ["Kurunegala", "Puttalam"],
  "Sabaragamuwa": ["Kegalle", "Ratnapura"],
  "Southern": ["Galle", "Hambantota", "Matara"],
  "Uva": ["Badulla", "Moneragala"],
  "Western": ["Colombo", "Gampaha", "Kalutara"]
};

const SRI_LANKA_PROVINCES = Object.keys(SRI_LANKA_REGIONS);


export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CheckoutVariant[]>([]);
  const [step, setStep] = useState<"summary" | "shipping" | "payment" | "processing">("summary");
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: "", email: "", phone: "",
    addressLine1: "", addressLine2: "",
    city: "", state: "", postalCode: "", country: "Sri Lanka",
  });
  const [payMethod, setPayMethod] = useState<"card" | "cod">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [shippingCosts, setShippingCosts] = useState<ShippingCosts>({ cardPayment: 0, cashOnDelivery: 0 });
  const [loadingShipping, setLoadingShipping] = useState(true);

  const handleShippingChange = (key: keyof ShippingDetails, value: string) => {
    setShipping((prev) => {
      const next = { ...prev, [key]: value };
      
      if (key === "state" && prev.state !== value) {
        next.city = ""; // Reset district if province changes
      }
      
      if (key === "city") {
        for (const [province, districts] of Object.entries(SRI_LANKA_REGIONS)) {
          if (districts.includes(value)) {
            next.state = province;
            break;
          }
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      toast.error("Please login to place an order.");
      router.replace("/login?redirect=/checkout");
      return;
    }
    const data = getCheckoutItems();
    if (!data.length) { router.replace("/collections"); return; }
    setItems(data);

    // Fetch dynamic shipping costs from admin settings
    fetch("/api/backend/shop-info/shipping-costs")
      .then((res) => res.json())
      .then((data) => {
        setShippingCosts({
          cardPayment: data.cardPayment ?? 0,
          cashOnDelivery: data.cashOnDelivery ?? 0,
        });
      })
      .catch(() => {
        console.error("Failed to fetch shipping costs, using defaults");
      })
      .finally(() => setLoadingShipping(false));
  }, [router]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const currentShippingFee = payMethod === "cod" ? shippingCosts.cashOnDelivery : shippingCosts.cardPayment;
  const total = subtotal + currentShippingFee;

  const isShippingValid = () =>
    shipping.fullName && shipping.email && shipping.phone &&
    shipping.addressLine1 && shipping.city && shipping.state && shipping.postalCode;

  const isCardValid = () =>
    card.number.replace(/\s/g, "").length === 16 && card.expiry && card.cvv && card.name;

  const handlePlaceOrder = async () => {
    if (payMethod === "card" && !isCardValid()) {
      toast.error("Please fill in all card details.");
      return;
    }
    setStep("processing");

    try {
      const payload: OrderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          selectedColor: i.selectedColor,
          selectedColorHex: i.selectedColorHex,
          selectedColorImage: i.selectedColorImage,
          quantity: i.quantity,
          price: i.price,
          originalPrice: i.originalPrice ?? i.price,
          image: i.image,
          category: i.category,
          fabric: i.fabric ?? "",
        })),
        shipping,
        subtotal,
        shippingFee: currentShippingFee,
        discount: 0,
        total,
        paymentMethod: payMethod === "card" ? "Razorpay" : "Cash on Delivery",
        paymentId: payMethod === "card" ? "" : undefined,
      };

      const data = await placeOrder(payload);
      clearCheckoutItems();
      router.push(`/order-success?id=${data.order.orderId}`);
    } catch (error: unknown) {
      setStep("payment");
      const message = error instanceof Error ? error.message : "Failed to place order";
      toast.error(message);
    }
  };

  if (!items.length) return null;

  return (
    <main className="min-h-screen bg-[#f7f0f4] pt-[90px]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <Navbar />

      {/* ─── Processing Overlay ─── */}
      {step === "processing" && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-5">
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[18px] font-bold text-[#282c3f]">Processing Payment…</p>
            <p className="text-[14px] text-[#535766]">Please do not close this window.</p>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[#535766] hover:text-primary transition-colors font-semibold text-[14px] mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* ─── Progress Bar ─── */}
        <div className="flex items-center gap-2 mb-8 text-[13px] font-semibold">
          {["summary", "shipping", "payment"].map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                step === s ? "bg-primary text-white" :
                (["summary","shipping","payment"].indexOf(step) > idx) ? "bg-[#03a685] text-white" :
                "bg-[#e8e8e1] text-[#94969f]"
              }`}>{idx + 1}</div>
              <span className={step === s ? "text-[#282c3f]" : "text-[#94969f] capitalize"}>{s}</span>
              {idx < 2 && <ChevronRight size={14} className="text-[#d4d5d9]" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── LEFT: Steps ─── */}
          <div className="flex-1 space-y-4">

            {/* STEP 1: Order Summary */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eaeaec]">
              <button
                onClick={() => step !== "processing" && setStep("summary")}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-[#eaeaec]"
              >
                <h2 className="text-[15px] font-bold text-[#282c3f] uppercase tracking-wide flex items-center gap-2">
                  <Package size={18} className="text-primary" /> Order Summary
                </h2>
                {step !== "summary" && <span className="text-[12px] text-primary font-semibold">Edit</span>}
              </button>

              {step === "summary" && (
                <div className="p-6 space-y-5">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#fdf6fb] border border-[#f0dce8]">
                      <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <Image src={item.selectedColorImage || item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-[#282c3f] leading-tight">{item.name}</h3>
                        <p className="text-[13px] text-[#535766] mt-1">{item.category}{item.fabric ? ` · ${item.fabric}` : ""}</p>

                        {/* Variant Chip */}
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border-2 border-white shadow-md flex-shrink-0"
                            style={{ background: item.selectedColorHex }}
                          />
                          <span className="text-[13px] font-semibold text-[#282c3f] bg-[#fff0f5] px-2 py-0.5 rounded-full border border-[#ffd6e5]">
                            {item.selectedColor}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[13px] text-[#535766]">Qty: <strong className="text-[#282c3f]">{item.quantity}</strong></span>
                          <span className="text-[16px] font-bold text-[#282c3f]">
                            LKR {(item.price * item.quantity).toLocaleString("en-LK")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setStep("shipping")}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold text-[14px] uppercase tracking-wider hover:opacity-90 transition-colors mt-2"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}
            </section>

            {/* STEP 2: Shipping Details */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eaeaec]">
              <button
                onClick={() => step !== "processing" && step !== "summary" && setStep("shipping")}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-[#eaeaec]"
              >
                <h2 className="text-[15px] font-bold text-[#282c3f] uppercase tracking-wide flex items-center gap-2">
                  <Truck size={18} className="text-primary" /> Shipping Details
                </h2>
                {step === "payment" && <span className="text-[12px] text-primary font-semibold">Edit</span>}
              </button>

              {step === "shipping" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const availableDistricts = shipping.state 
                        ? SRI_LANKA_REGIONS[shipping.state] 
                        : Object.values(SRI_LANKA_REGIONS).flat().sort();

                      return [
                        { key: "fullName", label: "Full Name", span: false },
                        { key: "email", label: "Email Address", span: false },
                        { key: "phone", label: "Phone Number", span: false },
                        { key: "addressLine1", label: "Address Line 1", span: true },
                        { key: "addressLine2", label: "Address Line 2 (optional)", span: true },
                        { key: "state", label: "Province", span: false, type: "select", options: SRI_LANKA_PROVINCES },
                        { key: "city", label: "District", span: false, type: "select", options: availableDistricts },
                        { key: "postalCode", label: "Postal Code", span: false },
                        { key: "country", label: "Country", span: false, disabled: true },
                      ].map(({ key, label, span, type, options, disabled }) => (
                        <div key={key} className={span ? "sm:col-span-2" : ""}>
                          <label className="block text-[12px] font-semibold text-[#535766] uppercase tracking-wide mb-1.5">{label}</label>
                          {type === "select" ? (
                            <div className="relative">
                              <select
                                value={shipping[key as keyof ShippingDetails] || ""}
                                onChange={(e) => handleShippingChange(key as keyof ShippingDetails, e.target.value)}
                                className="w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] text-[#282c3f] bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                              >
                                <option value="" disabled>Select {label}</option>
                                {options?.map(opt => (
                                  <option key={opt} value={opt as string}>{opt as string}</option>
                                ))}
                              </select>
                              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                            </div>
                          ) : (
                            <input
                              type={key === "email" ? "email" : "text"}
                              value={shipping[key as keyof ShippingDetails] || ""}
                              onChange={(e) => handleShippingChange(key as keyof ShippingDetails, e.target.value)}
                              className={`w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] text-[#282c3f] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                              placeholder={label as string}
                              disabled={disabled}
                            />
                          )}
                        </div>
                      ));
                    })()}
                  </div>

                  <button
                    onClick={() => { if (isShippingValid()) setStep("payment"); else toast.error("Please fill all required fields."); }}
                    className="mt-6 w-full h-12 bg-primary text-white rounded-xl font-bold text-[14px] uppercase tracking-wider hover:opacity-90 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="px-6 py-4 bg-[#fdf6fb]">
                  <p className="text-[13px] text-[#535766]">
                    <strong className="text-[#282c3f]">{shipping.fullName}</strong> · {shipping.addressLine1}, {shipping.city}, {shipping.state} {shipping.postalCode}
                  </p>
                </div>
              )}
            </section>

            {/* STEP 3: Payment */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#eaeaec]">
              <div className="w-full flex items-center justify-between px-6 py-4 border-b border-[#eaeaec]">
                <h2 className="text-[15px] font-bold text-[#282c3f] uppercase tracking-wide flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> Payment
                </h2>
              </div>

              {step === "payment" && (
                <div className="p-6">
                  {/* Method Toggle */}
                  <div className="flex gap-3 mb-6">
                    {(["card", "cod"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPayMethod(m)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 text-[13px] font-bold uppercase tracking-wide transition-all ${
                          payMethod === m
                            ? "border-primary bg-[#fff5f7] text-primary"
                            : "border-[#d4d5d9] text-[#535766] hover:border-primary"
                        }`}
                      >
                        {m === "card" ? "💳 Card" : "💵 Cash on Delivery"}
                      </button>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#535766] uppercase tracking-wide mb-1.5">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          value={card.number}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g,"").slice(0,16);
                            setCard((p) => ({ ...p, number: v.replace(/(.{4})/g,"$1 ").trim() }));
                          }}
                          className="w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#535766] uppercase tracking-wide mb-1.5">Name on Card</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={card.name}
                          onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-semibold text-[#535766] uppercase tracking-wide mb-1.5">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength={7}
                            value={card.expiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g,"").slice(0,4);
                              if (v.length > 2) v = v.slice(0,2) + " / " + v.slice(2);
                              setCard((p) => ({ ...p, expiry: v }));
                            }}
                            className="w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#535766] uppercase tracking-wide mb-1.5">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={3}
                            value={card.cvv}
                            onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g,"").slice(0,3) }))}
                            className="w-full px-4 py-3 border border-[#d4d5d9] rounded-xl text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {payMethod === "cod" && (
                    <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#86efac] text-[14px] text-[#16a34a] font-medium space-y-1">
                      <p>You will pay <strong>LKR {total.toLocaleString("en-LK")}</strong> in cash when your order is delivered.</p>
                      {shippingCosts.cashOnDelivery > 0 && (
                        <p className="text-[12px] text-[#15803d]">
                          Includes COD shipping charge of LKR {shippingCosts.cashOnDelivery.toLocaleString("en-LK")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-[12px] text-[#535766]">
                    <ShieldCheck size={14} className="text-[#03a685]" />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="mt-6 w-full h-14 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-bold text-[16px] uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    <BadgeCheck size={20} />
                    Place Order · LKR {total.toLocaleString("en-LK")}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* ─── RIGHT: Price Breakdown (sticky) ─── */}
          <aside className="lg:w-[340px] flex-shrink-0">
            <div className="sticky top-[100px] bg-white rounded-2xl shadow-sm border border-[#eaeaec] p-6 space-y-4">
              <h3 className="text-[14px] font-bold text-[#282c3f] uppercase tracking-wide border-b border-[#eaeaec] pb-3">
                Price Details
              </h3>

              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.selectedColorImage || item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#282c3f] truncate">{item.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-3 h-3 rounded-full border border-white shadow" style={{ background: item.selectedColorHex }} />
                      <span className="text-[11px] text-[#535766]">{item.selectedColor} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-bold text-[#282c3f]">LKR {(item.price * item.quantity).toLocaleString("en-LK")}</span>
                </div>
              ))}

              <div className="border-t border-[#eaeaec] pt-4 space-y-2">
                <div className="flex justify-between text-[13px] text-[#535766]">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toLocaleString("en-LK")}</span>
                </div>
                <div className="flex justify-between text-[13px] text-[#535766]">
                  <span className="flex items-center gap-1">
                    Shipping
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#f5f5f6] text-[#94969f] font-medium">
                      {payMethod === "cod" ? "COD" : "Card"}
                    </span>
                  </span>
                  <span>{currentShippingFee === 0 ? <span className="text-[#03a685] font-semibold">FREE</span> : `LKR ${currentShippingFee.toLocaleString("en-LK")}`}</span>
                </div>
                <div className="flex justify-between text-[16px] font-bold text-[#282c3f] border-t border-[#eaeaec] pt-3 mt-2">
                  <span>Total</span>
                  <span>LKR {total.toLocaleString("en-LK")}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {["100% Authentic Products","Easy 14-Day Returns","Secured Checkout"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[12px] text-[#535766]">
                    <ShieldCheck size={13} className="text-[#03a685] flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
