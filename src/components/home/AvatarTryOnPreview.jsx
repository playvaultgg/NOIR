"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, User, Zap, ChevronRight } from "lucide-react";

/**
 * Maison NOIR Avatar Try-On Preview
 * High-fidelity teaser for the Phase 8.6 Identity Synthesis engine.
 */
export default function AvatarTryOnPreview() {
    return (
        <section className="py-24 lg:py-48 bg-noir-black relative px-6 lg:px-24 overflow-hidden">
            {/* Visual Ambiance Layer */}
            <div className="absolute top-1/2 left-0 w-[40vw] h-[40vh] bg-noir-gold/5 blur-[120px] -translate-y-1/2 rounded-full pointer-events-none" />
            
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                     <header className="space-y-6">
                        <div className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                            <Zap size={14} className="animate-pulse" />
                            Phase 8.6 / Synthesis Engine
                        </div>
                        <h2 className="text-4xl md:text-7xl font-playfair text-white tracking-tighter italic leading-tight">
                            Your Digital <br />
                            <span className="text-gradient-gold">Alter Ego.</span>
                        </h2>
                     </header>

                     <p className="text-white/40 text-lg lg:text-xl font-inter italic leading-relaxed max-w-lg">
                        Bridge the threshold between physical and digital. Synthesize a 1:1 digital persona with Maison NOIR's neural silhouette engine and experience the archival collection in high-fidelity 3D.
                     </p>

                     <div className="space-y-6">
                        {[
                            { icon: User, text: "Precision Silhouette Mapping" },
                            { icon: Sparkles, text: "High-Fidelity Garment Synthesis" },
                            { icon: Zap, text: "Real-time Texture Collision" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex items-center gap-4 text-white/60"
                            >
                                <div className="p-2 bg-white/5 border border-white/5 rounded-full">
                                    <item.icon size={12} className="text-noir-gold" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-black">{item.text}</span>
                            </motion.div>
                        ))}
                     </div>

                     <Link href="/avatar" className="inline-flex items-center gap-6 group">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-noir-black py-6 px-16 rounded-2xl text-[10px] uppercase tracking-[0.5em] font-black shadow-xl shadow-white/5 transition-all group-hover:bg-noir-gold"
                        >
                            Construct Persona
                        </motion.button>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-noir-gold group-hover:border-noir-gold/50 transition-all">
                            <ChevronRight size={20} />
                        </div>
                     </Link>
                </div>

                {/* Visual Teaser Pillar */}
                <div className="relative group perspective-1000">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-[3/4] bg-noir-surface/40 rounded-[4rem] border border-white/5 overflow-hidden backdrop-blur-3xl p-12 flex flex-col items-center justify-center space-y-12"
                    >
                        {/* Recursive 3D Preview (Abstract Layer) */}
                        <div className="relative w-full h-[70%] flex items-center justify-center">
                            <div className="absolute w-48 h-48 bg-noir-gold/20 blur-[60px] rounded-full animate-pulse" />
                            <div className="relative w-32 h-64 border-[3px] border-noir-gold/20 rounded-full flex flex-col items-center justify-center p-4">
                                <div className="w-12 h-12 rounded-full border-2 border-noir-gold/20 mb-4" />
                                <div className="w-20 h-32 border-2 border-noir-gold/20 rounded-full" />
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="flex justify-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-noir-gold animate-bounce" />
                                <div className="w-1 h-1 rounded-full bg-noir-gold animate-bounce delay-100" />
                                <div className="w-1 h-1 rounded-full bg-noir-gold animate-bounce delay-200" />
                            </div>
                            <p className="text-white/20 text-[8px] uppercase tracking-[0.5em] font-black italic">Neural Silhouette Active</p>
                        </div>

                        {/* Scanlines UI Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
