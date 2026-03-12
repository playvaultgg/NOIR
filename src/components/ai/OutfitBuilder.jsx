"use client";

import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Plus, Sparkle, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import GarmentTryOn from "../avatar/GarmentTryOn";
import { AnimatePresence } from "framer-motion";

export default function OutfitBuilder({ baseProduct }) {
    const [outfit, setOutfit] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        async function fetchOutfit() {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/ai/outfit?productId=${baseProduct.id}`);
                const items = await res.json();
                if (Array.isArray(items)) {
                    setOutfit(items);
                }
            } catch (err) {
                console.error("FAILED_TO_FETCH_OUTFIT:", err);
            } finally {
                setIsLoading(false);
            }
        }
        if (baseProduct?.id) fetchOutfit();
    }, [baseProduct?.id]);

    if (isLoading || outfit.length === 0) return null;

    const fullLook = [baseProduct, ...outfit];
    const totalPrice = fullLook.reduce((acc, item) => {
        const price = typeof item.price === 'string'
            ? parseInt(item.price.replace(/[^\d]/g, ''))
            : (item.priceAmount || 0);
        return acc + price;
    }, 0);

    const handleAddFullLook = () => {
        fullLook.forEach(item => {
            addItem({
                ...item,
                quantity: 1,
                size: "M" // Default for quick add
            });
        });
    };

    return (
        <section className="py-32 border-t border-white/5 mt-32">
            <div className="flex flex-col items-center text-center space-y-6 mb-20">
                <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black">
                    <Sparkles size={14} />
                    Maison Stylist AI
                </div>
                <h2 className="text-4xl lg:text-7xl font-playfair text-white italic tracking-tight">
                    The Complete Silhouette
                </h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 max-w-sm leading-relaxed">
                    Our neural stylist has curated a unified appearance to complement your selection.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
                {fullLook.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className="relative group"
                    >
                        <div className="w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 relative bg-noir-surface/10">
                            <Image
                                src={item.images?.[0] || item.image}
                                alt={item.name}
                                fill
                                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-noir-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="mt-6 text-center space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white font-bold">{item.name}</h4>
                            <p className="text-[10px] text-noir-gold font-bold">{item.price}</p>
                        </div>

                        {idx < fullLook.length - 1 && (
                            <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block text-white/10">
                                <Plus size={24} strokeWidth={1} />
                            </div>
                        )}
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="lg:ml-12 p-12 glass-effect bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-8 min-w-[300px]"
                >
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-white/30">Investment Total</p>
                        <p className="text-4xl font-playfair text-white italic tracking-tight font-bold">
                            ₹{totalPrice.toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setIsTryOnOpen(true)}
                            className="w-full h-16 bg-noir-surface/40 border border-white/5 hover:border-noir-gold text-noir-gold text-[10px] uppercase tracking-[0.4em] font-black rounded-xl transition-all duration-700 flex items-center justify-center gap-4 group/try"
                        >
                            <UserCheck size={16} className="group-hover/try:animate-pulse" />
                            Try On Full Curation
                        </button>

                        <button
                            onClick={handleAddFullLook}
                            className="w-full h-16 bg-white text-noir-black text-[10px] uppercase tracking-[0.4em] font-black rounded-xl hover:bg-noir-gold transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl shadow-white/5"
                        >
                            <ShoppingBag size={16} />
                            Acquire Complete Look
                        </button>
                    </div>

                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                        Neural Curation includes 3 Masterpieces
                    </p>
                </motion.div>
            </div>

            {/* Phase 8.6: Full Look Immersive Portal */}
            <AnimatePresence>
                {isTryOnOpen && (
                    <GarmentTryOn products={fullLook} onClose={() => setIsTryOnOpen(false)} />
                )}
            </AnimatePresence>
        </section>
    );
}
