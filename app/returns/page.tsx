import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Returns & Refunds",
  description: "Return and exchange guidelines for SareeBazar orders.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 py-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Returns
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Returns & Refunds
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Return or exchange requests should be made within 14 days of delivery.
          Items must be unused and in original condition.
        </p>
        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            For step-by-step help, reach out to our support team.
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
