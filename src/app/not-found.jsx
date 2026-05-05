"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-noir-black flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-12 max-w-2xl">
                <header className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-noir-gold text-9xl font-playfair italic leading-none"
                    >
                        404
                    </motion.div>
                    <h1 className="text-white text-3xl md:text-5xl font-playfair italic">Lost in the Archives.</h1>
                    <p className="text-white/40 text-sm md:text-base font-inter uppercase tracking-[0.3em] max-w-md mx-auto">
                        The piece you are looking for has been moved to the private vault or no longer exists.
                    </p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-full hover:bg-noir-gold transition-all group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Showroom
                    </Link>
                </motion.div>
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>
    );
}
