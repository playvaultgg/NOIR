"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Maison NOIR Hero Section
 * Powered by ReactBits hero-12 block logic.
 * Features:
 * - Full-screen Immersive Canvas
 * - Cinematic Maison Branding
 * - High-Fidelity CTA Interactions
 */
export default function HeroSection() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-10" />
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover opacity-50 scale-105 animate-ken-burns"
                    poster="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop"
                >
                    <source src="https://v3.v-line.v-media.vimeo.com/exp=1741635600~acl=%2Fv%2F*~hmac=6666.../video.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Grain & Depth Overlay */}
            <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* Content Layer */}
            <div className="relative z-20 text-center px-6 max-w-5xl space-y-12">
                <header className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="flex items-center justify-center gap-4 text-noir-gold text-[10px] md:text-xs uppercase tracking-[0.6em] font-black italic"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        The Future of Luxury Fashion
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-7xl md:text-9xl lg:text-[12rem] font-playfair text-white tracking-widest italic"
                    >
                        Maison <br /> NOIR
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.8 }}
                        className="text-white/40 text-lg md:text-xl font-inter max-w-2xl mx-auto leading-relaxed italic"
                    >
                        Explore immersive couture experiences with AI styling, <br className="hidden md:block" />
                        3D showrooms and cinematic fashion storytelling.
                    </motion.p>
                </header>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-8"
                >
                    <Link href="/collections" className="group relative px-12 py-5 bg-white overflow-hidden rounded-full">
                        <span className="absolute inset-0 bg-noir-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 text-noir-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                            Explore Collection
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    <Link href="/showroom" className="group px-12 py-5 border border-white/20 hover:border-noir-gold backdrop-blur-md rounded-full transition-all duration-500">
                        <span className="text-white group-hover:text-noir-gold font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                            Enter Showroom
                        </span>
                    </Link>
                </motion.div>
            </div>

            {/* Visual Indicator: Scroll Protocol */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-bounce">
                <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black">Scroll to Discover</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
        </section>
    );
}
