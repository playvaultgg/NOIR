"use client";

import { motion } from "framer-motion";

export default function ScarcityBadge({ stock, isLimitedDrop }) {
    if (!isLimitedDrop && (stock === undefined || stock > 10)) return null;

    return (
        <div className="flex flex-col gap-2 pointer-events-none">
            {isLimitedDrop && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="backdrop-blur-md bg-black/60 text-white text-[9px] uppercase tracking-widest px-3 py-1 border border-white/10 rounded-xs flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                    Limited Drop
                </motion.div>
            )}

            {stock !== undefined && stock <= 5 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-md bg-noir-gold/80 text-black font-semibold text-[9px] uppercase tracking-widest px-3 py-1 rounded-xs shadow-lg shadow-noir-gold/20"
                >
                    Only {stock} Left — Selling Fast
                </motion.div>
            )}
        </div>
    );
}
