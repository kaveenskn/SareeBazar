import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Wishlist",
  description: "Your saved SareeBazar favorites.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Favorites
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Your wishlist will appear here once you save your favorite sarees.
        </p>
        <div className="mt-8">
          <Link
            href="/collections"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
