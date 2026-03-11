"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    User,
    ShoppingBag,
    Heart
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import AuthModal from "@/components/auth/AuthModal";
import CartDrawer from "@/components/shop/CartDrawer";
import { useCart } from "@/store/useCart";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // Zustand Store Integration
    const { getItemCount, openCart } = useCart();
    const cartCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <CartDrawer />

            {/* DESKTOP NAVBAR */}
            <nav
                className={cn(
                    "fixed top-0 left-0 w-full z-150 transition-all duration-500 ease-in-out px-6 lg:px-12 py-3 lg:block hidden",
                    isScrolled
                        ? "bg-charcoal/80 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl"
                        : "bg-transparent py-5"
                )}
            >
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-off-white/80">
                        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
                        <Link href="/mens" className="hover:text-gold transition-colors">Mens</Link>
                        <Link href="/womens" className="hover:text-gold transition-colors">Womens</Link>
                    </div>

                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-3xl lg:text-4xl font-playfair tracking-[0.1em] text-white">
                            NOIR
                        </h1>
                    </Link>

                    <div className="flex items-center gap-6 text-off-white/90">
                        <button className="hover:text-gold transition-colors" aria-label="Search">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <button className="hover:text-gold transition-colors lg:block hidden" aria-label="Wishlist">
                            <Heart size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => setIsAuthOpen(true)}
                            className="hover:text-gold transition-colors group relative"
                            aria-label="Account"
                        >
                            <User size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={openCart}
                            className="relative hover:text-gold transition-colors group"
                            aria-label="Cart"
                        >
                            <ShoppingBag size={21} strokeWidth={1.5} />
                            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE BOTTOM GLASS BAR */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full z-[100] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
                <div className="max-w-md mx-auto h-[72px] glass-effect rounded-[32px] flex items-center justify-around px-8 pointer-events-auto shadow-2xl overflow-hidden relative group">

                    <Link href="/" className="flex flex-col items-center gap-1 group/item">
                        <div className="text-off-white group-hover/item:text-gold transition-all">
                            <span className="font-playfair text-lg leading-none">N</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-off-white/60 group-hover/item:text-gold opacity-0 group-hover/item:opacity-100 transition-all absolute -bottom-4">Home</span>
                    </Link>

                    <Link href="/shop" className="flex flex-col items-center gap-1 group/item">
                        <Search size={20} strokeWidth={1.5} className="text-off-white group-hover/item:text-gold transition-all" />
                        <span className="text-[9px] uppercase tracking-widest text-off-white/60">Search</span>
                    </Link>

                    <button
                        onClick={openCart}
                        className="flex flex-col items-center gap-1 group/item relative"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} strokeWidth={1.5} className="text-off-white group-hover/item:text-gold transition-all" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold text-black text-[8px] font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-off-white/60">Bag</span>
                    </button>

                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="flex flex-col items-center gap-1 group/item"
                    >
                        <User size={20} strokeWidth={1.5} className="text-off-white group-hover/item:text-gold transition-all" />
                        <span className="text-[9px] uppercase tracking-widest text-off-white/60">Profile</span>
                    </button>
                </div>
            </div>
        </>
    );
}
