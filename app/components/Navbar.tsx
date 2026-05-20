"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, FileText, Settings } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Toggle this constant to test logged in vs logged out UI
  const isLoggedIn = false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#offers", label: "TODAY'S OFFER" },
    { href: "/collections", label: "COLLECTIONS" },
    { href: "/virtual-tryon", label: "VIRTUAL TRY-ON" },
    { href: "/studio", label: "STUDIO" },
  ];

  return (
    <>
      {/* Floating Pill Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pt-4">
        <nav
          className={`w-full max-w-7xl rounded-2xl backdrop-blur-md border transition-all duration-300 ${
            scrolled
              ? "py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-white/60 bg-white/85"
              : "py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-white/50 bg-white/75"
          }`}
        >
          <div className="px-5 md:px-7 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-3xl font-serif tracking-wide flex items-center">
              <span className="text-primary">Saree</span>
              <span className="text-gray-900">Bazar</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-semibold tracking-[0.15em] transition-colors text-gray-700 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-primary transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button className="text-gray-700 hover:text-primary transition-colors hidden sm:block">
                <Heart size={18} strokeWidth={1.5} />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="text-gray-700 hover:text-primary transition-colors flex items-center"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-[-10px] sm:right-[-80px] mt-4 w-[300px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoggedIn ? (
                      <div className="py-2">
                        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                          <p className="text-sm font-medium text-gray-900">John Doe</p>
                          <p className="text-xs text-gray-500 mt-0.5">john.doe@example.com</p>
                        </div>
                        <div className="px-3 py-2">
                          <Link href="/profile" className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <User size={16} className="mr-3" />My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <ShoppingBag size={16} className="mr-3" />Orders
                          </Link>
                          <Link href="/wishlist" className="flex items-center px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <Heart size={16} className="mr-3" />Wishlist
                          </Link>
                        </div>
                        <div className="border-t border-gray-50 px-3 py-2">
                          <button className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <LogOut size={16} className="mr-3" />Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5">
                        <div className="mb-5">
                          <h3 className="text-xl font-bold text-gray-900 whitespace-nowrap">Welcome to SareeBazar</h3>
                          <p className="text-sm text-gray-500 mt-1">To access account and manage orders</p>
                        </div>
                        <div className="space-y-3">
                          <Link href="/login" onClick={() => setProfileDropdownOpen(false)} className="flex w-full justify-center items-center px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-transform hover:scale-[1.02] bg-primary">
                            Login
                          </Link>
                          <Link href="/register" onClick={() => setProfileDropdownOpen(false)} className="flex w-full justify-center items-center px-4 py-2.5 rounded-lg text-primary border border-primary text-sm font-medium transition-colors hover:bg-primary/5">
                            Signup
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="flex items-center space-x-2 px-5 py-2 rounded-full text-white text-[13px] font-medium transition-transform hover:scale-105 bg-primary"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Cart</span>
              </button>
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu — inside the pill */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 mx-3 mb-1 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 py-4 px-5 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-semibold tracking-[0.15em] text-gray-700 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col space-y-3">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-primary">Login</Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-gray-700">Create Account</Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-gray-700">My Profile</Link>
                    <button className="text-[13px] font-semibold text-red-600 text-left" onClick={() => setMobileMenuOpen(false)}>Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {profileDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
      )}
    </>
  );
}
