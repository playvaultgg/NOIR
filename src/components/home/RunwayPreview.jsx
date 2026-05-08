"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Zap } from "lucide-react";
import { Suspense, useRef, useState } from "react";

function RunwaySilhouette() {
    return (
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale brightness-50"
                alt="Luxury Runway"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>
    );
}

function LookCard({ i }) {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.8 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="flex items-center gap-8 shrink-0 px-12 py-8 group grayscale hover:grayscale-0 transition-all duration-700 relative perspective-[1000px]"
        >
            <motion.div 
                style={{ transform: "translateZ(60px)" }}
                className="w-16 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-noir-gold/50 group-hover:shadow-[0_0_40px_rgba(198,169,114,0.15)] transition-all duration-500"
            >
                <div className="w-0.5 h-12 bg-noir-gold/20 group-hover:bg-noir-gold animate-pulse" />
            </motion.div>
            
            <div className="flex flex-col" style={{ transform: "translateZ(40px)" }}>
                <span className="text-white font-playfair italic text-xl">Look 0{i + 1}</span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#C6A972]/40 font-black italic">Silk Obsidian</span>
                
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 10 }}
                            className="overflow-hidden"
                        >
                            <p className="text-[7px] text-noir-gold/60 uppercase tracking-[0.3em] mt-3 font-black">
                                Archive Piece / SS26
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Subtle card glow on hover */}
            <div className="absolute inset-0 bg-noir-gold/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
}

export default function RunwayPreview() {
    return (
        <section className="py-24 lg:py-40 bg-noir-black relative overflow-hidden">
            {/* High-end Grain Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] repeat" />
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-24 relative z-10">
                <header className="mb-20 text-center space-y-4">
                    <motion.h4 
                        initial={{ opacity: 0, letterSpacing: "1em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                        className="text-noir-gold text-[10px] uppercase font-black italic"
                    >
                        Maison Events
                    </motion.h4>
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic"
                    >
                        The Virtual Runway
                    </motion.h3>
                </header>

                <div className="relative aspect-[21/9] w-full bg-[#050505] rounded-[2rem] overflow-hidden group border border-white/5 shadow-2xl">
                     {/* Static Visual Layer */}
                     <RunwaySilhouette />

                     {/* Content Overlay */}
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Link href="/runway" className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-noir-gold hover:text-noir-black transition-all duration-500 group/btn shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                                <Play size={32} fill="currentColor" className="ml-2" />
                                <div className="absolute inset-0 rounded-full border border-noir-gold/50 animate-ping opacity-0 group-hover/btn:opacity-100" />
                            </Link>
                        </motion.div>
                        
                        <div className="text-center space-y-3">
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black">Archive Invitation</p>
                            <h4 className="text-2xl md:text-3xl font-playfair text-white italic tracking-widest">Midnight Symphony AW26</h4>
                        </div>
                     </div>

                     <div className="absolute top-8 left-8 flex gap-4 opacity-40 z-30">
                        <Zap size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white font-black italic">Neural Projection Stream</span>
                     </div>
                </div>

                {/* Upgraded Marquee Section */}
                <div className="relative mt-24 mb-12 flex overflow-hidden border-y border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm py-12">
                    <motion.div
                        className="flex whitespace-nowrap gap-8 items-center"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    >
                        {[...Array(10)].map((_, i) => (
                            <LookCard key={i} i={i} />
                        ))}
                        {[...Array(10)].map((_, i) => (
                            <LookCard key={`dup-${i}`} i={i} />
                        ))}
                    </motion.div>
                </div>

                <div className="mt-12 flex justify-center">
                    <motion.div
                        whileHover={{ y: -2 }}
                    >
                        <Link href="/runway" className="text-[10px] uppercase tracking-[0.4em] text-noir-gold hover:text-white transition-all underline underline-offset-8 decoration-noir-gold/30">
                            Experience the Full Show
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}


