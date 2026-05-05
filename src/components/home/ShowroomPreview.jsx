"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Boxes } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Environment, Float, MeshReflectorMaterial } from "@react-three/drei";

function ShowroomSilhouette() {
    return (
        <div className="relative w-full h-full">
            <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
                alt="Luxury Showroom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        </div>
    );
}

export default function ShowroomPreview() {
    return (
        <section className="py-24 lg:py-40 px-6 lg:px-24 bg-black relative overflow-hidden group">
            {/* Visual Ambiance */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                     <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            <Boxes size={16} />
                            Spatial Commerce Engine
                        </motion.div>
                        <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                            The Virtual <br /> Showroom
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            Step into the digital void. Inspect every stitch, manipulate the light, and experience the silhouette in full 3D fidelity before acquisition.
                        </p>
                     </header>

                     <Link href="/showroom" className="group flex items-center justify-center gap-3 w-fit px-12 py-6 bg-white text-black rounded-2xl transition-all duration-500 hover:bg-noir-gold hover:scale-105 font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl">
                        Enter Experience
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                </div>

                {/* Static Preview */}
                <div className="relative h-[600px] bg-[#050505] rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <ShowroomSilhouette />

                    {/* Metadata Overlays */}
                    <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-2xl p-6 border border-white/5 rounded-2xl space-y-4">
                        <div className="flex gap-2 items-center">
                            <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/60">Node: Boutique-04 / Active</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white font-playfair italic text-lg leading-none">Spatial Shell</p>
                            <p className="text-noir-gold text-[8px] uppercase tracking-[0.4em] font-black italic">60 FPS / ULTRA</p>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-10 text-[8px] uppercase tracking-[0.4em] text-white/10 font-black">
                        Maison NOIR Environmental Simulation
                    </div>
                </div>
            </div>
        </section>
    );
}

