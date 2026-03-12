"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, BOX, Box } from "lucide-react";
import ProductZoom from "./ProductZoom";
import QuickLook3D from "@/components/3d/QuickLook3D";

export default function ProductGallery({ images = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [is3DMode, setIs3DMode] = useState(false);

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Main High-Fidelity Stage */}
            <div className="relative aspect-[3/4] w-full bg-noir-surface/10 rounded-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                    {is3DMode ? (
                        <motion.div
                            key="3d-mode"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full relative z-10"
                        >
                            <QuickLook3D color="#C6A972" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={images[activeIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full relative"
                        >
                            <ProductZoom image={images[activeIndex]} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ambient Overlay for Cinematic Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir-black/40 via-transparent to-transparent pointer-events-none" />

                {/* 3D Mode Toggle Button */}
                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => setIs3DMode(!is3DMode)}
                        className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl glass-effect border transition-all duration-500 ${is3DMode ? "bg-noir-gold border-noir-gold text-noir-black shadow-[0_0_30px_rgba(198,169,114,0.4)]" : "bg-white/5 border-white/10 text-white hover:border-noir-gold/50"}`}
                    >
                        <Box size={16} className={is3DMode ? "animate-pulse" : "group-hover:rotate-12 transition-transform"} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">
                            {is3DMode ? "Exiting 3D Archive" : "Digital Twin Mode"}
                        </span>
                        {!is3DMode && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-noir-gold rounded-full animate-ping" />
                        )}
                    </button>
                </div>

                {/* Dynamic Controls (Only in 2D) */}
                {!is3DMode && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={prevImage}
                            className="w-12 h-12 rounded-full glass-effect bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-noir-gold hover:text-noir-black transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white px-4 py-2 glass-effect rounded-full bg-black/40 border border-white/5">
                            {activeIndex + 1} / {images.length}
                        </span>

                        <button
                            onClick={nextImage}
                            className="w-12 h-12 rounded-full glass-effect bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-noir-gold hover:text-noir-black transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Zoom Hint (Only in 2D) */}
                {!is3DMode && (
                    <div className="absolute top-6 right-6 p-4 glass-effect rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} className="text-white/40" />
                    </div>
                )}
            </div>

            {/* Curation Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-500 ${activeIndex === idx
                                ? "border-noir-gold shadow-lg shadow-noir-gold/20 scale-95"
                                : "border-transparent opacity-40 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`View ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="10vw"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
