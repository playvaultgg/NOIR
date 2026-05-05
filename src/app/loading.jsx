"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-noir-black flex flex-col items-center justify-center">
            {/* Elegant Logo Animation */}
            <div className="relative mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-white text-5xl md:text-7xl font-playfair italic tracking-tighter"
                >
                    Maison NOIR
                </motion.div>
                
                {/* Underline Progress Bar */}
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                    className="absolute -bottom-4 left-0 right-0 h-[1px] bg-noir-gold origin-left"
                />
            </div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black"
            >
                Archival Protocol Initiated
            </motion.p>

            {/* Aesthetic Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
    );
}
