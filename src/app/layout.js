import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import AuthProvider from "@/providers/AuthProvider";

// High-end Typography initialization
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata = {
  title: "NOIR — Luxury Clothing & Accessories",
  description: "Ultra-premium e-commerce for refined individuals.",
};

import CartDrawer from "@/components/cart/CartDrawer";
import CartReminderPopup from "@/components/cro/CartReminderPopup";
import PageWrapper from "@/components/layout/PageWrapper";
import ConciergeChat from "@/components/concierge/ConciergeChat";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
      </head>
      <body className="font-inter bg-noir-black text-noir-text selection:bg-noir-gold/30 selection:text-noir-gold">
        <AuthProvider>
          <SmoothScrollProvider>
            {/* Universal Navbar Persistence */}
            <Navbar />

            {/* Smart Wrapper for edge-to-edge screens like Auth */}
            <PageWrapper>
              {children}
            </PageWrapper>

            <MobileNavbar />
            <Footer />

            {/* Phase 3 & 9: Ultra Conversion & AI Assistant */}
            <CartDrawer />
            <CartReminderPopup />
            <ConciergeChat />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
