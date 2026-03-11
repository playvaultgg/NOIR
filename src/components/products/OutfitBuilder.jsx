"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingBag, X, Sparkles, Move } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

/**
 * Maison NOIR Personal Outfit Builder
 * Phase 10 Metaverse Layer (Teaser).
 * Features:
 * - Multi-garment Synthesis
 * - Drag & Drop Visual Layout (Mock)
 * - Bulk Acquisition Logic
 */
export default function OutfitBuilder({ isOpen, onClose, initialProduct }) {
    const [outfitItems, setOutfitItems] = useState(initialProduct ? [initialProduct] : []);
    const addItem = useCartStore(state => state.addItem);

    const handleAddEntireLook = () => {
        outfitItems.forEach(item => {
            addItem({
                ...item,
                quantity: 1,
                image: item.images?.[0] || item.image,
                size: "M"
            });
        });
        onClose();
    };

    const totalValue = outfitItems.reduce((acc, item) => acc + (item.priceAmount || 0), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-y-0 right-0 z-[250] w-full lg:w-[600px] bg-[#111111] shadow-2xl flex flex-col p-12"
                >
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black">
                                <Sparkles size={14} />
                                ARCHIVE SYNTHESIS / LOOK BUILDER
                            </div>
                            <h2 className="text-3xl font-playfair text-white italic">Curate the Ensemble</h2>
                        </div>
                        <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-full transition-colors text-white/40">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/5 border-dashed min-h-[400px]">
                            {outfitItems.map((item, i) => (
                                <motion.div 
                                    layoutId={item.id}
                                    key={i}
                                    className="relative aspect-[3/4] bg-noir-black rounded-xl overflow-hidden group border border-white/5"
                                >
                                    <img src={item.images?.[0] || item.image} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <p className="text-[10px] text-white font-bold tracking-widest truncate">{item.name}</p>
                                    </div>
                                    <button 
                                        onClick={() => setOutfitItems(prev => prev.filter(p => p.id !== item.id))}
                                        className="absolute top-2 right-2 p-2 bg-black/40 text-white/40 hover:text-red-500 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}
                            {outfitItems.length < 4 && (
                                <div className="flex items-center justify-center border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center gap-4 text-white/20 group-hover:text-noir-gold transition-colors">
                                        <Plus size={32} strokeWidth={1} />
                                        <span className="text-[9px] uppercase tracking-[0.4em]">Add Complement</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                             <div className="flex justify-between items-center text-white/40 text-[10px] uppercase tracking-widest font-black">
                                <span>Look Density</span>
                                <span>{outfitItems.length} / 4 Items</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(outfitItems.length / 4) * 100}%` }}
                                    className="h-full bg-noir-gold shadow-[0_0_10px_rgba(198,169,114,0.5)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-6 pt-12 border-t border-white/5">
                        <div className="flex justify-between items-end">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest font-black">Total Acquisition</span>
                            <span className="text-4xl font-playfair text-noir-gold italic">₹{totalValue.toLocaleString()}</span>
                        </div>
                        <button 
                            disabled={outfitItems.length === 0}
                            onClick={handleAddEntireLook}
                            className="w-full py-6 bg-white text-noir-black text-[12px] uppercase tracking-[0.5em] font-black rounded-2xl hover:bg-noir-gold transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
                        >
                            <ShoppingBag size={18} />
                            Acquire Full Ensemble
                            <Move size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-40" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
