"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Maison NOIR Brand Story Section
 * Cinematic narrative layout for high-end brand equity.
 */
export default function BrandStory() {
    return (
        <section className="py-24 lg:py-60 bg-noir-black relative overflow-hidden">
            {/* Visual Background Artifacts */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-noir-gold/5 blur-[150px] opacity-30 rounded-full" />
            
            <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Visual Pillar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl"
                    >
                        <Image 
                            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" 
                            alt="The Craftsmanship" 
                            fill 
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noir-black via-transparent to-transparent" />
                        
                        <div className="absolute bottom-16 left-16 space-y-4">
                            <span className="text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black italic">The Genesis</span>
                            <h4 className="text-3xl font-playfair text-white italic tracking-tight">Handcrafted in Milan.</h4>
                        </div>
                    </motion.div>

                    {/* Narrative Pillar */}
                    <div className="space-y-16">
                        <header className="space-y-6">
                            <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Our Heritage</h4>
                            <h2 className="text-4xl md:text-7xl font-playfair text-white tracking-tighter italic leading-tight">
                                A Legacy of <br /> 
                                <span className="text-gradient-gold">Refined Silence.</span>
                            </h2>
                        </header>

                        <div className="space-y-8 max-w-xl">
                            <p className="text-white/40 text-lg lg:text-xl font-inter italic leading-relaxed">
                                Maison NOIR was founded on the principle that true luxury does not shout. It is felt in the weight of hand-spun silk, the precision of a hidden seam, and the quiet authority of a perfect silhouette.
                            </p>
                            <p className="text-white/40 text-lg lg:text-xl font-inter italic leading-relaxed">
                                Our artisans treat every garment as a sovereign masterpiece, blending centuries-old European craftsmanship with the digital foresight of tomorrow.
                            </p>
                        </div>

                        <div className="pt-8 grid grid-cols-3 gap-12 border-t border-white/5">
                            <div className="space-y-2">
                                <h5 className="text-noir-gold text-2xl font-playfair italic underline-offset-8 underline decoration-white/5">18</h5>
                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Artisanal Hours</p>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-noir-gold text-2xl font-playfair italic underline-offset-8 underline decoration-white/5">100%</h5>
                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Sovereign Silk</p>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-noir-gold text-2xl font-playfair italic underline-offset-8 underline decoration-white/5">Ltd.</h5>
                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Archive Series</p>
                            </div>
                        </div>

                        <motion.button 
                            className="bg-[#C6A972] text-[#0A0A0A] py-5 px-10 rounded-lg text-sm font-inter font-semibold tracking-wide shadow-xl shadow-[#C6A972]/5 transition-all duration-300 hover:bg-white hover:text-[#0A0A0A] hover:scale-105"
                        >
                            Explore the Archive
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
