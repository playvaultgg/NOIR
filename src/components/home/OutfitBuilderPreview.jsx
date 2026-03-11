"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Plus, ArrowRight } from "lucide-react";

/**
 * Maison Outfit Builder Preview
 * Interactive teaser for the 3D Styler experience.
 * Features:
 * - Dynamic Composition Grid
 * - AI "Complete the Look" Logic
 * - High-Fidelity Transition Corridors
 */
export default function OutfitBuilderPreview() {
    const outfit = [
        { name: "Midnight Velvet Gown", price: "€4,200", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop" },
        { name: "Onyx Silk Trench", price: "€3,150", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" },
        { name: "Maison Noir Heels", price: "€1,100", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop" }
    ];

    return (
        <section className="py-24 lg:py-40 bg-noir-surface relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Information Cluster */}
                    <div className="space-y-12">
                         <header className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                            >
                                <Sparkles size={16} />
                                Intelligence: Complete the Look
                            </motion.div>
                            <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                                AI Persona <br /> Styling
                            </h3>
                            <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                                Our neural engine crafts bespoke ensembles tailored to your digital silhouette. Compose, layer, and refine your identity in real-time.
                            </p>
                         </header>

                         <Link href="/styler" className="group flex items-center justify-between py-8 border-b border-white/10 hover:border-noir-gold transition-colors duration-500">
                             <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black group-hover:text-white transition-all">Launch 3D Styler Experience</span>
                             <ArrowRight size={16} className="text-white/20 group-hover:text-noir-gold group-hover:translate-x-2 transition-all" />
                         </Link>
                    </div>

                    {/* Interactive Composition Preview */}
                    <div className="relative">
                         <div className="grid grid-cols-2 gap-6">
                             {outfit.map((item, idx) => (
                                 <motion.div 
                                     key={item.name}
                                     initial={{ opacity: 0, y: 30 }}
                                     whileInView={{ opacity: 1, y: 0 }}
                                     transition={{ delay: idx * 0.2 }}
                                     className={`glass-effect rounded-[2rem] p-6 border border-white/5 space-y-4 hover:border-noir-gold/20 transition-all ${idx === 2 ? "col-span-2" : ""}`}
                                 >
                                     <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-noir-black shadow-2xl">
                                         <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                         <div className="absolute bottom-4 left-4 text-[8px] uppercase tracking-[0.3em] font-black bg-noir-gold text-noir-black px-3 py-1.5 rounded-full">
                                             Layer {idx + 1}
                                         </div>
                                     </div>
                                     <div className="flex justify-between items-end">
                                         <div>
                                             <h4 className="text-white font-playfair italic text-lg">{item.name}</h4>
                                             <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">{item.price}</p>
                                         </div>
                                         <div className="p-3 bg-white/5 border border-white/5 rounded-full text-noir-gold">
                                             <Plus size={16} />
                                         </div>
                                     </div>
                                 </motion.div>
                             ))}
                         </div>

                         {/* AI Feedback UI Component */}
                         <div className="absolute -top-12 -right-12 glass-effect bg-noir-black/80 p-8 border border-white/10 rounded-3xl shadow-2xl max-w-[200px] hidden xl:block">
                             <div className="flex gap-4 items-center mb-4">
                                 <div className="w-10 h-10 bg-noir-gold/20 rounded-xl flex items-center justify-center text-noir-gold">
                                    <Sparkles size={18} />
                                 </div>
                                 <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/60">AI Sync</span>
                             </div>
                             <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 leading-relaxed italic">
                                "Composition synergy detected at 98.4%. Suggest adding Onyx Silk Trench for silhouette depth."
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
