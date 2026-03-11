"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/useCart";

export default function StickyCartBar({ product }) {
    const [isVisible, setIsVisible] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            // Show when the main "Add to Cart" button on the PDP is scrolled past
            // In this case, we'll show it after scrolling 600px
            setIsVisible(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="lg:hidden fixed bottom-[90px] left-4 right-4 z-[90] pointer-events-none"
                >
                    <div className="glass-effect rounded-[20px] p-4 flex items-center justify-between pointer-events-auto shadow-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-inter font-medium">Selected Item</span>
                            <p className="text-sm font-playfair font-medium text-white line-clamp-1">{product.name}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-inter text-gold font-bold italic mr-2">
                                ${product.price ? product.price.toLocaleString() : "1,250"}
                            </span>
                            <button
                                onClick={() => addItem(product)}
                                className="h-12 px-6 bg-gold text-black text-[11px] uppercase tracking-[0.2em] font-bold rounded-[12px] flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-transform"
                            >
                                <ShoppingBag size={14} strokeWidth={2.5} />
                                Add
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
