"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export type ModalType =
  | "about"
  | "faq"
  | "shipping"
  | "returns"
  | "privacy"
  | "terms"
  | "help"
  | null;

interface FooterModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  shopInfo?: any;
}

export function FooterModals({ activeModal, onClose, shopInfo }: FooterModalsProps) {
  const storeName = shopInfo?.storeName || "SareeBazar";

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#fbeff6] rounded-2xl shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-[#fbeff6] z-20 flex items-center justify-between p-4 border-b border-[#dfc7a5]/30">
          <h2 className="text-xl font-serif text-gray-900 capitalize">
            {activeModal === "faq"
              ? "Frequently Asked Questions"
              : activeModal === "about"
              ? "About Us"
              : activeModal === "returns"
              ? "Returns & Refunds"
              : activeModal === "shipping"
              ? "Shipping Information"
              : activeModal}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white/50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          {activeModal === "faq" && <FaqContent />}
          {activeModal === "about" && <AboutContent storeName={storeName} />}
          {activeModal === "shipping" && <ShippingContent />}
          {activeModal === "returns" && <ReturnsContent />}
          {activeModal === "privacy" && <PrivacyContent />}
          {activeModal === "terms" && <TermsContent />}
          {activeModal === "help" && <HelpContent />}
        </div>
      </div>
    </div>
  );
}

function AboutContent({ storeName }: { storeName: string }) {
  return (
    <div className="space-y-6 text-[14px] text-gray-600 leading-relaxed">
      <p>
        Founded in 2005 in Badulla, Sri Lanka, {storeName} began as a single
        boutique with a small, dedicated team.
      </p>
      <p>
        Over the years, we have embraced change and growth, evolving into a
        trusted destination for timeless sarees and modern styling.
      </p>
      <p>
        Our journey from a single store to a growing network across Sri Lanka
        reflects our commitment to accessible, high-quality fashion.
      </p>
      <p>
        Today, {storeName} continues to expand its reach while staying true to
        the craftsmanship, culture, and community that define us.
      </p>
      <div className="bg-white/60 p-4 rounded-xl border border-[#dfc7a5]/30 mt-6">
        <h3 className="font-serif text-lg text-gray-900 mb-2">Our Values</h3>
        <p>
          <span className="font-semibold text-gray-900">SMILE</span> stands for
          Synergy, Mastery, Integrity, Liveliness, and Empathy. We believe that
          living these values creates a welcoming environment for both our team
          and our customers.
        </p>
      </div>
    </div>
  );
}

function FaqContent() {
  const faqs = [
    {
      q: "How do I make a purchase?",
      a: "Browse a saree you love, choose your size or variant, then click Add to Cart. From the cart, proceed to checkout and follow the on-screen steps.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD) in eligible areas, as well as Visa and Mastercard.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery is typically 2-5 business days. Delivery charges are shown at checkout.",
    },
    {
      q: "What is the time limit for a return request?",
      a: "Returns or exchanges should be requested within 14 days of delivery.",
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="bg-white/70 p-4 rounded-xl border border-[#dfc7a5]/40"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
          <p className="text-sm text-gray-600">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}

function ShippingContent() {
  return (
    <div className="text-[14px] text-gray-600 space-y-4">
      <p>
        Standard delivery is typically 2-5 business days. Costs and estimated
        delivery dates are shown during checkout based on your location and items.
      </p>
      <div className="bg-white/70 p-4 rounded-xl border border-[#dfc7a5]/40 mt-4">
        <h3 className="font-semibold text-gray-900 mb-1">Track Your Order</h3>
        <p>
          Once your order ships, you will receive an email with tracking details.
          You can use those details to monitor the progress of your shipment.
        </p>
      </div>
    </div>
  );
}

function ReturnsContent() {
  return (
    <div className="text-[14px] text-gray-600 space-y-4">
      <ul className="list-disc pl-5 space-y-2">
        <li>
          We accept returns for change of mind if the request is received within 14
          days of delivery, and items are unused and in original packaging.
        </li>
        <li>
          Exchanges can be requested by contacting our support team with your
          purchase invoice.
        </li>
        <li>
          Return shipping is at the customer&apos;s expense, unless the product is
          damaged or incorrect.
        </li>
        <li>
          Products purchased under promotional offers or discounted prices are final
          sale and are not eligible for exchange or refund.
        </li>
      </ul>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="text-[14px] text-gray-600 space-y-4">
      <p>
        We respect your privacy and handle personal data only to provide and
        improve our services.
      </p>
      <h3 className="font-semibold text-gray-900 mt-4">Information We Collect</h3>
      <p>
        We may collect details you provide during checkout, such as name, email,
        phone number, and delivery address.
      </p>
      <h3 className="font-semibold text-gray-900 mt-4">How We Use It</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Process orders, deliveries, and returns.</li>
        <li>Send order updates and support responses.</li>
        <li>Prevent fraud and maintain site security.</li>
      </ul>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="text-[14px] text-gray-600 space-y-4">
      <p>
        By accessing and placing an order with us, you confirm that you are in
        agreement with and bound by the terms of service.
      </p>
      <p>
        Our full terms and conditions governing the use of this website will be
        available here shortly.
      </p>
    </div>
  );
}

function HelpContent() {
  return (
    <div className="text-[14px] text-gray-600 space-y-4">
      <p>
        We are here to assist with orders, delivery questions, and returns.
      </p>
      <div className="bg-white/70 p-4 rounded-xl border border-[#dfc7a5]/40">
        <h3 className="font-semibold text-gray-900 mb-1">Contact Us</h3>
        <p>
          If you cannot find the answer you are looking for in our FAQ, please
          reach out to us via the contact email provided in the footer.
        </p>
      </div>
    </div>
  );
}
