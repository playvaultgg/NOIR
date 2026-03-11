"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import the 3D scene because it's client-only and uses Three.js
const GarmentScene = dynamic(() => import("./GarmentScene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-noir-black flex items-center justify-center">
             <div className="text-[10px] uppercase tracking-[0.5em] text-noir-gold animate-pulse">
                Constructing Silhouette...
            </div>
        </div>
    )
});

/**
 * Maison Noir Garment Viewer (Virtual Showroom Component)
 * High-end product rotation engine for digital collectors.
 * Features:
 * - 360° Interaction
 * - Cinematic UI Overlays
 * - Responsive Viewport
 * - Phase 8 Advanced Integration
 */
export default function GarmentViewer({ modelUrl }) {
    return (
        <section className="relative w-full aspect-[4/5] lg:aspect-video bg-noir-black rounded-lg overflow-hidden border border-white/5 shadow-2xl">
            {/* Visual Depth Decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-black via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute top-8 left-8 z-20 space-y-2 pointer-events-none">
                <h4 className="text-white text-xs uppercase tracking-[0.5em] font-black italic">Collection AW26</h4>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.3em]">Neural Silhouette Projection</p>
            </div>

            {/* Core 3D Entry Point */}
            <GarmentScene modelUrl={modelUrl} />

            {/* Interactive Hints (Phase 8 UX Enhancement) */}
            <div className="absolute top-8 right-8 z-20 flex items-center gap-6 pointer-events-none">
                <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-end"
                >
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 italic">Rotate for Perspective</span>
                    <div className="w-16 h-px bg-white/10 mt-2 self-end" />
                </motion.div>
            </div>

            {/* Technical Metadata Bar (Bottom Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-6 bg-gradient-to-t from-noir-black via-noir-black/80 to-transparent pointer-events-none">
                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div className="space-y-4">
                        <span className="text-noir-gold text-[9px] uppercase tracking-[0.6em] font-black block">Fabric Detail</span>
                        <h5 className="text-white font-playfair text-xl italic tracking-tight italic">Silk Sateen - 24% Metallic Silk</h5>
                    </div>
                    <div className="text-right space-y-2">
                        <span className="text-white/20 text-[8px] uppercase tracking-[0.3em] block italic">Zoom to Inspect</span>
                        <div className="flex gap-2 justify-end">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-1 bg-noir-gold/30 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
