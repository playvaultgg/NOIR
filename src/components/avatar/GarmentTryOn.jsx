"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, X, ShoppingBag, ArrowRight, UserPlus, Zap } from "lucide-react";
import AvatarViewer from "./AvatarViewer";

/**
 * Maison Noir Garment Try-On Interface
 * Phase 8.6 Immersive Dressing Logic.
 */
export default function GarmentTryOn({ product, products, onClose }) {
    const displayProducts = products || [product];
    const isFullLook = displayProducts.length > 1;
    
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDressed, setIsDressed] = useState(false);
    const [avatarData, setAvatarData] = useState({
        bodyType: "ATHLETIC",
        skinTone: "#E0AC69"
    });

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setIsDressed(true);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12"
        >
            {/* Immersive Backdrop Overlay */}
            <div className="absolute inset-0 bg-noir-black/95 backdrop-blur-3xl" onClick={onClose} />
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-noir-gold/5 blur-[150px] pointer-events-none rounded-full" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-7xl h-[85vh] grid grid-cols-1 lg:grid-cols-2 bg-noir-surface/40 border border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-xl shadow-[0_0_120px_rgba(0,0,0,0.8)]"
            >
                {/* 3D Viewport Column (Left) */}
                <div className="relative h-[400px] lg:h-full p-6 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
                    <AvatarViewer bodyType={avatarData.bodyType} skinTone={avatarData.skinTone} dressed={isDressed} />
                    
                    {/* Viewport UI Overlays */}
                    <div className="absolute top-16 left-16 flex gap-4 items-center opacity-40">
                         <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                         <span className="text-[10px] uppercase tracking-[0.4em] text-white font-black italic">Live Persona Render Protocol</span>
                    </div>

                    <AnimatePresence>
                        {isSyncing && (
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12 space-y-8"
                             >
                                <div className="w-24 h-24 border border-noir-gold rounded-full flex items-center justify-center animate-spin-slow shadow-[0_0_40px_rgba(197,160,89,0.2)]">
                                     <Sparkles className="text-noir-gold animate-pulse" />
                                </div>
                                <h3 className="text-white font-playfair text-3xl italic tracking-widest">Neural Synthesis...</h3>
                                <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] italic">Mapping garment physics to digital persona</p>
                             </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Information Column (Right) */}
                <div className="p-8 md:p-16 lg:p-20 overflow-y-auto space-y-16 flex flex-col justify-between selection:bg-noir-gold selection:text-noir-black">
                     <header className="space-y-8">
                        <div className="flex justify-between items-start">
                             <div className="space-y-4">
                                <span className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                                    {isFullLook ? "Phase 8.6 / Full Look Synthesis" : "Phase 8.6 / Virtual Try-On"}
                                </span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white tracking-widest italic">
                                    {isFullLook ? "Maison Curation" : displayProducts[0].name}
                                </h2>
                                {isFullLook && (
                                    <div className="flex gap-4 opacity-40">
                                        {displayProducts.map(p => (
                                            <span key={p.id} className="text-[9px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                {p.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                             </div>
                             <button onClick={onClose} className="p-4 bg-white/5 border border-white/5 rounded-full text-white/40 hover:text-white transition-all hover:bg-white/10">
                                <X size={20} />
                             </button>
                        </div>
                        <p className="text-white/40 text-lg md:text-xl font-inter italic leading-relaxed max-w-xl">
                            Experience the {isFullLook ? "complete ensemble" : (displayProducts[0].brand || "Maison Noir")} silhouette. Our synthesis engine predicts drape and texture collisions for the entire curation in real-time.
                        </p>
                     </header>

                     {/* Synthesis Action Board */}
                     <div className="space-y-12">
                         <div className="glass-effect bg-noir-black/40 p-8 rounded-[2rem] border border-white/5 space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] text-white shadow-sm font-black italic">Identity Sync Status</h4>
                            <div className="flex items-center gap-4 text-noir-gold">
                                <UserPlus size={16} />
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black">Silhouette Node: Active</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: isDressed ? "100%" : "65%" }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-noir-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" 
                                />
                            </div>
                         </div>

                         <div className="flex flex-col gap-6">
                            {!isDressed ? (
                                <button
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className="group relative w-full bg-white text-noir-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] shadow-xl shadow-white/5 overflow-hidden active:scale-95 transition-all"
                                >
                                    <span className="absolute inset-0 bg-noir-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        <Zap size={14} />
                                        Construct Synthesis
                                    </span>
                                </button>
                            ) : (
                                <button
                                    className="group relative w-full bg-noir-gold text-noir-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] shadow-xl shadow-noir-gold/20 overflow-hidden active:scale-95 transition-all"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        <ShoppingBag size={14} />
                                        Add Synthesized Look to Cart
                                    </span>
                                </button>
                            )}

                            <button className="flex items-center justify-between py-6 w-full border-b border-white/5 hover:border-noir-gold transition-colors duration-500 group/btn">
                                <span className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black group-hover/btn:text-white transition-all">Consult AI Stylist</span>
                                <ArrowRight className="text-white/10 group-hover/btn:text-noir-gold group-hover/btn:translate-x-2 transition-all" size={14} />
                            </button>
                         </div>
                     </div>

                     {/* Technical Disclaimer UI */}
                     <footer className="pt-8 border-t border-white/5">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-white/10 font-black leading-relaxed italic">
                            Digital persona synthesis is a simulation of the physical silhouette. Drape accuracy is verified to global luxury standards.
                        </p>
                     </footer>
                </div>
            </motion.div>
        </motion.div>
    );
}
