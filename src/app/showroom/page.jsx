"use client";

import { motion } from "framer-motion";
import GarmentViewer from "@/components/3d/GarmentViewer";
import { Compass, Sparkles, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

/**
 * Maison Noir Virtual Showroom
 * The High-Fidelity 3D Shopping Core (Phase 8).
 * Features:
 * - Immersive 3D Product Projection
 * - Artificial Intelligence Merchandising Integration
 * - Cinematic Silhouette Manipulation (Three.js)
 * - Exclusive AW26 Collection Pre-orders
 */
export default function ShowroomPage() {
    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black">
            
            <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24">
                {/* Background Maison Grain */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Header Section */}
                <header className="max-w-4xl mb-16 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black"
                    >
                        <Compass className="w-4 h-4" />
                        Digital Reality: Phase 8 / SHOWROOM
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-[10rem] font-playfair text-white leading-tight tracking-tighter italic"
                    >
                        Virtual <br /> Silhouette
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.8 }}
                        className="text-white/40 text-lg md:text-xl font-inter max-w-2xl leading-relaxed italic"
                    >
                        Experience the collection in a new dimension. Manipulate the light, witness the grain, and curate your curation with cinematic 3D fidelity.
                    </motion.p>
                </header>

                {/* 3D Core Viewport */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <GarmentViewer modelUrl="/models/silk-tux.glb" />
                </motion.div>

                {/* Showroom Interaction Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-24">
                    <div className="space-y-6 lg:border-l lg:border-white/5 lg:pl-8">
                        <div className="flex items-center gap-3 text-noir-gold text-[9px] uppercase tracking-[0.4em] font-black">
                            <Sparkles className="w-3 h-3" />
                            Neural Interaction
                        </div>
                        <h3 className="text-white font-playfair text-3xl italic">Silk Sateen Inspection</h3>
                        <p className="text-white/30 text-sm font-inter leading-loose">
                            Witness the 24% metallic silk blend react in real-time to your custom lighting setup. Every fold contains a story of precision.
                        </p>
                    </div>

                    <div className="space-y-6 lg:border-l lg:border-white/5 lg:pl-8">
                         <div className="flex items-center gap-3 text-white/40 text-[9px] uppercase tracking-[0.4em] font-black">
                            <Play className="w-3 h-3" />
                            Cinematic Mode
                        </div>
                        <h3 className="text-white font-playfair text-3xl italic">Virtual Fabric Flow</h3>
                        <p className="text-white/30 text-sm font-inter leading-loose italic">
                            Phase 8 introduces realistic fabric physics. The garment reacts to virtual wind, simulating the movement of a midnight runway.
                        </p>
                    </div>

                    <div className="flex flex-col justify-end">
                        <Link href="/products" className="group flex items-center justify-between py-8 border-b border-white/10 hover:border-noir-gold transition-colors duration-500">
                           <span className="text-white font-playfair text-2xl italic group-hover:text-noir-gold transition-colors duration-500">Curate the Collection</span>
                           <ChevronRight className="text-white/30 group-hover:text-noir-gold group-hover:translate-x-2 transition-all" />
                        </Link>
                    </div>
                </div>
            </section>
            
        </main>
    );
}
