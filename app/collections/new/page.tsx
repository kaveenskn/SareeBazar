import Link from "next/link";

export const metadata = {
  title: "SareeBazar | New Arrivals",
  description: "Discover the newest sarees in our collection.",
};

export default function NewArrivalsPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 py-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Collections
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          New Arrivals
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Freshly curated sarees will appear here. For now, explore the full
          collection.
        </p>
        <div className="mt-8">
          <Link
            href="/collections"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
