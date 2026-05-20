import Link from "next/link";

export const metadata = {
  title: "SareeBazar | FAQ",
  description: "Common questions about ordering, delivery, and returns.",
};

const faqs = [
  {
    question: "How do I make a purchase?",
    answer:
      "Browse a saree you love, choose your size or variant, then click Add to Cart. From the cart, proceed to checkout and follow the on-screen steps to complete your order.",
  },
  {
    question: "What payment methods does SareeBazar accept?",
    answer:
      "We accept Cash on Delivery (COD) in eligible areas, as well as Visa and Mastercard. Bank transfer options are available during checkout when applicable.",
  },
  {
    question: "Will SareeBazar restock a sold-out item?",
    answer:
      "Restocks depend on demand and artisan availability. If a style is frequently requested, we typically restock within a few weeks. You can also reach out for similar recommendations.",
  },
  {
    question: "Can I ship to more than one address?",
    answer:
      "Each order ships to one delivery address. If you need multiple addresses, please place separate orders.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "If your order has not shipped, contact us right away and we will do our best to update it. Once dispatched, changes may not be possible.",
  },
  {
    question: "How long does delivery take, and how much does it cost?",
    answer:
      "Standard delivery is typically 2-5 business days. Delivery charges and taxes are shown at checkout based on your location and items.",
  },
  {
    question: "What is the time limit for a return request?",
    answer:
      "Returns or exchanges should be requested within 14 days of delivery. Items must be unused, in original condition, and include tags and invoice.",
  },
  {
    question: "How do I exchange a saree?",
    answer:
      "Start by reviewing our exchange policy and contact support with your order number. We will guide you through the step-by-step exchange process.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is confirmed, you will receive an email with tracking details. You can also use the Order Tracking page to view updates.",
  },
  {
    question: "Can I amend or cancel an order after placing it?",
    answer:
      "Orders are processed quickly, so changes are limited. Contact us within 10-20 minutes of placing the order and we will try to assist if it has not shipped.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Help Center
          </p>
          <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-[14px] text-gray-600">
            Quick answers to common questions about orders, delivery, and
            returns.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {faq.question}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            Still need help? Visit our contact page and we will get back to you
            quickly.
          </p>
          <div className="mt-4">
            <Link
              href="/contact#contact-email"
              className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
