"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, Moon, ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#offers", label: "TODAY'S OFFER" },
    { href: "#collections", label: "COLLECTIONS" },
    { href: "#shop", label: "SHOP" },
    { href: "#virtual-tryon", label: "VIRTUAL TRY-ON" },
    { href: "#about", label: "ABOUT US" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#FAF8F5]/70 border-b border-black/5 ${
          scrolled ? "py-3 shadow-sm" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-3xl font-serif tracking-wide flex items-center">
            <span style={{ color: "#B88E52" }}>Saree</span>
            <span style={{ color: "#1A1A1A" }}>Bazar</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold tracking-[0.15em] transition-colors hover:text-[#B88E52]"
                style={{ color: "#5A5A5A" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-[#5A5A5A] hover:text-[#B88E52] transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className="text-[#5A5A5A] hover:text-[#B88E52] transition-colors hidden sm:block">
              <Heart size={18} strokeWidth={1.5} />
            </button>
            <button className="text-[#5A5A5A] hover:text-[#B88E52] transition-colors rounded-full border border-[#E5E0D8] p-1.5 hidden sm:block">
              <Moon size={16} strokeWidth={1.5} />
            </button>
            <button
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-white text-[13px] font-medium transition-transform hover:scale-105"
              style={{ backgroundColor: "#B88E52" }}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Cart</span>
            </button>
            <button
              className="lg:hidden text-[#5A5A5A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF8F5] border-t border-[#E5E0D8] py-4 px-6 shadow-lg flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold tracking-[0.15em]"
                style={{ color: "#5A5A5A" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
