import Link from "next/link";

export const metadata = {
  title: "SareeBazar | Returns & Refunds",
  description: "Return and exchange guidelines for SareeBazar orders.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Returns
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Returns & Refunds
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Order cancellation, return, and exchange details for SareeBazar.
        </p>

        <section className="mt-8 space-y-6 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <div>
            <h2 className="text-lg font-serif text-gray-900">
              Order Cancellation, Return & Exchange
            </h2>
            <ul className="mt-3 space-y-3 text-[14px] text-gray-600">
              <li>
                SareeBazar accepts returns for change of mind if the request is
                received within 14 days of delivery, and items are returned in
                original packaging, unused, and in resalable condition.
              </li>
              <li>
                Exchanges can be requested by contacting our support team with
                your purchase invoice and product details.
              </li>
              <li>
                You may return or exchange products via courier. Once the item
                is received and verified, we will process the exchange and ship
                the replacement.
              </li>
              <li>
                Return or exchange shipping is at the customer&apos;s expense,
                unless the product is damaged or incorrect.
              </li>
              <li>
                If you receive a damaged or wrong product, return or exchange
                shipping charges are waived.
              </li>
              <li>
                Approved refunds are issued as store credit for a future
                purchase, and you will be notified by email.
              </li>
              <li>
                SareeBazar refunds the value of the goods returned, but does not
                refund any shipping paid.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-serif text-gray-900">Cancellations</h2>
            <p className="mt-3 text-[14px] text-gray-600">
              If you change your mind within 12 hours of placing your order, you
              can cancel without a cancellation fee.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-serif text-gray-900">
              Exceptions (Sale Items)
            </h2>
            <p className="mt-3 text-[14px] text-gray-600">
              Products purchased under promotional offers or discounted prices
              are final sale and are not eligible for exchange or refund.
            </p>
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            For step-by-step help, reach out to our support team.
          </p>
          <div className="mt-4">
            <Link
              href="/contact#contact-email"
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
