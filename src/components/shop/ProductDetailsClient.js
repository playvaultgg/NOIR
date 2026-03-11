"use client";

import { motion } from "framer-motion";
import {
    ChevronDown,
    ShoppingBag,
    Heart,
    ShieldCheck,
    Truck,
    RotateCcw,
    Share2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Product3DViewer from "@/components/shop/Product3DViewer";
import StickyCartBar from "@/components/shop/StickyCartBar";
import { useCart } from "@/store/useCart";

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailsClient({ product }) {
    const [openDetail, setOpenDetail] = useState(0);
    const galleryRef = useRef(null);
    const { addItem } = useCart();

    useEffect(() => {
        // Reveal animation
        gsap.from(".pdp-reveal", {
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out"
        });
    }, []);

    return (
        <main className="min-h-screen bg-black text-white">
            {/* MOBILE STICKY CTA */}
            <StickyCartBar product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* LEFT SIDE: SCROLLED GALLERY */}
                <section className="w-full lg:w-[60%] xl:w-[65%] space-y-4 lg:space-y-6 lg:p-6 p-0 overflow-visible">

                    {/* 3D VIEWER (High-end entry) */}
                    <div className="pdp-reveal">
                        <Product3DViewer />
                    </div>

                    {/* IMAGE GRID */}
                    <div ref={galleryRef} className="flex flex-col gap-4 lg:gap-6">
                        {product.images.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 1 }}
                                className="w-full aspect-[3/4] bg-charcoal/5 relative overflow-hidden group"
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} View ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* RIGHT SIDE: STICKY INFO PANEL */}
                <section className="w-full lg:w-[40%] xl:w-[35%] lg:h-screen lg:sticky lg:top-0 p-8 lg:p-24 flex flex-col justify-center bg-black/40 backdrop-blur-xl border-l border-white/5">

                    <div className="space-y-12">

                        {/* PRODUCT HEADER */}
                        <header className="space-y-4">
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-gold/60 font-medium pdp-reveal">
                                <span>{product.brand}</span>
                                <button className="hover:text-gold transition-colors"><Share2 size={16} strokeWidth={1.5} /></button>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair tracking-tight pdp-reveal">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6 pdp-reveal pt-2">
                                <p className="text-2xl font-inter font-bold italic tracking-widest text-gold italic">
                                    ${product.price ? product.price.toLocaleString() : "2,450"}.00
                                </p>
                                <span className="text-[10px] uppercase tracking-[0.22em] text-white/30 border-l border-white/10 pl-6">Highly Limited Edition</span>
                            </div>
                        </header>

                        {/* DESCRIPTION */}
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-light font-inter tracking-wide max-w-sm pdp-reveal">
                            {product.description}
                        </p>

                        {/* CTAs */}
                        <div className="space-y-6 pt-4 pdp-reveal">
                            <button
                                onClick={() => addItem(product)}
                                className="w-full h-16 bg-gold text-black text-[12px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-4 group hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20"
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                Add to Bag
                                <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-100 -m-[1px] transition-opacity" />
                            </button>

                            <button className="w-full h-14 bg-transparent border border-white/10 text-white/80 text-[11px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-4 hover:border-gold hover:text-gold transition-all duration-300">
                                <Heart size={16} strokeWidth={1.5} />
                                Move to Wishlist
                            </button>
                        </div>

                        {/* ACCORDION DETAILS */}
                        <div className="space-y-0 border-t border-white/10 pdp-reveal pt-4">
                            {product.details.map((item, i) => (
                                <div key={i} className="border-b border-white/5">
                                    <button
                                        onClick={() => setOpenDetail(openDetail === i ? -1 : i)}
                                        className="w-full py-6 flex items-center justify-between group"
                                    >
                                        <span className="text-[11px] uppercase tracking-[0.3em] text-white/80 group-hover:text-gold transition-colors">{item.title}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-white/20 transition-transform duration-500 ${openDetail === i ? "rotate-180 text-gold" : ""}`}
                                        />
                                    </button>
                                    {openDetail === i && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="pb-8 text-[11px] leading-relaxed text-white/40 uppercase tracking-widest font-light"
                                        >
                                            {item.content}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* TRUST INDICATORS */}
                        <div className="grid grid-cols-3 gap-4 pt-12 pdp-reveal">
                            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-charcoal/30 border border-white/5 rounded-2xl">
                                <ShieldCheck size={18} className="text-gold/40" />
                                <span className="text-[8px] uppercase tracking-widest text-white/30">Verified Auth</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-charcoal/30 border border-white/5 rounded-2xl">
                                <Truck size={18} className="text-gold/40" />
                                <span className="text-[8px] uppercase tracking-widest text-white/30">Express Ship</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-charcoal/30 border border-white/5 rounded-2xl">
                                <RotateCcw size={18} className="text-gold/40" />
                                <span className="text-[8px] uppercase tracking-widest text-white/30">Easy Returns</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}
