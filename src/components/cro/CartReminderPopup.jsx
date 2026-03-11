"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag } from "lucide-react";

export default function CartReminderPopup() {
    const [mounted, setMounted] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { items, openCart } = useCartStore();
    const [hasDismissed, setHasDismissed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || items.length === 0 || hasDismissed) return;

        const handleMouseLeave = (e) => {
            // Exit intent detected (mouse moved to the top bar)
            if (e.clientY <= 0) {
                setShowPopup(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [items.length, hasDismissed]);

    const handleDismiss = () => {
        setShowPopup(false);
        setHasDismissed(true);
    };

    const handleCompleteOrder = () => {
        setShowPopup(false);
        openCart();
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-noir-black/90 backdrop-blur-md z-[200]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-[201] p-8 glass-effect bg-noir-surface rounded-2xl border border-white/10 shadow-2xl text-center flex flex-col items-center"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-noir-gold/10 rounded-full flex items-center justify-center text-noir-gold mb-6 border border-noir-gold/20 shadow-lg shadow-noir-gold/10">
                            <ShoppingBag size={28} strokeWidth={1} />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-playfair tracking-tight text-white mb-3">
                            Your Items Are Selling Out
                        </h3>

                        <p className="text-sm font-inter text-white/50 mb-8 max-w-sm">
                            We've reserved the <span className="text-noir-gold font-semibold">{items.length} pieces</span> in your bag. They are almost gone—secure yours before another collector takes them.
                        </p>

                        <button
                            onClick={handleCompleteOrder}
                            className="w-full bg-noir-gold text-noir-black py-4 font-bold text-xs uppercase tracking-[0.25em] relative group overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                            <span className="relative z-10">Complete Your Order</span>
                        </button>

                        <button
                            onClick={handleDismiss}
                            className="mt-6 text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white/10 pb-1"
                        >
                            Continue Exploring
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
