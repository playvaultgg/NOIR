"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-noir-black text-white selection:bg-noir-gold selection:text-noir-black">
            <Navbar />
            
            <section className="relative pt-48 pb-32 px-6 lg:px-24 max-w-7xl mx-auto overflow-hidden">
                {/* Background Text Decor */}
                <div className="absolute top-20 -left-20 text-[20vw] font-playfair font-black text-white/[0.02] pointer-events-none select-none italic">
                    Heritage
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 space-y-16"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                            <span className="w-8 h-px bg-noir-gold" />
                            Our Legacy
                        </div>
                        <h1 className="text-6xl md:text-9xl font-playfair tracking-tighter italic leading-none">
                            Maison <br /> <span className="text-noir-gold">NOIR</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                        <div className="space-y-8">
                            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
                                Born from the shadows of traditional craftsmanship and the brilliance of future tech, Maison NOIR is more than a fashion house—it is a sanctuary for the avant-garde.
                            </p>
                            <p className="text-white/40 leading-relaxed font-inter font-light tracking-wide">
                                Founded in 2124, we recognized that luxury was no longer just about the material, but the experience of the immaterial. We merge biometric tailoring with vanta-black aesthetics to create garments that are not just worn, but lived. Every piece in our curation is a testament to the sovereign individual.
                            </p>
                        </div>
                        
                        <div className="space-y-12">
                            <div className="border-l border-noir-gold/20 pl-8 space-y-4">
                                <h3 className="text-noir-gold text-[10px] uppercase tracking-widest font-black">Digital Sovereignty</h3>
                                <p className="text-sm text-white/60 font-inter">Every garment is tied to a unique ledger, ensuring lifetime authenticity and heritage tracking across the physical and digital realms.</p>
                            </div>
                            <div className="border-l border-white/10 pl-8 space-y-4">
                                <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-black">Sustainability by Design</h3>
                                <p className="text-sm text-white/60 font-inter">We utilize zero-waste molecular assembly for all couture pieces, reclaiming 99% of materials used in the creation process.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="py-32 bg-white/5 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { label: "Founded", value: "2124" },
                            { label: "Ateliers", value: "07" },
                            { label: "Patrons", value: "12K+" },
                            { label: "Archive Pieces", value: "850+" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <p className="text-noir-gold text-[9px] uppercase tracking-[0.3em] font-black">{stat.label}</p>
                                <p className="text-4xl font-playfair italic">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
