"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import SmartSearch from "../ai/SmartSearch";

export default function Navbar() {
    const { scrollY } = useScroll();
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { toggleCart, getTotalItems } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItemsCount = mounted ? getTotalItems() : 0;

    // Transition from transparent to solid Pitch Black
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 hidden lg:block ${isScrolled ? "bg-noir-black/95 backdrop-blur-xl border-b border-white/5" : "bg-black/40 backdrop-blur-md"
                    }`}
            >
                <div className="max-w-[1600px] mx-auto px-12 h-20 flex items-center justify-between">
                    {/* Navigation Links (Left) */}
                    <nav className="flex items-center gap-8 w-1/3">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Collections", href: "/collections" },
                            { name: "Showroom", href: "/showroom" },
                            { name: "Runway", href: "/runway" },
                            { name: "Contact", href: "/contact" },
                            { name: "Account", href: "/account" }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-noir-gold transition-colors duration-300 relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-noir-gold transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Noir Logo (Center) */}
                    <div className="flex justify-center w-1/3">
                        <Link href="/" className="font-playfair text-3xl tracking-[0.15em] text-white">
                            NOIR
                        </Link>
                    </div>

                    {/* Action Icons (Right) */}
                    <div className="flex items-center justify-end gap-6 w-1/3 text-white/80">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hover:text-noir-gold transition-colors"
                        >
                            <Search className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <Link href={session ? "/account" : "/login"} className="hover:text-noir-gold transition-colors">
                            <User className={`w-4 h-4 ${session ? "text-noir-gold" : ""}`} strokeWidth={1.5} />
                        </Link>
                        <button
                            onClick={toggleCart}
                            className="hover:text-noir-gold transition-colors relative"
                        >
                            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                            {totalItemsCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-noir-gold rounded-full text-noir-black text-[9px] flex items-center justify-center font-bold shadow-lg shadow-noir-gold/20">
                                    {totalItemsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isSearchOpen && (
                    <SmartSearch
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
