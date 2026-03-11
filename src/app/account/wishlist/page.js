"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/products/ProductCard";
import { Heart, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleMoveToCart = (product) => {
        addItem({ ...product, size: "M" });
        removeItem(product.id);
    };

    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-gradient-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-inter mb-4">
                            Your Selection
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-playfair text-white tracking-tight">
                            The Collection
                        </h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium italic">
                            {items.length} Curated Masterpieces Saved
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/collections">
                            <button className="glass-effect bg-noir-gold/10 border border-noir-gold/20 text-noir-gold px-6 py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-noir-gold hover:text-noir-black transition-all flex items-center gap-2">
                                Add more to Collection
                                <ArrowUpRight size={14} />
                            </button>
                        </Link>
                    </div>
                </header>

                {items.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-noir-gold/5 rounded-full flex items-center justify-center border border-noir-gold/10 text-noir-gold mb-8 animate-pulse shadow-2xl shadow-noir-gold/10">
                            <Heart size={40} strokeWidth={0.5} />
                        </div>
                        <h3 className="text-3xl font-playfair text-white mb-4 italic">No Masterpieces Yet</h3>
                        <p className="text-sm font-inter text-white/40 max-w-sm font-light uppercase tracking-widest leading-loose">
                            Start your curation by hearting the pieces that resonate with your identity.
                        </p>
                        <Link href="/collections" className="mt-12 group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-noir-gold hover:text-white transition-all">
                            Launch Boutique
                            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-x-10 md:gap-y-14">
                        <AnimatePresence>
                            {items.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative"
                                >
                                    <ProductCard product={product} />

                                    {/* Secondary Management Controls below ProductCard */}
                                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <button
                                            onClick={() => handleMoveToCart(product)}
                                            className="flex-1 glass-effect bg-white/5 border border-white/5 p-3 rounded-lg text-white/50 hover:text-white hover:bg-noir-gold/10 hover:border-noir-gold/20 transition-all text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 font-bold"
                                        >
                                            <ShoppingBag size={12} />
                                            Move to Selection
                                        </button>
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-lg text-red-500/40 hover:text-red-500 transition-all"
                                            title="Remove Curiosity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
