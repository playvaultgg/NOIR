"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState } from "react";

function ReviewCard({ item, idx }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative whitespace-normal glass-effect bg-white/[0.01] p-12 lg:p-16 rounded-[4rem] border border-white/5 space-y-10 flex flex-col justify-between group hover:border-noir-gold/20 hover:bg-white/[0.03] transition-all duration-1000 perspective-[1500px]"
        >
            {/* Grain Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none rounded-[4rem] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] repeat" />
            </div>

            <div className="relative z-10 space-y-10" style={{ transform: "translateZ(60px)" }}>
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-noir-gold/10 group-hover:text-noir-gold transition-all duration-1000 w-fit"
                >
                    <Quote size={56} strokeWidth={0.5} />
                </motion.div>
                <p className="text-white font-playfair text-xl md:text-2xl leading-relaxed italic tracking-tight">
                    &ldquo;{item.quote}&rdquo;
                </p>
            </div>

            <div className="relative z-10 space-y-8 pt-12 border-t border-white/5" style={{ transform: "translateZ(40px)" }}>
                <div className="flex gap-2 text-noir-gold">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.2 + i * 0.1 }}
                        >
                            <Star size={12} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(198,169,114,0.3)]" />
                        </motion.div>
                    ))}
                </div>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-white text-[12px] uppercase tracking-[0.4em] font-black mb-2">{item.author}</h4>
                        <div className="flex items-center gap-4">
                            <span className="text-white/30 text-[9px] uppercase tracking-[0.3em] font-medium">{item.role}</span>
                            <div className="w-1.5 h-[1px] bg-noir-gold/30" />
                            <span className="text-noir-gold text-[8px] uppercase tracking-[0.3em] font-black italic">{item.source}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Identification Artifact */}
            <motion.div 
                style={{ transform: "translateZ(-30px)" }}
                className="absolute top-12 right-12 text-white/[0.015] font-black text-[12rem] italic group-hover:text-white/[0.04] group-hover:scale-110 transition-all duration-1000 pointer-events-none select-none leading-none"
            >
                {idx + 1}
            </motion.div>
            
            {/* Card Glow */}
            <div className="absolute inset-0 bg-noir-gold/5 opacity-0 group-hover:opacity-100 blur-[120px] transition-opacity duration-1000 rounded-[4rem] pointer-events-none" />
        </motion.div>
    );
}

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
        <section className="py-20 lg:py-28 bg-noir-black relative px-6 lg:px-24 overflow-hidden">
            {/* Visual Depth Background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            <header className="mb-20 text-center space-y-4 relative z-10">
                <motion.h4 
                    initial={{ opacity: 0, letterSpacing: "1em" }}
                    whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
                    className="text-noir-gold text-[10px] uppercase font-black italic"
                >
                    The Maison Legacy
                </motion.h4>
                <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight"
                >
                    Loved by Collectors <br /> Worldwide
                </motion.h3>
            </header>

            <div className="relative z-10 overflow-hidden border-y border-white/5 bg-[#0A0A0A]/30 backdrop-blur-sm py-16">
                <motion.div
                    className="flex whitespace-nowrap gap-12 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                >
                    {[...reviews, ...reviews, ...reviews, ...reviews].map((item, idx) => (
                        <div key={`${item.author}-${idx}`} className="w-[420px] shrink-0">
                            <ReviewCard item={item} idx={idx % reviews.length} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Upgraded Press Section (Compact) */}
            <div className="mt-24 pt-16 border-t border-white/5 relative z-10 overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap gap-24 items-center opacity-40 hover:opacity-80 transition-opacity duration-1000"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-24 items-center">
                            {["VOGUE", "ELLE", "GQ", "HYPEBEAST", "BAZAAR", "HARPER'S BAZAAR", "ROBB REPORT", "WALLPAPER*"].map((brand) => (
                                <span 
                                    key={brand} 
                                    className="text-white font-playfair text-xl lg:text-3xl tracking-[0.4em] font-black italic cursor-default hover:text-noir-gold transition-colors duration-500 px-12"
                                >
                                    {brand}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />
        </section>
    );
}
