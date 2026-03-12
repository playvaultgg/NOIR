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
  title: {
    default: "NOIR — Luxury Clothing & Accessories",
    template: "%s | Maison NOIR"
  },
  description: "Ultra-premium e-commerce for refined individuals. Experience uncompromising luxury fashion and custom fragrances.",
  openGraph: {
    title: "Maison NOIR — Luxury Architectural Fashion",
    description: "Ultra-premium e-commerce for refined individuals. Experience uncompromising luxury.",
    url: "https://maisonoir.com",
    siteName: "Maison NOIR",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or use a cinematic placeholder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison NOIR — Luxury Fashion",
    description: "Ultra-premium architectural fashion and custom fragrances.",
    images: ["/og-image.jpg"],
  },
  themeColor: "#0A0A0A",
};

import CartDrawer from "@/components/cart/CartDrawer";
import CartReminderPopup from "@/components/cro/CartReminderPopup";
import PageWrapper from "@/components/layout/PageWrapper";
import ConciergeChat from "@/components/concierge/ConciergeChat";

import { CurrencyProvider } from "@/context/CurrencyContext";

import Link from "next/link";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        
        {/* Production Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className="font-inter bg-noir-black text-noir-text selection:bg-noir-gold/30 selection:text-noir-gold">
        <AuthProvider>
          <CurrencyProvider>
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
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
