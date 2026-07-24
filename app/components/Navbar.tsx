"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingBag, Menu, X, Settings, LogOut, Package, User, BarChart3 } from "lucide-react";
import { getCartCount } from "@/lib/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [shopInfo, setShopInfo] = useState<{storeName: string} | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then(res => res.json())
      .then(data => setShopInfo(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    import("@/lib/productApi").then(module => {
      module.fetchAllProducts().then(setProducts);
    });
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const storeName = shopInfo?.storeName || "SareeBazar";

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
    { href: "/collections", label: "COLLECTIONS" },
    { href: "/#offers", label: "TODAY'S OFFERS" },
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
              <span className="text-primary">{storeName.includes(" ") ? storeName.split(" ")[0] : "Saree"}</span>
              <span className="text-gray-900">{storeName.includes(" ") ? storeName.split(" ").slice(1).join(" ") : "Bazar"}</span>
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
              <button 
                className={`text-gray-700 hover:text-primary transition-colors ${searchOpen ? 'text-primary' : ''}`}
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) setSearchQuery("");
                }}
              >
                {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
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
                            Login / Sign Up
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

          {/* Expanded Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-5 pb-4 pt-1">
              <div className="relative">
                 <input 
                   ref={searchInputRef}
                   type="text" 
                   placeholder="Search for sarees, lehengas, etc..." 
                   className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                 
                 {searchQuery && (
                   <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600">
                     <X size={16} />
                   </button>
                 )}
              </div>
              
              {/* Search Results */}
              {searchQuery && (
                 <div className="mt-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                   <div className="max-h-[50vh] overflow-y-auto py-2">
                     {filteredProducts.length > 0 ? (
                       filteredProducts.map(product => (
                         <Link 
                           key={product.id} 
                           href={`/products/${product.slug}`}
                           className="flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0"
                           onClick={() => {
                             setSearchOpen(false);
                             setSearchQuery("");
                           }}
                         >
                           <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                           <div className="flex-col flex flex-1">
                             <span className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</span>
                             <span className="text-xs text-gray-500 capitalize">{product.category}</span>
                           </div>
                           <div className="text-sm font-bold text-gray-900">
                             ₹{product.price}
                           </div>
                         </Link>
                       ))
                     ) : (
                       <div className="px-4 py-8 text-sm text-gray-500 text-center flex flex-col items-center justify-center">
                         <Search size={24} className="text-gray-300 mb-2" />
                         No match found for "{searchQuery}"
                       </div>
                     )}
                   </div>
                 </div>
              )}
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
