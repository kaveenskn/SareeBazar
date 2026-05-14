"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer on auth routes and home page (home renders its own footer inside ContentOverlay)
  const hideFooterRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
  
  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }
  
  return <Footer />;
}
