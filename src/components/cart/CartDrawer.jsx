"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const { items, isOpen, closeCart, increaseQty, decreaseQty, removeItem, getSubtotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Blur Layer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-noir-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer Slide Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-noir-surface border-l border-white/5 z-[101] flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Elegant Header with Noise Overlay */}
                        <div className="flex items-center justify-between p-8 border-b border-white/5 relative bg-gradient-to-r from-noir-black to-noir-surface">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                            <h2 className="text-2xl font-playfair tracking-[0.05em] text-white">Your Selection</h2>
                            <button
                                onClick={closeCart}
                                className="p-3 hover:bg-white/5 rounded-full transition-all group flex items-center gap-2"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Close</span>
                                <X strokeWidth={1} size={22} className="text-white/60 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Cinematic Cart Content list */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col gap-8">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-6">
                                    <ShoppingBag size={64} strokeWidth={0.5} className="text-noir-gold/20" />
                                    <div className="text-center">
                                        <p className="font-playfair text-xl text-white/60 mb-2 italic">Awaits Your Curation</p>
                                        <p className="font-inter uppercase tracking-[0.2em] text-[10px]">Your bag is currently empty.</p>
                                    </div>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-6 group relative">
                                        {/* Thumbnail Image with Zoom Hover */}
                                        <div className="relative w-28 h-40 flex-shrink-0 bg-noir-black overflow-hidden border border-white/5">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                        </div>

                                        {/* Metadata Engine */}
                                        <div className="flex flex-col flex-1 justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-sm font-semibold tracking-wider text-white uppercase leading-relaxed font-inter">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-white/20 hover:text-white transition-colors p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[9px] text-noir-gold uppercase tracking-[0.25em] mt-3 font-semibold px-2 py-0.5 border border-noir-gold/20 inline-block bg-noir-gold/5">
                                                    Size: {item.size}
                                                </p>
                                            </div>

                                            {/* Precise Quantity & Luxury Price Control */}
                                            <div className="flex items-center justify-between w-full mt-6">
                                                <div className="flex items-center bg-black/40 border border-white/5 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => decreaseQty(item.id, item.size)}
                                                        className="p-1.5 hover:text-noir-gold transition-colors text-white/40"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-[11px] w-6 text-center font-bold font-inter text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => increaseQty(item.id, item.size)}
                                                        className="p-1.5 hover:text-noir-gold transition-colors text-white/40"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-white/50 line-through mb-0.5">₹{((item.priceAmount || 0) * 1.2).toLocaleString()}</p>
                                                    <p className="text-lg tracking-tight text-white font-medium">
                                                        ₹{(item.priceAmount || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Premium Checkout Action */}
                        {items.length > 0 && (
                            <div className="p-8 pb-10 bg-noir-black/40 backdrop-blur-xl border-t border-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40">Bag Total</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-playfair tracking-wider block text-white">
                                            ₹{(subtotal || 0).toLocaleString()}
                                        </span>
                                        <span className="text-[9px] text-noir-gold font-inter uppercase tracking-widest font-bold">Complimentary Shipping</span>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={closeCart}>
                                    <button className="w-full relative group overflow-hidden bg-white text-noir-black py-5 flex items-center justify-center font-black rounded-sm shadow-2xl shadow-white/5">
                                        <span className="absolute inset-0 bg-noir-gold w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                        <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] transform transition-all duration-500 group-hover:-translate-y-px">
                                            Secure Checkout
                                        </span>
                                    </button>
                                </Link>

                                <p className="mt-6 text-[8px] text-white/20 uppercase tracking-[0.3em] text-center italic">
                                    Curated for the refined collector.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
