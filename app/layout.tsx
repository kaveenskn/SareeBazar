import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import FooterWrapper from "./components/FooterWrapper";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saree Bazar",
  description: "Community Ecommerce Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${playfair.variable} h-full antialiased light`}
    >

      <body className="min-h-full flex flex-col bg-white text-black">
        <Providers>
          <NavbarWrapper />
          <div className="flex-1">
            {children}
          </div>
          <FooterWrapper />
        </Providers>

      </body>
    </html>
  );
}
