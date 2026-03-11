"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

/**
 * Maison NOIR Global Cart Hub
 * High-fidelity requisition management for elite collectors.
 */
export default function CartPage() {
    const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const totalPrice = getSubtotal();
    const shipping = 0; // Global Luxury complimentary shipping
    const tax = totalPrice * 0.12;
    const finalTotal = totalPrice + shipping + tax;

    return (
        <main className="min-h-screen bg-noir-black pt-32 pb-48 px-6 lg:px-24">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-20 space-y-6">
                    <div className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                        <ShoppingBag size={14} />
                        Maison Curation / Requisition
                    </div>
                    <h1 className="text-4xl md:text-7xl font-playfair text-white tracking-tighter italic">
                        Your Selection
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Item List */}
                    <div className="lg:col-span-8 space-y-12">
                        {items.length > 0 ? (
                            <div className="space-y-12">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.size}`}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="group flex flex-col md:flex-row gap-8 pb-12 border-b border-white/5"
                                        >
                                            <Link href={`/product/${item.id}`} className="relative w-full md:w-48 aspect-[3/4] bg-noir-surface rounded-2xl overflow-hidden group-hover:shadow-[0_0_30px_rgba(198,169,114,0.1)] transition-all">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                                />
                                            </Link>

                                            <div className="flex-1 flex flex-col justify-between py-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-playfair text-white italic tracking-tight">{item.name}</h3>
                                                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-black">Size: {item.size} / Obsidian Series</p>
                                                    </div>
                                                    <p className="text-noir-gold font-inter font-medium tracking-wider">₹{(item.priceAmount * item.quantity).toLocaleString()}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-8">
                                                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-full px-6 py-3">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                            className="text-white/40 hover:text-noir-gold transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                            className="text-white/40 hover:text-noir-gold transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button 
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-[9px] uppercase tracking-[0.3em] text-red-500/50 hover:text-red-500 transition-all font-black flex items-center gap-2 group/del"
                                                    >
                                                        <Trash2 size={12} className="group-hover/del:animate-bounce" />
                                                        Relinquish
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="py-24 text-center space-y-12">
                                <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                    <ShoppingBag size={32} className="text-noir-gold" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-playfair text-white italic">The Archive is Empty</h2>
                                    <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black">Begin your journey through our collections</p>
                                </div>
                                <Link href="/collections" className="inline-block py-5 px-12 bg-white text-noir-black text-[10px] uppercase tracking-[0.5em] font-black rounded-full hover:bg-noir-gold transition-all">
                                    Explore Acquisitions
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8">
                        <div className="glass-effect bg-noir-surface/40 p-10 rounded-[3rem] border border-white/5 space-y-12">
                            <h3 className="text-sm uppercase tracking-[0.4em] text-white font-black italic">Estate Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-white/30 font-black">Subtotal</span>
                                    <span className="text-white font-medium">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-white/30 font-black">Concierge Delivery</span>
                                    <span className="text-green-500 font-bold italic tracking-[0.2em]">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="text-white/30 font-black">Estimated Tax (GST)</span>
                                    <span className="text-white font-medium">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex justify-between items-baseline pt-4">
                                    <span className="text-sm uppercase tracking-[0.5em] text-noir-gold font-black">Total</span>
                                    <span className="text-3xl font-playfair text-white italic tracking-tighter">₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link 
                                href="/checkout"
                                className="block w-full py-7 bg-noir-gold text-noir-black text-center text-[11px] uppercase tracking-[0.6em] font-black rounded-2xl hover:bg-white transition-all shadow-2xl shadow-noir-gold/20 active:scale-95"
                            >
                                Initiate Requisition
                            </Link>

                            <div className="flex items-center gap-4 justify-center opacity-30">
                                <ShieldCheck size={14} className="text-noir-gold" />
                                <span className="text-[8px] uppercase tracking-[0.4em] text-white font-black italic">Secure Sovereign Encryption</span>
                            </div>
                        </div>

                        {/* Continue Discovery */}
                        <Link href="/collections" className="flex items-center justify-between p-8 border border-white/5 rounded-[2rem] hover:border-noir-gold/30 transition-all group">
                             <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Return to Showcase</span>
                             <ArrowRight size={16} className="text-white/10 group-hover:text-noir-gold group-hover:translate-x-2 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
