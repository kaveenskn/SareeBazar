import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Shipping Info",
  description: "Delivery timelines and shipping details.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Delivery
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Shipping Information
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Standard delivery is typically 2-5 business days. Costs and estimated
          delivery dates are shown during checkout.
        </p>
        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            Need help with a shipment? Track your order or contact support.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/track-order"
              className="inline-flex items-center rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
