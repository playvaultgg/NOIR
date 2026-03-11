"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export default function StickyPurchaseBar({ product, onAdd }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past 600px
            setIsVisible(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden"
                >
                    <div className="glass-effect bg-noir-black/80 border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center gap-4 pl-2">
                            <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-white/5">
                                <img src={product.images?.[0] || product.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest text-white font-bold truncate max-w-[120px]">{product.name}</h4>
                                <p className="text-[10px] text-noir-gold font-bold mt-0.5">{product.price}</p>
                            </div>
                        </div>

                        <button
                            onClick={onAdd}
                            className="bg-white text-noir-black px-8 h-12 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-2 hover:bg-noir-gold transition-colors"
                        >
                            <ShoppingBag size={14} />
                            Acquire
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
