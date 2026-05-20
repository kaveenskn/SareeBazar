import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = {
  title: "SareeBazar | Contact Us",
  description: "Get in touch with the SareeBazar team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fbeff6] px-6 pt-24 pb-12 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Support
        </p>
        <h1 className="mt-2 text-3xl font-serif text-gray-900 md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-[14px] text-gray-600">
          Share your questions or feedback and our team will respond soon.
        </p>
        <div
          id="contact-email"
          className="mt-8 rounded-2xl border border-primary/20 bg-white/70 p-6"
        >
          <h2 className="text-lg font-serif text-gray-900">Email Support</h2>
          <p className="mt-2 text-[14px] text-gray-600">
            Send your message to our support team and we will get back to you
            within 1-2 business days.
          </p>
          <a
            href="mailto:support@sareebazar.lk"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Mail size={16} />
            support@sareebazar.lk
          </a>
        </div>
        <div className="mt-8 rounded-2xl border border-[#dfc7a5]/40 bg-white/70 p-6">
          <p className="text-[14px] text-gray-600">
            Prefer a quick answer? Visit the FAQ for common questions.
          </p>
          <div className="mt-4">
            <Link
              href="/faq"
              className="inline-flex items-center rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Visit FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
