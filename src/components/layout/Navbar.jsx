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
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 hidden lg:block ${isScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "bg-black/40 backdrop-blur-md"
                    }`}
            >
                <div className="max-w-[1600px] mx-auto px-12 h-20 flex items-center justify-between">
                    {/* Navigation Links (Left) */}
                    <nav className="flex items-center gap-10 w-1/3">
                        {[
                            { name: "Archive", href: "/collections" },
                            { name: "Showroom", href: "/showroom" },
                            { name: "Runway", href: "/runway" },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[10px] uppercase tracking-[0.4em] text-white/50 hover:text-[#C6A972] transition-colors duration-500 relative group font-black italic"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A972] transition-all duration-500 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Noir Logo (Center) */}
                    <div className="flex justify-center w-1/3">
                        <Link href="/" className="font-playfair text-4xl tracking-[0.2em] text-white group relative">
                            N O I R
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-px bg-[#C6A972]/50 group-hover:w-12 transition-all duration-700" />
                        </Link>
                    </div>

                    {/* Action Icons (Right) */}
                    <div className="flex items-center justify-end gap-8 w-1/3 text-white/40">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hover:text-[#C6A972] transition-colors duration-500"
                        >
                            <Search className="w-4 h-4" strokeWidth={1} />
                        </button>
                        <Link href={session ? "/account" : "/login"} className="hover:text-[#C6A972] transition-colors duration-500">
                            <User className={`w-4 h-4 ${session ? "text-[#C6A972]" : ""}`} strokeWidth={1} />
                        </Link>
                        <button
                            onClick={toggleCart}
                            className="hover:text-[#C6A972] transition-colors duration-500 relative"
                        >
                            <ShoppingBag className="w-4 h-4" strokeWidth={1} />
                            {totalItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-[#C6A972] rounded-full text-[#0A0A0A] text-[8px] flex items-center justify-center font-black shadow-lg shadow-[#C6A972]/30">
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
