"use client";

import { motion } from "framer-motion";
import OutfitStyler3D from "@/components/3d/OutfitStyler3D";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

/**
 * Maison Noir Outfit Styler Page
 * The high-fidelity 3D integration for personalized fashion (Phase 8.7).
 * Features:
 * - Direct Mannequin Interaction
 * - Curated Outfit Combinations
 * - Interactive AI Metadata Feedback
 * - Virtual Silhouette Synthesis
 */
export default function StylerPage() {
    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black">
            <section className="relative pt-32 pb-40 px-6 md:px-12 lg:px-24">
                {/* Visual Grain and Depth Layout */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />

                {/* Header Grid Section */}
                <header className="max-w-4xl mb-20 flex flex-col items-start gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                    >
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Intelligence: Phase 8.7 / OUTFIT STYLER
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-[10rem] font-playfair text-white tracking-widest italic"
                    >
                        Curate <br /> Silhouette
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.8 }}
                        className="text-white/40 text-lg md:text-xl font-inter max-w-2xl leading-relaxed italic"
                    >
                        Master the midnight palette. Combine textures, manipulate the aesthetic, and craft your curated identity with high-fidelity 3D feedback.
                    </motion.p>
                </header>

                {/* Core Styler Viewport Grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <OutfitStyler3D />
                </motion.div>

                {/* Styler Information Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mt-32">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-white font-playfair text-4xl italic">Texture Collision</h3>
                            <p className="text-white/30 text-base font-light italic leading-loose">
                                Our engine calculates the visual tension between silk, metallic mesh, and matte onyx. Each combination is evaluated by the Maison Noir intelligence layer to ensure aesthetic dominance.
                            </p>
                        </div>
                        
                        <div className="flex gap-12">
                            <div className="space-y-2">
                                <span className="text-noir-gold text-[9px] uppercase tracking-[0.4em] font-black">Composition Accuracy</span>
                                <h4 className="text-white text-3xl font-playfair">98.4%</h4>
                            </div>
                            <div className="space-y-2">
                                <span className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-black italic">Reflections</span>
                                <h4 className="text-white/40 text-3xl font-playfair italic">Active</h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-3xl p-12 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-noir-gold/10 rounded-full flex items-center justify-center text-noir-gold border border-noir-gold/20 shadow-lg shadow-noir-gold/10">
                                <UserCheck size={20} />
                            </div>
                            <h4 className="text-white font-playfair text-2xl italic tracking-tight">Identity Synchronization</h4>
                            <p className="text-white/20 text-sm font-light leading-relaxed">
                                Save your composition to your Profile. Our AI will prioritize these silhouettes in your personalized boutique feed.
                            </p>
                        </div>
                        
                        <Link href="/account" className="group mt-12 flex items-center justify-between py-6 border-b border-white/10 hover:border-noir-gold transition-colors duration-500">
                             <span className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black group-hover:text-white group-hover:translate-x-4 transition-all duration-700">Explore Curation Profile</span>
                             <ArrowRight className="text-white/10 group-hover:text-noir-gold group-hover:-translate-x-2 transition-all" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
