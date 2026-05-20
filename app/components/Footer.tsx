"use client";

import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, ArrowRight, Camera } from "lucide-react";

// Social SVG Components
const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#fbeff6] pt-16 pb-8 border-t border-[#dfc7a5]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* 1. Brand Section (Col Span 3) */}
          <div className="lg:col-span-3">
            <Link
              href="/"
              className="text-3xl font-serif tracking-wide flex items-center mb-6"
            >
              <span className="text-primary">Saree</span>
              <span className="text-gray-900">Bazar</span>
            </Link>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-6 font-medium">
              Weaving tradition into modern elegance. Discover handpicked,
              premium sarees crafted for the contemporary woman.
            </p>
            <p className="text-sm font-serif italic text-primary">
              "Elegance in every thread."
            </p>

            {/* 6. Social Media */}
            <div className="flex items-center gap-4 mt-8">
              <SocialIcon icon={<InstagramIcon size={18} />} href="#" />
              <SocialIcon icon={<FacebookIcon size={18} />} href="#" />
              <SocialIcon icon={<TwitterIcon size={18} />} href="#" />
              <SocialIcon icon={<YoutubeIcon size={18} />} href="#" />
            </div>

            <div className="mt-6 flex items-center gap-6 flex-nowrap">
              <div className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-[12px] font-semibold text-gray-900">
                  Secure Checkout · 100% Protected
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-[#dfc7a5]/40"></div>
              <div className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
                <Truck size={18} className="text-primary" />
                <span className="text-[12px] font-semibold text-gray-900">
                  Fast Delivery · Global Shipping
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
                We Accept
              </span>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-white border border-[#dfc7a5] rounded flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-[#1a1f71]">
                    VISA
                  </span>
                </div>
                <div className="w-10 h-6 bg-white border border-[#dfc7a5] rounded flex items-center justify-center shadow-sm">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#eb001b] mix-blend-multiply"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f79e1b] mix-blend-multiply"></div>
                  </div>
                </div>
                <div className="w-10 h-6 bg-white border border-[#dfc7a5] rounded flex items-center justify-center shadow-sm px-1">
                  <span className="text-[8px] font-bold text-gray-800 leading-none text-center">
                    CASH ON
                    <br />
                    DELIVERY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Quick Links (Col Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-6 mt-1">
              Shop
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/collections">Shop Sarees</FooterLink>
              <FooterLink href="/collections?category=bridal#filters">
                Bridal Collection
              </FooterLink>
              <FooterLink href="/wishlist">Wishlist</FooterLink>
            </ul>
          </div>

          {/* 3. Customer Support (Col Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-6 mt-1">
              Support
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/shipping">Shipping Info</FooterLink>
              <FooterLink href="/returns">Returns & Refunds</FooterLink>
              <FooterLink href="/track-order">Order Tracking</FooterLink>
            </ul>
          </div>

          {/* 4. Contact & Newsletter (Col Span 5) */}
          <div className="lg:col-span-5 space-y-10">
            {/* 8. AI Fashion Experience Section */}
            <div className="bg-white/60 rounded-2xl p-6 border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-colors shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={64} className="text-primary" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Sparkles size={12} />
                  AI Powered
                </div>
                <h4 className="text-lg font-serif font-medium text-gray-900 mb-2">
                  Virtual Saree Try-On
                </h4>
                <p className="text-[14px] text-gray-600 mb-4">
                  Upload your photo to instantly preview our sarees on yourself.
                  Find your perfect style with our AI Fashion Advisor.
                </p>
                <Link
                  href="/virtual-tryon"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/link"
                >
                  <Camera size={16} />
                  Try AI Experience
                  <ArrowRight
                    size={16}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* 5. Newsletter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-2">
                Stay in the Loop
              </h3>
              <p className="text-[14px] text-gray-600 mb-4">
                Subscribe for exclusive offers, styling tips, and new arrivals.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-[#dfc7a5] rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 9. Bottom Footer Bar */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[13px] text-gray-500 font-medium">
            © {new Date().getFullYear()} SareeBazar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[13px] text-gray-500 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] text-gray-500 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-[13px] text-gray-500 hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Subcomponents for cleaner code
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[14px] text-gray-600 hover:text-primary transition-colors flex items-center group"
      >
        <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300 ease-out"></span>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white border border-[#dfc7a5] flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}
