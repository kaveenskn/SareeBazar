"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Define routes where the navbar should NOT be shown
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  
  if (authRoutes.includes(pathname)) {
    return null;
  }
  
  return <Navbar />;
}

