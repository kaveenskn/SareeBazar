"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, Settings, LogOut, Package, User, BarChart3 } from "lucide-react";
import { getCartCount } from "@/lib/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      import('@/lib/authStore').then((module) => {
        setIsLoggedIn(module.isLoggedIn());
        setUser(module.getUser());
      });
    };
    checkAuth();
    window.addEventListener("auth-updated", checkAuth);
    return () => window.removeEventListener("auth-updated", checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
    const sync = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const navLinks = [
    { href: "/#offers", label: "TODAY'S OFFER" },
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
                  className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20 hover:bg-primary hover:text-white transition-colors">
                    {isLoggedIn && user ? user.name.substring(0, 2).toUpperCase() : "JD"}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-[-10px] sm:right-0 mt-4 w-[200px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 flex flex-col space-y-1">
                      {isLoggedIn ? (
                        <>
                          <Link href="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                            <BarChart3 size={16} className="mr-3 text-gray-400" /> Dashboard
                          </Link>
                          <Link href="/orders" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                            <Package size={16} className="mr-3 text-gray-400" /> My Orders
                          </Link>
                          <Link href="/settings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                            <Settings size={16} className="mr-3 text-gray-400" /> Settings
                          </Link>
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => {
                            setProfileDropdownOpen(false);
                            import('@/lib/authStore').then((module) => module.logoutUser());
                          }} className="flex items-center w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <LogOut size={16} className="mr-3" /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                            Login
                          </Link>
                          <Link href="/register" onClick={() => setProfileDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors">
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/cart"
                className="relative flex items-center space-x-2 px-5 py-2 rounded-full text-white text-[13px] font-medium transition-transform hover:scale-105 bg-primary"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#ff3f6c] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
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
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-primary">Dashboard</Link>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-gray-700">My Orders</Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[13px] font-semibold text-gray-700">My Profile</Link>
                    <button className="text-[13px] font-semibold text-red-600 text-left" onClick={() => {
                      setMobileMenuOpen(false);
                      import('@/lib/authStore').then((module) => module.logoutUser());
                    }}>Logout</button>
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
