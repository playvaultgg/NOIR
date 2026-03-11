"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductGallery from "./ProductGallery";
import VariantSelector from "./VariantSelector";
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState } from "react";
import StickyPurchaseBar from "./StickyPurchaseBar";
import GarmentTryOn from "@/components/avatar/GarmentTryOn";
import ARTryOn from "@/components/ar/ARTryOn";
import OutfitBuilder from "./OutfitBuilder";
import { Camera, Layers } from "lucide-react";

export default function ProductViewClient({ product }) {
    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [isArOpen, setIsArOpen] = useState(false);
    const [isOutfitBuilderOpen, setIsOutfitBuilderOpen] = useState(false);

    const isBookmarked = isInWishlist(product.id);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem({
            ...product,
            quantity: 1,
            image: product.images?.[0] || product.image
        });
        setTimeout(() => setIsAdding(false), 800);
    };

    const toggleWishlist = () => {
        if (isBookmarked) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Visual Presentation Pillar */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7"
            >
                <ProductGallery images={product.images || [product.image]} />
            </motion.div>

            {/* Technical Specification Pillar */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="lg:col-span-5 flex flex-col pt-4 lg:sticky lg:top-32 h-fit"
            >
                <div className="space-y-4 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-noir-gold font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                        Limited Drop
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-playfair text-white tracking-tight leading-none group italic">
                        {product.name}
                    </h1>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-2xl font-playfair text-white opacity-60 tracking-widest">{product.price}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-medium">SKU: {product.id.toUpperCase()}</p>
                    </div>
                </div>

                <div className="py-10">
                    <p className="text-sm leading-relaxed text-white/40 uppercase tracking-widest text-[11px] font-medium lg:max-w-md">
                        An avant-garde exploration of form and texture. Meticulously handcrafted using high-fidelity materials, this piece represents the pinnacle of Maison NOIR curation.
                    </p>
                </div>

                <VariantSelector />

                {/* Acquisition Core */}
                <div className="flex flex-col gap-4 pt-12">
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex-1 h-20 bg-white text-noir-black text-[12px] uppercase tracking-[0.4em] font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-noir-gold transition-all duration-500 shadow-2xl relative overflow-hidden group ${isAdding ? 'scale-95 opacity-80' : ''}`}
                        >
                            <motion.div
                                animate={isAdding ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                                className="flex items-center gap-4"
                            >
                                <ShoppingBag size={20} />
                                Add to Selection
                            </motion.div>

                            {isAdding && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center text-noir-black bg-noir-gold"
                                >
                                    Curated to Bag
                                </motion.div>
                            )}
                        </button>

                        <button
                            onClick={toggleWishlist}
                            className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all duration-500 group ${isBookmarked
                                ? "bg-red-500/10 border-red-500/20 text-red-500"
                                : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            <Heart size={24} className={isBookmarked ? "fill-current" : "group-hover:scale-110 transition-transform"} />
                        </button>
                    </div>

                    {/* Phase 8.6 & 8.8: Immersive Try-On Action Cluster */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <button 
                            onClick={() => setIsTryOnOpen(true)}
                            className="group relative flex-1 h-20 bg-noir-surface/40 border border-white/5 hover:border-noir-gold rounded-2xl text-[10px] uppercase tracking-[0.5em] font-black text-white flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(197,160,89,0.1)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-noir-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Sparkles size={18} className="text-noir-gold group-hover:animate-pulse" />
                            Virtual Persona
                        </button>

                        <button 
                            onClick={() => setIsArOpen(true)}
                            className="group relative flex-1 h-20 bg-noir-surface/20 border border-white/10 hover:border-white rounded-2xl text-[10px] uppercase tracking-[0.5em] font-black text-white/60 hover:text-white flex items-center justify-center gap-4 transition-all duration-700"
                        >
                            <Camera size={18} className="text-noir-gold/50 group-hover:text-noir-gold transition-colors" />
                            Try in AR
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsOutfitBuilderOpen(true)}
                        className="mt-4 group relative w-full h-16 bg-noir-surface/20 border border-white/5 hover:border-noir-gold rounded-2xl text-[10px] uppercase tracking-[0.5em] font-black text-white/40 hover:text-white flex items-center justify-center gap-4 transition-all duration-700"
                    >
                        <Layers size={16} className="text-noir-gold/40 group-hover:text-noir-gold transition-colors" />
                        Synthesize Complete Look
                    </button>
                </div>

                {/* Confidence Markers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 mt-8 border-t border-white/5">
                    <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-noir-gold group-hover:bg-noir-gold/10 transition-colors">
                            <Truck size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">Express Logistics</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Global 2-4 Day Transit</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-noir-gold group-hover:bg-noir-gold/10 transition-colors">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">Noir Assurance</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Lifetime Authenticity</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <StickyPurchaseBar product={product} onAdd={handleAddToCart} />

            {/* Phase 8.6: Immersive Try-On Portal */}
            <AnimatePresence>
                {isTryOnOpen && (
                    <GarmentTryOn product={product} onClose={() => setIsTryOnOpen(false)} />
                )}
            </AnimatePresence>
            {/* Phase 8.8: Immersive AR Portal */}
            <AnimatePresence>
                {isArOpen && (
                    <ARTryOn product={product} onClose={() => setIsArOpen(false)} />
                )}
            </AnimatePresence>
            {/* Phase 10: Outfit Synthesis Engine */}
            <OutfitBuilder 
                isOpen={isOutfitBuilderOpen} 
                onClose={() => setIsOutfitBuilderOpen(false)} 
                initialProduct={product}
            />
        </div>
    );
}
