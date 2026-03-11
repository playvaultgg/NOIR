"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/**
 * Maison Collection Showcase
 * High-fidelity grid for thematic discovery.
 * Features:
 * - Ken Burns Zoom on Hover
 * - Reveal Titles
 * - Cinematic Masking
 */
export default function CollectionShowcase() {
    const collections = [
        {
            title: "Menswear",
            subtitle: "The Noir Silhouette",
            image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1974&auto=format&fit=crop",
            href: "/collections",
            span: "lg:col-span-1"
        },
        {
            title: "Womenswear",
            subtitle: "Eternal Elegance",
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
            href: "/collections",
            span: "lg:col-span-2"
        },
        {
            title: "Seasonal Drops",
            subtitle: "Archive AW26",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
            href: "/collections",
            span: "lg:col-span-3"
        }
    ];

    return (
        <section className="py-24 lg:py-40 px-6 lg:px-24 bg-noir-black relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             
             <header className="mb-20 space-y-4">
                <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">The Archive</h4>
                <h3 className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic">Signature Collections</h3>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {collections.map((item, i) => (
                    <Link 
                        key={item.title} 
                        href={item.href}
                        className={`group relative overflow-hidden rounded-3xl h-[600px] bg-noir-surface border border-white/5 ${item.span}`}
                    >
                        {/* Immersive Image Layer */}
                        <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                            <Image 
                                src={item.image} 
                                alt={item.title} 
                                fill 
                                className="object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                        </div>

                        {/* Content Reveal Layer */}
                        <div className="absolute bottom-10 left-10 z-20 space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="text-noir-gold text-[9px] uppercase tracking-[0.4em] font-black">{item.subtitle}</span>
                                <h4 className="text-3xl md:text-4xl font-playfair text-white italic tracking-tight m-1">{item.title}</h4>
                            </motion.div>
                            
                            <div className="w-0 h-[1px] bg-white transition-all duration-700 group-hover:w-full opacity-20" />
                            
                            <p className="text-white/20 text-[8px] uppercase tracking-[0.6em] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                                View Selection
                            </p>
                        </div>

                        {/* Visual Artifact: Glass Number */}
                        <div className="absolute top-10 right-10 text-white/5 font-playfair text-8xl italic select-none">
                            0{i + 1}
                        </div>
                    </Link>
                ))}
             </div>
        </section>
    );
}
