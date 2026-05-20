import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Order Tracking",
  description: "Track your SareeBazar order status.",
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Order Tracking
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Enter your order details here once tracking is enabled. We will keep
          this page updated with the tracking experience.
        </p>
        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            Need immediate assistance? Contact our support team.
          </p>
          <div className="mt-4">
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
