"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

/**
 * Maison Customer Reviews
 * Social proof section for elite validation.
 * Features:
 * - Luxury Testimonial Grid
 * - Press Citation Integration
 * - Cinematic Brand Quotes
 */
export default function CustomerReviews() {
    const reviews = [
        {
            quote: "The virtual showroom experience is revolutionary. It's the first time I've felt the true weight and flow of a silk trench in a digital space.",
            author: "Julian V.",
            role: "Private Collector",
            source: "Maison Elite Member"
        },
        {
            quote: "NOIR represents the vanguard of digital couture. Their synthesis of AI and 3D fashion is setting a new global standard for luxury retail.",
            author: "Vogue Innovation",
            role: "Global Press",
            source: "September Issue Preview"
        },
        {
            quote: "An unparalleled commitment to the silhouette. Every acquisition feels like a piece of the future, delivered with absolute precision.",
            author: "Elena R.",
            role: "Fashion Consultant",
            source: "Paris Office"
        }
    ];

    return (
        <section className="py-24 lg:py-40 bg-noir-black relative px-6 lg:px-24 overflow-hidden">
            {/* Visual Depth Decoration */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />
            
            <header className="mb-24 text-center space-y-6">
                <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">The Maison Legacy</h4>
                <h3 className="text-4xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                    Loved by Collectors <br /> Worldwide
                </h3>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {reviews.map((item, idx) => (
                    <motion.div 
                        key={item.author}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="glass-effect bg-noir-surface/20 p-12 rounded-[3rem] border border-white/5 space-y-8 flex flex-col justify-between group hover:border-noir-gold/10 transition-all"
                    >
                         <div className="space-y-8">
                            <div className="text-noir-gold/20 group-hover:text-noir-gold transition-colors duration-700">
                                <Quote size={48} strokeWidth={1} />
                            </div>
                            <p className="text-white font-playfair text-xl md:text-2xl leading-relaxed italic tracking-tight">
                                "{item.quote}"
                            </p>
                         </div>

                         <div className="space-y-4 pt-12 border-t border-white/5">
                            <div className="flex gap-2 text-noir-gold">
                                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                            </div>
                            <div>
                                <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-black">{item.author}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-white/20 text-[9px] uppercase tracking-[0.2em]">{item.role}</span>
                                    <div className="w-[1px] h-2 bg-white/10" />
                                    <span className="text-noir-gold text-[8px] uppercase tracking-[0.2em] font-bold italic">{item.source}</span>
                                </div>
                            </div>
                         </div>

                         {/* Background Identification Artifact */}
                         <div className="absolute top-10 right-10 text-white/[0.02] font-black text-8xl italic group-hover:text-white/[0.04] transition-all">
                            0{idx + 1}
                         </div>
                    </motion.div>
                ))}
            </div>

            {/* Press Logotypes (Abstract) */}
            <div className="mt-32 pt-16 flex flex-wrap items-center justify-center gap-16 lg:gap-32 opacity-20 hover:opacity-40 transition-opacity">
                {["VOGUE", "ELLE", "GQ", "HYPEBEAST", "BAZAAR"].map(brand => (
                    <span key={brand} className="text-white font-playfair text-2xl lg:text-3xl tracking-[0.3em] font-black italic">{brand}</span>
                ))}
            </div>
        </section>
    );
}
