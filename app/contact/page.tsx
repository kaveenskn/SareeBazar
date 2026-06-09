"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface ShopInfo {
  storeName: string;
  supportEmail: string;
  phone: string;
  address: string;
  openingHours: string;
}

export default function ContactPage() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  const email = shopInfo?.supportEmail || "support@sareebazar.lk";
  const phone = shopInfo?.phone || "+94 77 123 4567";
  const address = shopInfo?.address || "No. 25, Main Street, Colombo, Sri Lanka";
  const openingHours = shopInfo?.openingHours || "Mon – Sat : 9.00 AM – 8.00 PM";

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

        {/* Email Support */}
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
            href={`mailto:${email}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Mail size={16} />
            {email}
          </a>
        </div>

        {/* Phone */}
        <div className="mt-4 rounded-2xl border border-primary/20 bg-white/70 p-6">
          <h2 className="text-lg font-serif text-gray-900">Phone</h2>
          <p className="mt-2 text-[14px] text-gray-600">
            Call us during business hours for immediate assistance.
          </p>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Phone size={16} />
            {phone}
          </a>
        </div>

        {/* Address */}
        <div className="mt-4 rounded-2xl border border-primary/20 bg-white/70 p-6">
          <h2 className="text-lg font-serif text-gray-900">Visit Us</h2>
          <p className="mt-2 text-[14px] text-gray-600">
            Come visit our boutique in person for a premium shopping experience.
          </p>
          <div className="mt-4 flex items-start gap-2 text-sm font-semibold text-primary">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-primary flex-shrink-0" />
            <span>{openingHours}</span>
          </div>
        </div>

        {/* FAQ Link */}
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
