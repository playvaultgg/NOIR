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
        <section className="relative h-screen w-full bg-[#0A0A0A] overflow-hidden">
            {/* Base Background Layer (The Canvas) */}
            <div className="absolute inset-0 z-0 scale-105 animate-ken-burns">
                <img 
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-60"
                    alt="Maison NOIR Heritage"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/20" />
            </div>

            {/* Inverted Curve Overlays (Hero-12 Style) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 lg:p-12">
                {/* Top-Left Modular Block */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-[600px] bg-[#0A0A0A] rounded-[40px] rounded-tl-[100px] rounded-br-[120px] p-12 lg:p-20 space-y-8 relative overflow-hidden group border border-white/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-noir-gold/5 blur-[60px] rounded-full group-hover:bg-noir-gold/10 transition-colors" />
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                            <Sparkles size={14} className="animate-pulse" />
                            Est. 1995 / Sovereign Archive
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-playfair text-white tracking-tighter leading-none italic">
                            Maison <br /> NOIR
                        </h1>
                    </div>

                    <p className="text-white/40 text-sm md:text-md font-inter max-w-sm leading-relaxed italic">
                        The ultimate synthesis of digital haute couture and artisanal precision. Explore the future of luxury.
                    </p>

                    <div className="pt-8">
                        <Link href="/collections" className="group relative inline-flex items-center gap-6 px-10 py-5 bg-white rounded-full overflow-hidden transition-all hover:pr-14">
                            <span className="absolute inset-0 bg-noir-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 text-noir-black font-black text-[10px] uppercase tracking-[0.3em]">Explore collection</span>
                            <ArrowRight size={14} className="relative z-10 text-noir-black group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* Bottom Action Cluster & Discovery Cards */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
                    {/* Floating Product Teaser Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="bg-black/60 backdrop-blur-2xl p-6 rounded-[40px] border border-white/10 flex items-center gap-6 max-w-sm group hover:border-noir-gold/30 transition-all"
                    >
                        <div className="w-20 h-28 bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                            <img 
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                             <div className="text-noir-gold text-[8px] uppercase tracking-[0.4em] font-black">Featured Drop</div>
                             <h3 className="text-white font-playfair text-xl italic leading-tight">Elite Trench <br /> Silhouette</h3>
                             <p className="text-white/20 text-[9px] uppercase tracking-widest">Limited Acquisition</p>
                        </div>
                    </motion.div>

                    {/* Secondary Navigation (Bento Pill) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
                    >
                        <Link href="/showroom" className="h-20 px-12 bg-[#0A0A0A] rounded-full border border-white/5 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white font-black hover:border-noir-gold transition-all group">
                             <span className="w-1.5 h-1.5 rounded-full bg-noir-gold group-hover:animate-ping" />
                             Enter 3D Showroom
                        </Link>
                        <Link href="/runway" className="h-20 px-12 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/40 font-black hover:text-white hover:border-white/20 transition-all">
                             Runway Experience
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Cinematic Noise Layer */}
            <div className="absolute inset-0 z-20 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* Scroll Indicator Protocol */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-4">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
        </section>
    );
}
