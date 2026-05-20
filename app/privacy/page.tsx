export const metadata = {
  title: "SareeBazar | Privacy Policy",
  description: "Privacy policy for SareeBazar.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          SareeBazar respects your privacy and handles personal data only to
          provide and improve our services.
        </p>

        <div className="mt-8 space-y-6 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <section>
            <h2 className="text-lg font-serif text-gray-900">
              Information We Collect
            </h2>
            <p className="mt-2 text-[14px] text-gray-600">
              We may collect details you provide during checkout or account
              creation, such as name, email, phone number, and delivery address.
              If you contact us, we may store your message for support purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-gray-900">
              How We Use Information
            </h2>
            <ul className="mt-2 space-y-2 text-[14px] text-gray-600">
              <li>Process orders, deliveries, and returns.</li>
              <li>Improve our website experience and product offerings.</li>
              <li>Send order updates and support responses.</li>
              <li>Prevent fraud and maintain site security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-gray-900">Cookies</h2>
            <p className="mt-2 text-[14px] text-gray-600">
              We use cookies to remember preferences and understand site usage.
              You can disable cookies in your browser settings, but some
              features may not work as expected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-gray-900">
              Third-Party Links
            </h2>
            <p className="mt-2 text-[14px] text-gray-600">
              Our site may link to third-party services. Please review their
              privacy policies before sharing personal information.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
