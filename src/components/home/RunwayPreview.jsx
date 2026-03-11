"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

/**
 * Maison Runway Preview
 * Cinematic entry point for the virtual runway experience.
 * Features:
 * - Wide Cinematic Canvas
 * - Dramatic Lighting Overlay
 * - Pulse Interactions
 */
export default function RunwayPreview() {
    return (
        <section className="py-24 lg:py-40 bg-noir-black relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
                <header className="mb-20 text-center space-y-4">
                    <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Maison Events</h4>
                    <h3 className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic">The Virtual Runway</h3>
                </header>

                <div className="relative aspect-[21/9] w-full bg-noir-surface rounded-[2rem] overflow-hidden group">
                     {/* Cinematic Background */}
                     <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop" 
                            alt="Maison Runway" 
                            className="w-full h-full object-cover grayscale opacity-40 transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-noir-gold/5 mix-blend-overlay z-15" />
                     </div>

                     {/* Content Overlay */}
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Link href="/runway" className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-noir-gold hover:text-noir-black transition-all duration-500 group/btn shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                                <Play size={32} fill="currentColor" className="ml-2" />
                                <div className="absolute inset-0 rounded-full border border-noir-gold/50 animate-ping opacity-0 group-hover/btn:opacity-100" />
                            </Link>
                        </motion.div>
                        
                        <div className="text-center space-y-3">
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black">Archive Invitation</p>
                            <h4 className="text-2xl md:text-3xl font-playfair text-white italic tracking-widest">Midnight Symphony AW26</h4>
                        </div>
                     </div>

                     {/* Visual Indicators: Viewport Markers */}
                     <div className="absolute top-8 left-8 flex gap-4 opacity-20 z-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white">Live Projection Protocol</span>
                     </div>
                </div>

                {/* Animated Silhouette Marquee */}
                <div className="relative mt-24 mb-12 flex overflow-hidden border-y border-white/5 bg-[#0A0A0A] py-12">
                    <motion.div
                        className="flex whitespace-nowrap gap-16 lg:gap-32 items-center"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    >
                        {/* 10 Silhouettes replicated to form loop */}
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 shrink-0 px-8 group">
                                <img
                                    src={`https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=200&h=400&fit=crop`}
                                    alt="Model Silhouette"
                                    className="w-24 h-48 lg:w-32 lg:h-64 object-cover object-top grayscale opacity-30 contrast-[200%] brightness-0 filter group-hover:opacity-100 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700 pointer-events-none drop-shadow-2xl"
                                />
                                <span className="text-[8px] uppercase tracking-[0.4em] text-[#C6A972]/40 font-black italic">Look 0{i + 1}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/runway" className="text-[10px] uppercase tracking-[0.4em] text-noir-gold hover:text-white transition-all underline underline-offset-8 decoration-noir-gold/30">
                        Watch the Full Experience
                    </Link>
                </div>
            </div>
        </section>
    );
}
