"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function StickyAddToCart({ product }) {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    // Show only after scrolling past the first 400px (standard on mobile hero images)
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsVisible(latest > 600);
    });

    if (!product) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-24 left-4 right-4 z-40 lg:hidden"
                >
                    <div className="glass-effect rounded-2xl bg-noir-black/90 p-3 flex items-center justify-between shadow-2xl border border-white/10">
                        <div className="flex flex-col pl-2">
                            <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold truncate max-w-[120px]">
                                {product.name}
                            </span>
                            <span className="text-noir-gold text-xs font-bold font-inter tracking-widest mt-0.5">
                                {product.price}
                            </span>
                        </div>

                        <button
                            onClick={() => addItem({ ...product, size: "M" })}
                            className="bg-noir-gold text-noir-black px-6 py-3 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] shadow-lg shadow-noir-gold/20 hover:scale-105 active:scale-95 transition-transform"
                        >
                            Add to Cart
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
