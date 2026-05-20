import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Help Center",
  description: "Get help with orders, delivery, and returns.",
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 py-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Help Center
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          We are here to assist with orders, delivery questions, and returns.
        </p>
        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            Start with our FAQ or reach out to our team directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Go to FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
