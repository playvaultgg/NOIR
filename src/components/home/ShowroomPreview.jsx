"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";

/**
 * Maison Showroom Preview
 * Static entry point for the 3D immersive world.
 * Features:
 * - 3D Visual Cues
 * - Cinematic Motion Background
 * - High-Fidelity Call to Action
 */
export default function ShowroomPreview() {
    return (
        <section className="py-24 lg:py-40 px-6 lg:px-24 bg-black relative overflow-hidden group">
            {/* Immersive Depth Layers */}
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale blur-2xl animate-spin-slow opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                {/* Information Logic */}
                <div className="space-y-12">
                     <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            <Box size={16} />
                            Spatial Commerce Engine
                        </motion.div>
                        <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                            The Virtual <br /> Showroom
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            Step into the digital void. Inspect every stitch, manipulate the light, and experience the silhouette in full 3D fidelity before acquisition.
                        </p>
                     </header>

                     <div className="flex flex-col md:flex-row gap-8">
                        <Link href="/showroom" className="group/btn relative px-12 py-5 bg-noir-gold overflow-hidden rounded-full transition-shadow hover:shadow-[0_0_50px_rgba(197,160,89,0.3)]">
                            <span className="relative z-10 text-noir-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                                Enter Showroom
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                     </div>
                </div>

                {/* 3D Visual Representation (Abstract) */}
                <div className="relative h-[500px] flex items-center justify-center">
                    <motion.div 
                        animate={{ 
                            rotateY: [0, 360],
                            y: [0, -20, 0]
                        }}
                        transition={{ 
                            rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-72 h-96 relative"
                    >
                         {/* Abstract Garment Silhouette Proxy */}
                         <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-noir-gold/20 via-transparent to-white/10" />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                         </div>
                         
                         {/* Visual UI Markers */}
                         <div className="absolute -top-4 -right-4 w-24 h-24 border border-noir-gold/40 rounded-full animate-ping opacity-20" />
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-noir-gold opacity-10">
                            <Box size={120} strokeWidth={0.5} />
                         </div>
                    </motion.div>

                    {/* Metadata Overlays */}
                    <div className="absolute top-10 right-0 glass-effect bg-black/40 p-4 border border-white/5 rounded-xl space-y-2">
                        <div className="flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[8px] uppercase tracking-[0.2em] text-white/60">Render Status: Active</span>
                        </div>
                        <p className="text-white font-playfair italic text-xs">Onyx Silk Mesh</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
