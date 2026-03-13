"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function MuseumArchiveClient({ products }) {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Transform vertical scroll into horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    return (
        <section ref={targetRef} className="relative h-[800vh] bg-[#050505]">
            <Navbar />
            
            {/* ── Fixed Header ── */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden pointer-events-none z-10">
                <div className="px-12 md:px-24">
                   <motion.div 
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 text-[#C6A972] text-[10px] uppercase tracking-[0.6em] font-black italic">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A972] animate-pulse" />
                            Digital Museum / Archive 01
                        </div>
                        <h1 className="text-8xl md:text-[15rem] font-playfair text-white tracking-tighter leading-[0.8] italic">
                            The <span className="text-white/10">Heritage</span> <br />
                            Vault.
                        </h1>
                        <p className="text-white/20 text-sm md:text-xl font-inter max-w-xl italic leading-relaxed pt-10">
                            A non-linear journey through the Maison Noir aesthetic evolution. <br />
                            Scroll to enter the archive.
                        </p>
                    </motion.div>
                </div>

                {/* Background "Museum" Text */}
                <motion.h2 
                    style={{ 
                        x: useTransform(scrollYProgress, [0, 1], [0, -1000]),
                        opacity: useTransform(scrollYProgress, [0, 0.1], [0.03, 0.01])
                    }}
                    className="absolute bottom-0 left-0 text-[30rem] font-playfair text-white whitespace-nowrap leading-none select-none italic"
                >
                    MAISON NOIR ARCHIVE COLLECTION 2024-2026
                </motion.h2>
            </div>

            {/* ── Horizontal Content Container ── */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-24 md:gap-48 px-24 md:px-72 items-center">
                    {/* Intro Card */}
                    <div className="w-[50vw] shrink-0 space-y-12">
                         <div className="w-12 h-px bg-[#C6A972]" />
                         <h2 className="text-6xl md:text-8xl font-playfair text-white italic tracking-tighter">
                             The <br />
                             Sovereign <br />
                             Protocol.
                         </h2>
                         <p className="text-white/40 text-lg font-light max-w-md leading-relaxed">
                            Every silhouette in this vault has been selected for its contribution to the Noir vocabulary. Precision, darkness, and archival integrity.
                         </p>
                    </div>

                    {/* Product Narrative Blocks */}
                    {products.map((product, i) => (
                        <MuseumProductItem key={product.id} product={product} index={i} />
                    ))}

                    {/* Closing Card */}
                    <div className="w-[60vw] shrink-0 flex flex-col items-center justify-center text-center space-y-12 pr-48">
                         <h2 className="text-8xl md:text-[12rem] font-playfair text-white/5 italic tracking-tighter">Fin.</h2>
                         <Link href="/shop" className="group flex items-center gap-6 bg-white text-black px-12 py-6 rounded-full text-[12px] font-black uppercase tracking-[0.4em] hover:bg-[#C6A972] transition-colors">
                             Explore Modern collection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                         </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scrolling Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100px_100px] z-0" />
        </section>
    );
}

function MuseumProductItem({ product, index }) {
    const isEven = index % 2 === 0;

    return (
        <div className={`w-[80vw] md:w-[60vw] shrink-0 flex flex-col ${isEven ? 'justify-start' : 'justify-end'} h-[80vh] relative group`}>
            {/* Product Index */}
            <div className="absolute top-0 left-0 text-[10rem] font-playfair text-white/5 italic leading-none select-none">
                {String(index + 1).padStart(2, '0')}
            </div>

            <div className={`relative w-full h-[60vh] md:h-[70vh] flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center gap-12 md:gap-24`}>
                {/* Image Container */}
                <div className="relative flex-1 h-full rounded-2xl overflow-hidden group-hover:shadow-[0_0_80px_rgba(198,169,114,0.15)] transition-all duration-1000">
                    <Image 
                        src={product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b'} 
                        fill 
                        className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out" 
                        alt={product.name}
                        priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                {/* Info Block */}
                <div className="w-1/3 md:w-1/4 space-y-8 z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[#C6A972] text-[8px] uppercase tracking-[0.4em] font-black italic">{product.category} / Archival</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-playfair text-white tracking-tighter italic leading-none">
                            {product.name.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </h3>
                        <p className="text-[#C6A972] font-mono text-sm font-bold uppercase tracking-widest">{Number(product.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <p className="text-white/30 text-xs md:text-sm leading-relaxed italic font-light">
                            Crafted in our Tokyo archival studio. This silhouette features hand-stitched silk lining and structured onyx-dyed shell.
                        </p>
                        <div className="flex gap-4">
                            <Link href={`/product/${product.id}`} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C6A972] hover:border-[#C6A972]/40 transition-all">
                                <Info size={18} />
                            </Link>
                            <button className="flex-1 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center gap-3 text-white/40 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black transition-all">
                                <ShoppingBag size={14} /> Acquire Piece
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
