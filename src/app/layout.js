import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Footer from "@/components/layout/Footer";
import PageWrapper from "@/components/layout/PageWrapper";
import CartDrawer from "@/components/cart/CartDrawer";
import CartReminderPopup from "@/components/cro/CartReminderPopup";
import OutfitBuilder from "@/components/products/OutfitBuilder";
import AIStylist from "@/components/ai/AIStylist";
import DiscoveryObserver from "@/components/ai/DiscoveryObserver";
import WishlistSynchronizer from "@/components/wishlist/WishlistSynchronizer";
import Script from "next/script";

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
        url: "/og-image.jpg",
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
};

export const viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
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
      <body className="bg-noir-black text-white">
        <AuthProvider>
          <CurrencyProvider>
            <SmoothScrollProvider>
              <Navbar />
              <PageWrapper>
                {children}
              </PageWrapper>
              <MobileNavbar />
              <Footer />
              <CartDrawer />
              <OutfitBuilder />
              <CartReminderPopup />
              <AIStylist />
              <DiscoveryObserver />
              <WishlistSynchronizer />
            </SmoothScrollProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
